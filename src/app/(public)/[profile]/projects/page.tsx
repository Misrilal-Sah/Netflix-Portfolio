import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { getProjects } from "@/lib/data";
import { redirect } from "next/navigation";
import { ProjectsClient } from "./projects-client";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;

  if (!(PROFILE_TYPES as readonly string[]).includes(profile)) {
    redirect("/");
  }

  const projects = await getProjects();
  const categories = [
    ...new Set(projects.map((p) => p.category).filter(Boolean) as string[]),
  ].sort();

  return (
    <ProjectsClient
      profile={profile as ProfileType}
      projects={projects}
      categories={categories}
    />
  );
}
