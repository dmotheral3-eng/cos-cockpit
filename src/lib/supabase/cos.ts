import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/cos";

export async function createCosServerClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.SUPABASE_COS_URL!,
    process.env.SUPABASE_COS_ANON!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — middleware refreshes session
          }
        },
      },
    }
  );
}

// Service-role client for privileged writes (admin grants, etc).
// NEVER import this from a "use client" boundary.
export function createCosServiceClient() {
  return createServerClient<Database>(
    process.env.SUPABASE_COS_URL!,
    process.env.SUPABASE_COS_SERVICE!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      auth: { persistSession: false },
    }
  );
}
