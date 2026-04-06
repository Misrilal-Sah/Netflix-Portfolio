import { createAdminClient } from "./admin";

export const STORAGE_BUCKET = "portfolio-images";

/**
 * Extracts the bucket-relative storage path from a Supabase public URL.
 * Returns null if the URL does not point to our Supabase storage bucket.
 *
 * Example:
 *   "https://abc.supabase.co/storage/v1/object/public/portfolio-images/foo/bar.webp"
 *   → "foo/bar.webp"
 */
export function extractStoragePath(url: string | null | undefined): string | null {
  if (!url) return null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  const prefix = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/`;
  if (!url.startsWith(prefix)) return null;
  return decodeURIComponent(url.slice(prefix.length));
}

/**
 * Delete one or more files from Supabase Storage given their public URLs.
 * Non-storage URLs (e.g. local /images/… paths) are silently ignored.
 * Never throws — logs errors to console only.
 */
export async function deleteStorageFiles(
  urls: (string | null | undefined)[]
): Promise<void> {
  const paths = urls.map(extractStoragePath).filter((p): p is string => p !== null);
  if (!paths.length) return;
  const db = createAdminClient();
  const { error } = await db.storage.from(STORAGE_BUCKET).remove(paths);
  if (error) console.error("[storage] delete failed:", error.message);
}
