"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { STORAGE_BUCKET } from "@/lib/supabase/storage";

/**
 * Upload an image to Supabase Storage using the admin/service-role client.
 * This bypasses RLS so the bucket doesn't need permissive anon policies.
 *
 * @param formData – must contain a "file" entry (File/Blob) and optional "filename"
 * @returns public URL of the uploaded image
 */
export async function uploadImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File | null;
  const filename = (formData.get("filename") as string | null) ?? `${Date.now()}.webp`;

  if (!file) throw new Error("No file provided");

  const buffer = Buffer.from(await file.arrayBuffer());

  const db = createAdminClient();
  const { data, error } = await db.storage
    .from(STORAGE_BUCKET)
    .upload(filename, buffer, {
      contentType: file.type || "image/webp",
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = db.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);

  return publicUrl;
}
