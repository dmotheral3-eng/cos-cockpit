"use server";

import { revalidatePath } from "next/cache";
import { createCosServerClient, createCosServiceClient } from "@/lib/supabase/cos";
import { createMasterServiceClient } from "@/lib/supabase/master";
import { getSessionEmail, requireAdmin } from "@/lib/auth";
import type { Json } from "@/types/cos";

type AuditEntry = { step: string; ok: boolean; at: string; error?: string };

type PromoteResult =
  | { ok: true; slug: string; alreadyCanonical?: boolean; audit?: AuditEntry[] }
  | { ok: false; slug: string; partial: true; error: string; audit: AuditEntry[] };

type ArtifactMeta = { [key: string]: Json | undefined };

export async function promoteArtifact(slug: string): Promise<PromoteResult> {
  const email = await getSessionEmail();
  if (!email) throw new Error("not_authenticated");
  await requireAdmin(email);

  const cos = await createCosServerClient();
  const cosService = createCosServiceClient();
  const master = createMasterServiceClient();

  const { data: artifact, error: readErr } = await cos
    .from("systems_operations")
    .select("*")
    .eq("slug", slug)
    .single();
  if (readErr || !artifact) throw new Error("artifact_not_found");

  if (artifact.is_canonical) {
    return { ok: true, slug, alreadyCanonical: true };
  }

  const meta = (artifact.metadata ?? {}) as ArtifactMeta;
  const sourcePath = typeof meta.source_path === "string" ? meta.source_path : null;
  const bytes = typeof meta.bytes === "number" ? meta.bytes : null;
  const audit: AuditEntry[] = [];

  // Write 1 — promote in centripetal-os
  const { error: w1 } = await cosService
    .from("systems_operations")
    .update({ is_canonical: true, status: "published" })
    .eq("slug", slug);
  audit.push({
    step: "update_systems_operations",
    ok: !w1,
    at: new Date().toISOString(),
    error: w1?.message,
  });
  if (w1) throw w1;

  // Write 2 — log intake in master OS
  const filename = sourcePath?.split("/").pop() ?? `${slug}.jsx`;
  const { error: w2 } = await master.from("dave_cockpit_jsx_intake").insert({
    artifact_filename: filename,
    artifact_path: sourcePath,
    artifact_chars: bytes,
    user_signal: "promote_button_click",
    signal_quote: `I like ${slug}, make it canonical`,
    session_context: "cos.centripetal-ai.com promote button",
    proposed_pattern_key: artifact.pattern_key,
    status: "promoted",
    promoted_to_pattern_key: artifact.pattern_key,
    reviewed_at: new Date().toISOString(),
    reviewed_note: `Promoted via COS Cockpit promote button by ${email}`,
  });
  audit.push({
    step: "insert_jsx_intake",
    ok: !w2,
    at: new Date().toISOString(),
    error: w2?.message,
  });

  // Write 3 — approve pattern (idempotent — only if not already approved)
  if (artifact.pattern_key && !w2) {
    const { error: w3 } = await master
      .from("dave_cockpit_jsx_patterns")
      .update({ approved_at: new Date().toISOString(), is_active: true })
      .eq("pattern_key", artifact.pattern_key)
      .is("approved_at", null);
    audit.push({
      step: "approve_pattern",
      ok: !w3,
      at: new Date().toISOString(),
      error: w3?.message,
    });
  }

  // Append audit trail to artifact metadata regardless of write 2/3 outcome
  const existingAudit: Json[] = Array.isArray(meta.promotion_audit)
    ? (meta.promotion_audit as Json[])
    : [];
  const newAuditEntry: Json = {
    by: email,
    at: new Date().toISOString(),
    writes: audit.map((a) => ({
      step: a.step,
      ok: a.ok,
      at: a.at,
      error: a.error ?? null,
    })),
  };
  const nextMeta: Json = {
    ...(meta as { [key: string]: Json | undefined }),
    promotion_audit: [...existingAudit, newAuditEntry],
  };
  await cosService
    .from("systems_operations")
    .update({ metadata: nextMeta })
    .eq("slug", slug);

  if (w2) {
    return { ok: false, slug, partial: true, error: "intake_log_failed", audit };
  }

  revalidatePath("/dashboard");
  return { ok: true, slug, audit };
}
