"use client";

import { useState } from "react";
import type { ProfileType } from "@/lib/constants";
import type { Project } from "@/lib/types/database";
import { HoverCard } from "@/components/netflix/hover-card";
import { ContentModal } from "@/components/netflix/content-modal";
import { ExternalLink, Code } from "lucide-react";
import { cn } from "@/lib/utils";

const PROFILE_COPY: Record<
  ProfileType,
  { title: string; subtitle: string; allLabel: string }
> = {
  recruiter: {
    title: "Shipped Work",
    subtitle:
      "Production applications delivered across frontend, backend, and AI.",
    allLabel: "All Projects",
  },
  developer: {
    title: "GitHub Timeline",
    subtitle: "Repositories, architectures, and build decisions.",
    allLabel: "All Repos",
  },
  stalker: {
    title: "The Build Log",
    subtitle: "Everything I've made — warts and all.",
    allLabel: "All Builds",
  },
  adventurer: {
    title: "Completed Quests",
    subtitle: "Every project: an adventure with a final boss.",
    allLabel: "All Quests",
  },
};

interface ProjectsClientProps {
  profile: ProfileType;
  projects: Project[];
  categories: string[];
}

export function ProjectsClient({
  profile,
  projects,
  categories,
}: ProjectsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const copy = PROFILE_COPY[profile];

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-bg pb-3xl">
      {/* Page Header */}
      <div className="pt-12 lg:pt-[68px]">
        <div className="px-[4vw] py-2xl">
          <h1 className="text-[length:var(--font-size-display)] font-bold text-text">
            {copy.title}
          </h1>
          <p className="mt-sm text-[length:var(--font-size-heading)] text-text-muted max-w-2xl">
            {copy.subtitle}
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-[4vw] pb-xl flex flex-wrap gap-sm">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-md py-xs rounded-sm text-[length:var(--font-size-body)] font-bold transition-colors border",
              activeCategory === cat
                ? "bg-text text-bg border-text"
                : "bg-transparent text-text-muted border-border hover:border-text hover:text-text"
            )}
          >
            {cat === "All" ? copy.allLabel : cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="px-[4vw] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-sm">
        {filtered.map((project) => (
          <div key={project.id} className="relative group">
            <HoverCard
              title={project.title}
              metadata={project.category ?? ""}
              onMoreInfo={() => setModalProject(project)}
            >
              <div
                className="aspect-video bg-surface rounded-md bg-cover bg-center"
                style={
                  project.screenshot_url
                    ? { backgroundImage: `url(${project.screenshot_url})` }
                    : undefined
                }
              >
                {!project.screenshot_url && (
                  <div className="w-full h-full flex items-center justify-center p-md">
                    <span className="text-[length:var(--font-size-body)] font-bold text-text-muted text-center line-clamp-3">
                      {project.title}
                    </span>
                  </div>
                )}
              </div>
            </HoverCard>
            {project.featured && (
              <span className="absolute top-xs left-xs bg-accent text-text text-[10px] font-bold px-xs py-[2px] rounded-sm pointer-events-none">
                FEATURED
              </span>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-[4vw] py-3xl text-center">
          <p className="text-[length:var(--font-size-heading)] text-text-muted">
            No projects in this category yet.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <ContentModal
        isOpen={!!modalProject}
        onClose={() => setModalProject(null)}
        title={modalProject?.title ?? ""}
        heroImage={modalProject?.screenshot_url ?? undefined}
      >
        {modalProject && (
          <div className="space-y-md">
            {modalProject.category && (
              <span className="inline-block text-[length:var(--font-size-body)] text-text-muted uppercase tracking-widest">
                {modalProject.category}
              </span>
            )}
            <p className="text-[length:var(--font-size-body)] text-text leading-relaxed">
              {modalProject.description}
            </p>
            {modalProject.tags.length > 0 && (
              <div className="flex flex-wrap gap-xs">
                {modalProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-sm py-xs rounded-sm bg-surface-hover text-[length:var(--font-size-body)] text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-md pt-sm">
              {modalProject.github_url && (
                <a
                  href={modalProject.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-xs text-[length:var(--font-size-body)] text-text hover:text-accent transition-colors"
                >
                  <Code size={16} />
                  GitHub
                </a>
              )}
              {modalProject.demo_url && (
                <a
                  href={modalProject.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-xs text-[length:var(--font-size-body)] text-text hover:text-accent transition-colors"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        )}
      </ContentModal>
    </div>
  );
}
