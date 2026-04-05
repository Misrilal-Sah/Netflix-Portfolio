"use client";

import Image from "next/image";
import { ContentRow } from "@/components/netflix/content-row";
import { HoverCard } from "@/components/netflix/hover-card";
import type { HomepageCard } from "@/lib/types/database";

interface ContinueWatchingProps {
  items: HomepageCard[];
}

export function ContinueWatching({ items }: ContinueWatchingProps) {
  if (items.length === 0) return null;

  return (
    <div className="py-sm">
      <ContentRow title="Continue Watching">
        {items.map((card) => (
          <div
            key={card.id}
            className="flex-shrink-0 w-[calc((100%-16px)/3)] min-w-[250px]"
          >
            <HoverCard
              title={card.title}
              metadata={card.subtitle ?? ""}
              href={card.link_url || undefined}
            >
              <div className="relative aspect-video bg-surface rounded-md overflow-hidden">
                {card.image_url ? (
                  <Image
                    src={card.image_url}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 90vw, 33vw"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-surface" />
                )}
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-border z-10">
                  <div
                    className="h-full bg-accent rounded-sm"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>
            </HoverCard>
          </div>
        ))}
      </ContentRow>
    </div>
  );
}
