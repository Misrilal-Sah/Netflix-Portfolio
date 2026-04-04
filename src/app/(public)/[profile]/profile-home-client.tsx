"use client";

import { useState } from "react";
import type { ProfileType } from "@/lib/constants";
import type { Project, Skill } from "@/lib/types/database";
import { HeroBillboard } from "@/components/netflix/hero-billboard";
import { ContinueWatching } from "@/components/netflix/continue-watching";
import { ContentRow } from "@/components/netflix/content-row";
import { HoverCard } from "@/components/netflix/hover-card";
import { ContentModal } from "@/components/netflix/content-modal";

interface ProfileHomeClientProps {
  profile: ProfileType;
  profileName: string;
  featuredProjects: Project[];
  allProjects: Project[];
  skills: Skill[];
}

export function ProfileHomeClient({
  profileName,
  featuredProjects,
  allProjects,
  skills,
}: ProfileHomeClientProps) {
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const heroProject = featuredProjects[0];

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Billboard */}
      <HeroBillboard
        title={heroProject?.title ?? "Welcome to Misril.dev"}
        description={
          heroProject?.description ?? "Explore projects, skills, and more."
        }
        imageUrl={heroProject?.screenshot_url ?? undefined}
        onPlay={() => {}}
        onMoreInfo={
          heroProject ? () => setModalProject(heroProject) : undefined
        }
      />

      {/* Continue Watching */}
      <ContinueWatching
        profileName={profileName}
        items={allProjects.slice(0, 6)}
      />

      {/* Top Picks */}
      <ContentRow title={`Top Picks for ${profileName}`}>
        {featuredProjects.map((project, i) => (
          <div
            key={project.id}
            className="relative flex-shrink-0 w-[calc((100%-40px)/6)] min-w-[200px]"
          >
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
              />
            </HoverCard>
            {/* Rank number overlay */}
            <span className="absolute bottom-0 left-1 text-[96px] font-bold leading-none text-white/15 pointer-events-none select-none">
              {i + 1}
            </span>
          </div>
        ))}
      </ContentRow>

      {/* All Projects */}
      <ContentRow title="Projects">
        {allProjects.map((project) => (
          <div
            key={project.id}
            className="flex-shrink-0 w-[calc((100%-40px)/6)] min-w-[200px]"
          >
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
              />
            </HoverCard>
          </div>
        ))}
      </ContentRow>

      {/* Skills & Technologies */}
      <ContentRow title="Skills & Technologies">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex-shrink-0 w-[calc((100%-40px)/6)] min-w-[150px]"
          >
            <div className="aspect-[2/3] bg-surface rounded-md flex flex-col items-center justify-center p-md">
              <span className="text-[length:var(--font-size-heading)] font-bold text-text text-center">
                {skill.name}
              </span>
              <span className="mt-xs text-[length:var(--font-size-body)] text-text-muted">
                {skill.category}
              </span>
            </div>
          </div>
        ))}
      </ContentRow>

      {/* Content Modal */}
      <ContentModal
        isOpen={!!modalProject}
        onClose={() => setModalProject(null)}
        title={modalProject?.title ?? ""}
        heroImage={modalProject?.screenshot_url ?? undefined}
      >
        {modalProject && (
          <div className="space-y-md">
            <p className="text-[length:var(--font-size-body)] text-text">
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
            {modalProject.github_url && (
              <a
                href={modalProject.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-md text-[length:var(--font-size-body)] text-accent hover:text-accent-hover transition-colors"
              >
                View on GitHub →
              </a>
            )}
          </div>
        )}
      </ContentModal>
    </div>
  );
}
