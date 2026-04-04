"use client";

import { cn } from "@/lib/utils";

interface HeroBillboardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export function HeroBillboard({
  title,
  description,
  imageUrl,
  onPlay,
  onMoreInfo,
}: HeroBillboardProps) {
  return (
    <section
      className={cn(
        "relative w-full h-[50vh] lg:h-[70vh]",
        "bg-cover bg-center"
      )}
      style={{
        backgroundImage: imageUrl
          ? `url(${imageUrl})`
          : "linear-gradient(135deg, #141414 0%, #1a0a0a 50%, #141414 100%)",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-[15%] left-[4vw] z-10 max-w-[50%]">
        <h1 className="text-[32px] lg:text-[length:var(--font-size-display)] font-bold text-text leading-tight">
          {title}
        </h1>
        <p className="mt-md text-[length:var(--font-size-body)] text-text max-w-[80%] lg:max-w-[40vw] line-clamp-2">
          {description}
        </p>

        {/* CTA buttons */}
        <div className="flex gap-sm mt-lg">
          {onPlay && (
            <button
              onClick={onPlay}
              className="flex items-center gap-xs h-10 px-lg rounded-md bg-white text-black font-bold text-[length:var(--font-size-body)] hover:bg-white/75 transition-colors"
            >
              ▶ Play
            </button>
          )}
          {onMoreInfo && (
            <button
              onClick={onMoreInfo}
              className="flex items-center gap-xs h-10 px-lg rounded-md bg-[rgba(109,109,110,0.7)] text-white font-bold text-[length:var(--font-size-body)] hover:bg-[rgba(109,109,110,0.4)] transition-colors"
            >
              ⓘ More Info
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
