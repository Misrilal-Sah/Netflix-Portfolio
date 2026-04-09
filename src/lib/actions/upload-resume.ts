"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { STORAGE_BUCKET, extractStoragePath } from "@/lib/supabase/storage";

const RESUME_FOLDER = "resumes";

/**
 * Upload a resume PDF to Supabase Storage.
 * Automatically deletes all previous resumes in the `resumes/` folder to save space.
 *
 * @param formData – must contain a "file" entry (File/Blob)
 * @returns public URL of the uploaded resume
 */
export async function uploadResume(formData: FormData): Promise<string> {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  // Only allow PDF
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Only PDF files are supported for resume upload");
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) throw new Error("File too large (max 10MB)");

  const db = createAdminClient();

  // ─── Delete all previous resumes in the folder ──────────────────────────────
  try {
    const { data: existing } = await db.storage.from(STORAGE_BUCKET).list(RESUME_FOLDER);
    if (existing && existing.length > 0) {
      const paths = existing.map((f) => `${RESUME_FOLDER}/${f.name}`);
      await db.storage.from(STORAGE_BUCKET).remove(paths);
    }
  } catch {
    // If listing fails (folder may not exist yet), continue
  }

  // ─── Upload new resume ──────────────────────────────────────────────────────
  const ext = file.name.split(".").pop() || "pdf";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `${RESUME_FOLDER}/${safeName}_${Date.now()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await db.storage
    .from(STORAGE_BUCKET)
    .upload(filename, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = db.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete a resume from Supabase Storage given its public URL.
 */
export async function deleteResume(url: string): Promise<void> {
  const path = extractStoragePath(url);
  if (!path) return;

  const db = createAdminClient();
  const { error } = await db.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}
