/**
 * Lightweight read-only Supabase client for Server Components / data fetches.
 * Does not use cookies — public anon reads only.
 * Returns null when env vars are not configured (falls back to static data).
 */
import { createClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: ReturnType<typeof createClient<any>> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDataClient(): ReturnType<typeof createClient<any>> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  if (!_client) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _client = createClient<any>(url, key, {
      auth: { persistSession: false },
    });
  }
  return _client;
}
