import { createAdminClient } from "@/lib/supabase/admin";
import { ProjectsClient } from "./projects-client";

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

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return <ProjectsClient initialProjects={projects} />;
}
