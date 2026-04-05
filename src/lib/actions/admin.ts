"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteStorageFiles } from "@/lib/supabase/storage";
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
  if ("image_url" in data) {
    const { data: old } = await db.from("about_sections").select("image_url").eq("id", id).single();
    if (old?.image_url !== data.image_url) {
      await deleteStorageFiles([old?.image_url]);
    }
  }
  const { error } = await db.from("about_sections").update(data as never).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/about");
  revalidatePath("/[profile]", "layout");
}

export async function deleteAboutSection(id: string) {
  const db = createAdminClient();
  const { data: record } = await db.from("about_sections").select("image_url").eq("id", id).single();
  const { error } = await db.from("about_sections").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await deleteStorageFiles([record?.image_url]);
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

export async function updateAboutSkillsConfig(config: {
  categoryOrder: string[];
  skillsByCategory: Record<string, string[]>;
}) {
  const db = createAdminClient();
  const { error } = await db
    .from("site_settings")
    .upsert({ key: "about_skills", value: config } as never, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/about");
  revalidatePath("/[profile]", "layout");
}

// ─── CONTACT INFO ────────────────────────────────────────────────────────────

export async function upsertContactInfoKey(key: string, value: Record<string, unknown> | unknown[]) {
  const db = createAdminClient();
  const { error } = await db
    .from("contact_info")
    .upsert({ key, value } as never, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/contact");
  revalidatePath("/[profile]/contact", "page");
}

// ─── ABOUT HERO ──────────────────────────────────────────────────────────────

export async function upsertAboutHero(value: Record<string, unknown>) {
  const db = createAdminClient();
  const { error } = await db
    .from("site_settings")
    .upsert({ key: "about_hero", value } as never, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/about");
  revalidatePath("/[profile]/about", "page");
}

export async function upsertAboutBio(profileType: string, content: string) {
  const db = createAdminClient();
  const { error } = await db
    .from("content_variants")
    .upsert(
      {
        entity_type: "about",
        entity_id: "bio",
        profile_type: profileType,
        field_name: "bio",
        content,
      } as never,
      { onConflict: "entity_type,entity_id,profile_type,field_name" }
    );
  if (error) throw new Error(error.message);
  revalidatePath("/admin/about");
  revalidatePath("/[profile]/about", "page");
}

// ─── HOMEPAGE HERO ───────────────────────────────────────────────────────────

export async function upsertHomepageHero(value: Record<string, unknown>, profileType?: string) {
  const db = createAdminClient();
  const key = profileType ? `homepage_hero_${profileType}` : "homepage_hero";
  const { error } = await db
    .from("site_settings")
    .upsert({ key, value } as never, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  revalidatePath("/[profile]", "page");
}

// ─── HOMEPAGE CARDS (Continue Watching + Top Picks) ──────────────────────────

export async function createHomepageCard(data: {
  profile_type: string;
  section: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  link_type: string;
  link_url: string;
  display_order: number;
}) {
  const db = createAdminClient();
  const { error } = await db.from("homepage_cards").insert(data as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/homepage");
  revalidatePath("/[profile]", "page");
}

export async function updateHomepageCard(
  id: string,
  data: {
    title?: string;
    subtitle?: string;
    image_url?: string;
    link_type?: string;
    link_url?: string;
    display_order?: number;
  }
) {
  const db = createAdminClient();
  const { error } = await db.from("homepage_cards").update(data as never).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/homepage");
  revalidatePath("/[profile]", "page");
}

export async function deleteHomepageCard(id: string) {
  const db = createAdminClient();
  const { error } = await db.from("homepage_cards").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/homepage");
  revalidatePath("/[profile]", "page");
}

export async function reorderHomepageCards(orderedIds: string[]) {
  const db = createAdminClient();
  const updates = orderedIds.map((id, i) =>
    db.from("homepage_cards").update({ display_order: i } as never).eq("id", id)
  );
  await Promise.all(updates);
  revalidatePath("/admin/homepage");
  revalidatePath("/[profile]", "page");
}

// ─── HOMEPAGE PROJECT PICKS ─────────────────────────────────────────────────

export async function setHomepageProjectPicks(
  profileType: string,
  projectIds: string[]
) {
  const db = createAdminClient();
  // Remove existing picks for this profile
  await db.from("homepage_project_picks").delete().eq("profile_type", profileType);
  // Insert new picks in order
  if (projectIds.length > 0) {
    const rows = projectIds.map((pid, i) => ({
      profile_type: profileType,
      project_id: pid,
      display_order: i,
    }));
    const { error } = await db.from("homepage_project_picks").insert(rows as never);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/homepage");
  revalidatePath("/[profile]", "page");
}
