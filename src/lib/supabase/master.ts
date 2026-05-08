import "server-only";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/master";

export function createMasterServiceClient() {
  return createServerClient<Database>(
    process.env.SUPABASE_MASTER_URL!,
    process.env.SUPABASE_MASTER_SERVICE!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      auth: { persistSession: false },
    }
  );
}
