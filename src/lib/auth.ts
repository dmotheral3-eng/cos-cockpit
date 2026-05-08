import "server-only";
import { createCosServerClient, createCosServiceClient } from "@/lib/supabase/cos";

export async function getSessionEmail(): Promise<string | null> {
  const cos = await createCosServerClient();
  const {
    data: { user },
  } = await cos.auth.getUser();
  return user?.email ?? null;
}

export async function isAdmin(email: string): Promise<boolean> {
  const service = createCosServiceClient();
  const { data, error } = await service
    .from("cos_admins")
    .select("email")
    .eq("email", email)
    .eq("is_active", true)
    .maybeSingle();
  if (error) return false;
  return !!data;
}

export async function requireAdmin(email: string): Promise<void> {
  const ok = await isAdmin(email);
  if (!ok) throw new Error("not_authorized");
}
