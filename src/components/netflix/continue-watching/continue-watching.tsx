"use client";

import { ContentRow } from "@/components/netflix/content-row";
import { HoverCard } from "@/components/netflix/hover-card";
import type { Project } from "@/lib/types/database";

interface ContinueWatchingProps {
  profileName: string;
  items: Project[];
}

const mockProgress = [25, 50, 75, 30, 60, 45];

export function ContinueWatching({ profileName, items }: ContinueWatchingProps) {
  return (
    <ContentRow title={`Continue Watching for ${profileName}`}>
      {items.map((project, i) => (
        <div
          key={project.id}
          className="flex-shrink-0 w-[calc((100%-40px)/6)] min-w-[200px]"
        >
          <HoverCard title={project.title} metadata={project.category ?? ""}>
            <div className="relative">
              <div
                className="aspect-video bg-surface rounded-md bg-cover bg-center"
                style={
                  project.screenshot_url
                    ? { backgroundImage: `url(${project.screenshot_url})` }
                    : undefined
                }
              />
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-border rounded-b-md overflow-hidden">
                <div
                  className="h-full bg-accent rounded-sm"
                  style={{
                    width: `${mockProgress[i % mockProgress.length]}%`,
                  }}
                />
              </div>
            </div>
          </HoverCard>
        </div>
      ))}
    </ContentRow>
  );
}
