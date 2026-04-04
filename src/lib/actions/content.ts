"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProjectInsert, ProjectUpdate, SkillInsert, SkillUpdate, CertificationInsert, CertificationUpdate } from "@/lib/types/database";

// ─── PROJECTS ────────────────────────────────────────────────────────────────

export async function createProject(data: ProjectInsert) {
  const db = createAdminClient();
  const { error } = await db.from("projects").insert(data as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

export async function updateProject(id: string, data: ProjectUpdate) {
  const db = createAdminClient();
  const { error } = await db.from("projects").update(data as never).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

export async function deleteProject(id: string) {
  const db = createAdminClient();
  const { error } = await db.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

export async function reorderProjects(orderedIds: string[]) {
  const db = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.from("projects").update({ display_order: index } as never).eq("id", id)
    )
  );
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────

export async function createSkill(data: SkillInsert) {
  const db = createAdminClient();
  const { error } = await db.from("skills").insert(data as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/[profile]", "layout");
}

export async function updateSkill(id: string, data: SkillUpdate) {
  const db = createAdminClient();
  const { error } = await db.from("skills").update(data as never).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/[profile]", "layout");
}

export async function deleteSkill(id: string) {
  const db = createAdminClient();
  const { error } = await db.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/[profile]", "layout");
}

export async function reorderSkills(orderedIds: string[]) {
  const db = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.from("skills").update({ display_order: index } as never).eq("id", id)
    )
  );
  revalidatePath("/admin/skills");
  revalidatePath("/[profile]", "layout");
}

// ─── CERTIFICATIONS ──────────────────────────────────────────────────────────

export async function createCertification(data: CertificationInsert) {
  const db = createAdminClient();
  const { error } = await db.from("certifications").insert(data as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certifications");
  revalidatePath("/[profile]", "layout");
}

export async function updateCertification(id: string, data: Partial<CertificationInsert>) {
  const db = createAdminClient();
  const { error } = await db.from("certifications").update(data as never).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certifications");
  revalidatePath("/[profile]", "layout");
}

export async function deleteCertification(id: string) {
  const db = createAdminClient();
  const { error } = await db.from("certifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certifications");
  revalidatePath("/[profile]", "layout");
}

export async function reorderCertifications(orderedIds: string[]) {
  const db = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.from("certifications").update({ display_order: index } as never).eq("id", id)
    )
  );
  revalidatePath("/admin/certifications");
  revalidatePath("/[profile]", "layout");
}

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────

type ExperienceInsert = {
  company: string;
  role: string;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  current?: boolean;
  display_order?: number;
};

export async function createExperience(data: ExperienceInsert) {
  const db = createAdminClient();
  const { error } = await db.from("experience").insert(data as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experience");
  revalidatePath("/[profile]", "layout");
}

export async function updateExperience(id: string, data: Partial<ExperienceInsert>) {
  const db = createAdminClient();
  const { error } = await db.from("experience").update(data as never).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experience");
  revalidatePath("/[profile]", "layout");
}

export async function deleteExperience(id: string) {
  const db = createAdminClient();
  const { error } = await db.from("experience").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experience");
  revalidatePath("/[profile]", "layout");
}
