import { createAdminClient } from "@/lib/supabase/admin";
import { ProjectsClient } from "./projects-client";
import type { ProjectCategory, ProjectTag } from "@/lib/types/database";

async function getProjects() {
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<ProjectCategory[]> {
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("project_categories")
      .select("*")
      .order("display_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

async function getTags(): Promise<ProjectTag[]> {
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("project_tags")
      .select("*")
      .order("display_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminProjectsPage() {
  const [projects, categories, tags] = await Promise.all([
    getProjects(),
    getCategories(),
    getTags(),
  ]);
  return (
    <ProjectsClient
      initialProjects={projects}
      initialCategories={categories}
      initialTags={tags}
    />
  );
}
