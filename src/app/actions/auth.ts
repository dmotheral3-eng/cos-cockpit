"use server";

import { redirect } from "next/navigation";
import { createCosServerClient } from "@/lib/supabase/cos";

export async function sendMagicLink(
  _prev: { ok?: boolean; error?: string; sentTo?: string } | undefined,
  formData: FormData
): Promise<{ ok?: boolean; error?: string; sentTo?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "email_required" };

  const cos = await createCosServerClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3007";

  const { error } = await cos.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` },
  });

  if (error) return { error: error.message };
  return { ok: true, sentTo: email };
}

export async function signOut() {
  const cos = await createCosServerClient();
  await cos.auth.signOut();
  redirect("/login");
}
