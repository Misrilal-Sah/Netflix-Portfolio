"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteStorageFiles } from "@/lib/supabase/storage";
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
  if ("screenshot_url" in data) {
    const { data: old } = (await db.from("projects").select("screenshot_url").eq("id", id).single()) as unknown as { data: { screenshot_url: string | null } | null };
    if (old?.screenshot_url !== data.screenshot_url) {
      await deleteStorageFiles([old?.screenshot_url]);
    }
  }
  const { error } = await db.from("projects").update(data as never).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

export async function deleteProject(id: string) {
  const db = createAdminClient();
  const { data: record } = (await db.from("projects").select("screenshot_url").eq("id", id).single()) as unknown as { data: { screenshot_url: string | null } | null };
  const { error } = await db.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await deleteStorageFiles([record?.screenshot_url]);
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

// ─── PROJECT CATEGORIES ──────────────────────────────────────────────────────

export async function createProjectCategory(name: string) {
  const db = createAdminClient();
  const { error } = await db.from("project_categories").insert({ name } as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

export async function updateProjectCategory(id: string, name: string) {
  const db = createAdminClient();
  const { error } = await db.from("project_categories").update({ name } as never).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

export async function deleteProjectCategory(id: string) {
  const db = createAdminClient();
  const { error } = await db.from("project_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

export async function reorderProjectCategories(orderedIds: string[]) {
  const db = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.from("project_categories").update({ display_order: index } as never).eq("id", id)
    )
  );
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

// ─── PROJECT TAGS (STACK) ────────────────────────────────────────────────────

export async function createProjectTag(name: string) {
  const db = createAdminClient();
  const { error } = await db.from("project_tags").insert({ name } as never);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

export async function updateProjectTag(id: string, name: string) {
  const db = createAdminClient();
  const { error } = await db.from("project_tags").update({ name } as never).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

export async function deleteProjectTag(id: string) {
  const db = createAdminClient();
  const { error } = await db.from("project_tags").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

export async function reorderProjectTags(orderedIds: string[]) {
  const db = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.from("project_tags").update({ display_order: index } as never).eq("id", id)
    )
  );
  revalidatePath("/admin/projects");
  revalidatePath("/[profile]", "layout");
}

export async function seedProjectDefaults() {
  const db = createAdminClient();

  const defaultCategories = [
    "Full Stack", "Python", "React", "Vanilla JS",
    "Vue.js", "Laravel", "Chrome Extension", "VS Code Extension",
  ];
  const defaultTags = [
    "React", "Node.js", "Python", "TypeScript", "JavaScript", "FastAPI",
    "MySQL", "Express", "Vue.js", "Chrome Extension", "VS Code API", "PWA",
    "LangChain", "RAG", "OpenCV", "CSS3", "HTML5", "Vite", "Supabase",
    "Multi-AI", "ChromaDB", "Groq", "Flask", "Laravel", "PHP", "Canvas",
    "Machine Learning", "Extension", "Razorpay", "Multi-LLM", "Prisma",
    "GenAI", "Gemini", "MongoDB", "PDF.js", "API",
  ];

  const catRows = defaultCategories.map((name, i) => ({ name, display_order: i, visible: true }));
  const tagRows = defaultTags.map((name, i) => ({ name, display_order: i, visible: true }));

  const { error: catErr } = await db
    .from("project_categories")
    .upsert(catRows as never, { onConflict: "name" });
  if (catErr) throw new Error(catErr.message);

  const { error: tagErr } = await db
    .from("project_tags")
    .upsert(tagRows as never, { onConflict: "name" });
  if (tagErr) throw new Error(tagErr.message);

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
  if ("icon_url" in data) {
    const { data: old } = (await db.from("skills").select("icon_url").eq("id", id).single()) as unknown as { data: { icon_url: string | null } | null };
    if (old?.icon_url !== data.icon_url) {
      await deleteStorageFiles([old?.icon_url]);
    }
  }
  const { error } = await db.from("skills").update(data as never).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/[profile]", "layout");
}

export async function deleteSkill(id: string) {
  const db = createAdminClient();
  const { data: record } = (await db.from("skills").select("icon_url").eq("id", id).single()) as unknown as { data: { icon_url: string | null } | null };
  const { error } = await db.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await deleteStorageFiles([record?.icon_url]);
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

export async function reorderSkillsGrouped(
  categoryOrder: string[],
  skillsPerCategory: Record<string, string[]>
) {
  const db = createAdminClient();
  const updates: Array<{ id: string; display_order: number }> = [];
  categoryOrder.forEach((cat, catIdx) => {
    const ids = skillsPerCategory[cat] ?? [];
    ids.forEach((id, skillIdx) => {
      updates.push({ id, display_order: catIdx * 1000 + skillIdx });
    });
  });
  await Promise.all(
    updates.map(({ id, display_order }) =>
      db.from("skills").update({ display_order } as never).eq("id", id)
    )
  );
  revalidatePath("/admin/skills");
  revalidatePath("/[profile]", "layout");
}

export async function renameCategory(oldName: string, newName: string) {
  const db = createAdminClient();
  const { error } = await db
    .from("skills")
    .update({ category: newName } as never)
    .eq("category", oldName);
  if (error) throw new Error(error.message);
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
  if ("logo_url" in data) {
    const { data: old } = (await db.from("certifications").select("logo_url").eq("id", id).single()) as unknown as { data: { logo_url: string | null } | null };
    if (old?.logo_url !== data.logo_url) {
      await deleteStorageFiles([old?.logo_url]);
    }
  }
  const { error } = await db.from("certifications").update(data as never).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certifications");
  revalidatePath("/[profile]", "layout");
}

export async function deleteCertification(id: string) {
  const db = createAdminClient();
  const { data: record } = (await db.from("certifications").select("logo_url").eq("id", id).single()) as unknown as { data: { logo_url: string | null } | null };
  const { error } = await db.from("certifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await deleteStorageFiles([record?.logo_url]);
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
  card_color?: string | null;
};

export async function reorderExperience(orderedIds: string[]) {
  const db = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.from("experience").update({ display_order: index } as never).eq("id", id)
    )
  );
  revalidatePath("/admin/experience");
  revalidatePath("/[profile]", "layout");
}

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
