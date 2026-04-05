"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProfileType } from "@/lib/constants";
import type { Project, HomepageCard, HomepageProjectPick } from "@/lib/types/database";
import type { HomepageHero } from "@/lib/data/contact-info";
import { HeroBillboard } from "@/components/netflix/hero-billboard";
import { ContinueWatching } from "@/components/netflix/continue-watching";
import { ContentRow } from "@/components/netflix/content-row";
import { HoverCard } from "@/components/netflix/hover-card";
import { ContentModal } from "@/components/netflix/content-modal";

interface ProfileHomeClientProps {
  profile: ProfileType;
  profileName: string;
  hero: HomepageHero;
  continueWatchingCards: HomepageCard[];
  topPicksCards: HomepageCard[];
  projectPicks: (HomepageProjectPick & { project: Project })[];
}

export function ProfileHomeClient({
  profile,
  profileName,
  hero,
  continueWatchingCards,
  topPicksCards,
  projectPicks,
}: ProfileHomeClientProps) {
  const [modalProject, setModalProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Billboard — personal intro */}
      <HeroBillboard
        title={hero.title}
        description={hero.description}
        imageUrl={hero.image_url}
        resumeUrl={hero.resume_url}
        linkedinUrl={hero.linkedin_url}
      />

      {/* Continue Watching — CMS managed */}
      <ContinueWatching items={continueWatchingCards} />

      {/* Top Picks for You — CMS managed */}
      {topPicksCards.length > 0 && (
        <ContentRow title="Top Picks for You">
          {topPicksCards.map((card) => (
            <div
              key={card.id}
              className="relative flex-shrink-0 w-[calc((100%-24px)/4)] min-w-[220px]"
            >
              <HoverCard
                title={card.title}
                metadata={card.subtitle ?? ""}
                href={card.link_url || undefined}
              >
                <div className="aspect-video bg-surface rounded-md overflow-hidden relative">
                  {card.image_url ? (
                    <Image
                      src={card.image_url}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface" />
                  )}
                </div>
              </HoverCard>
            </div>
          ))}
        </ContentRow>
      )}

      {/* Projects — selected picks */}
      {projectPicks.length > 0 && (
        <ContentRow title="Projects">
          {projectPicks.map(({ id, project }) => (
            <div
              key={id}
              className="flex-shrink-0 w-[calc((100%-24px)/4)] min-w-[220px]"
            >
              <HoverCard
                title={project.title}
                metadata={project.category ?? ""}
                onMoreInfo={() => setModalProject(project)}
              >
                <div className="aspect-video bg-surface rounded-md overflow-hidden relative">
                  {project.screenshot_url ? (
                    <Image
                      src={project.screenshot_url}
                      alt={`${project.title} screenshot`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface" />
                  )}
                </div>
              </HoverCard>
            </div>
          ))}
        </ContentRow>
      )}

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
