"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AboutSectionInsert, AboutSectionUpdate } from "@/lib/types/database";

// ─── CONTACT SUBMISSIONS ─────────────────────────────────────────────────────

export async function markSubmissionRead(id: string, isRead: boolean) {
  const db = createAdminClient();
  const { error } = await db
    .from("contact_submissions")
    .update({ is_read: isRead } as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/contact");
  revalidatePath("/admin");
}

export async function deleteSubmission(id: string) {
  const db = createAdminClient();
  const { error } = await db.from("contact_submissions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/contact");
  revalidatePath("/admin");
}

// ─── ABOUT SECTIONS ──────────────────────────────────────────────────────────

export async function updateAboutSection(id: string, data: AboutSectionUpdate) {
  const db = createAdminClient();
  const { error } = await db.from("about_sections").update(data as never).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/about");
  revalidatePath("/[profile]", "layout");
}

export async function createAboutSection(data: AboutSectionInsert) {
  const db = createAdminClient();
  const { error } = await db.from("about_sections").insert(data as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/about");
  revalidatePath("/[profile]", "layout");
}

// ─── SITE SETTINGS ───────────────────────────────────────────────────────────

export async function upsertSiteSetting(key: string, value: Record<string, unknown>) {
  const db = createAdminClient();
  const { error } = await db
    .from("site_settings")
    .upsert({ key, value } as never, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  revalidatePath("/[profile]", "layout");
}
