import type { Metadata } from "next";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { getProjects, getProjectsPageCopy, getProjectCategories, getProjectTags } from "@/lib/data";
import { redirect } from "next/navigation";
import { ProjectsClient } from "./projects-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://misril.dev";

export function generateMetadata(): Metadata {
  return {
    title: "Projects — Misril.dev",
    description:
      "26+ production projects across React, Next.js, Node.js, Python, Vue.js, and AI. Browse the full build log.",
    alternates: {
      canonical: `${SITE_URL}/recruiter/projects`,
    },
    openGraph: {
      title: "Projects — Misril.dev",
      description:
        "26+ production projects across React, Next.js, Node.js, Python, Vue.js, and AI.",
      url: `${SITE_URL}/recruiter/projects`,
      images: [{ url: `${SITE_URL}/images/Misril.jpeg`, alt: "Misrilal Sah" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Projects — Misril.dev",
      description: "26+ production projects across React, Next.js, Node.js, Python, Vue.js, and AI.",
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;

  if (!(PROFILE_TYPES as readonly string[]).includes(profile)) {
    redirect("/");
  }

  const [projects, pageCopy, dbCategories, dbTags] = await Promise.all([
    getProjects(),
    getProjectsPageCopy(),
    getProjectCategories(),
    getProjectTags(),
  ]);

  // Use DB categories if available, else derive from projects
  const categories = dbCategories.length > 0
    ? dbCategories.map((c) => c.name)
    : [...new Set(projects.map((p) => p.category).filter(Boolean) as string[])].sort();

  // Use DB tags if available, else derive from projects
  const tagNames = dbTags.length > 0
    ? dbTags.map((t) => t.name)
    : [...new Set(projects.flatMap((p) => p.tags))].sort();

  return (
    <ProjectsClient
      profile={profile as ProfileType}
      projects={projects}
      categories={categories}
      tags={tagNames}
      copy={pageCopy[profile as ProfileType]}
    />
  );
}
