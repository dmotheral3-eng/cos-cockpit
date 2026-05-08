"use server";

import { createCosServerClient } from "@/lib/supabase/cos";
import type { Database } from "@/types/cos";

export type Artifact = Database["public"]["Tables"]["systems_operations"]["Row"];

export async function listArtifacts(filters?: {
  class?: string;
  status?: string;
  search?: string;
}): Promise<Artifact[]> {
  const cos = await createCosServerClient();
  let q = cos.from("systems_operations").select("*");

  if (filters?.class && filters.class !== "all") {
    q = q.eq("artifact_class", filters.class);
  }
  if (filters?.status === "canonical") q = q.eq("is_canonical", true);
  if (filters?.status === "draft") q = q.eq("is_canonical", false);
  if (filters?.search) {
    const s = filters.search.replace(/[%,]/g, "");
    q = q.or(`slug.ilike.%${s}%,title.ilike.%${s}%`);
  }

  q = q
    .order("is_canonical", { ascending: false })
    .order("artifact_class")
    .order("slug");

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getArtifact(slug: string): Promise<Artifact | null> {
  const cos = await createCosServerClient();
  const { data, error } = await cos
    .from("systems_operations")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}
