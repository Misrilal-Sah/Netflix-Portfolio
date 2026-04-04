"use client";

import Image from "next/image";
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
  const isGif = imageUrl?.toLowerCase().endsWith(".gif");

  return (
    <section
      className={cn(
        "relative w-full h-[56vw] min-h-[320px] max-h-[80vh]",
        !imageUrl && "bg-cover bg-center"
      )}
      aria-label={title}
      style={
        !imageUrl
          ? {
              backgroundImage:
                "linear-gradient(135deg, #141414 0%, #1a0a0a 50%, #141414 100%)",
            }
          : undefined
      }
    >
      {/* GIF — plain img to preserve animation */}
      {imageUrl && isGif && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* Static image via next/image */}
      {imageUrl && !isGif && (
        <Image
          src={imageUrl}
          alt={`${title} hero image`}
          fill
          className="object-cover"
          sizes="100vw"
          priority={true}
        />
      )}
      {/* Bottom-to-top dark gradient — Netflix style */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
      {/* Left-to-right dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-[12%] left-[4vw] z-10 max-w-[55%]">
        <h1 className="text-[28px] sm:text-[36px] lg:text-[48px] xl:text-[56px] font-black text-text leading-tight drop-shadow-lg">
          {title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-text/90 max-w-[90%] sm:max-w-[70%] lg:max-w-[40vw] line-clamp-3 drop-shadow">
          {description}
        </p>

        {/* CTA buttons */}
        <div className="flex gap-3 mt-5">
          {onPlay && (
            <button
              onClick={onPlay}
              aria-label={`Play ${title}`}
              className="flex items-center gap-2 h-10 sm:h-12 px-5 sm:px-8 rounded-md bg-white text-black font-bold text-sm sm:text-base hover:bg-white/80 transition-colors shadow-lg"
            >
              <span className="text-lg">&#9654;</span> Play
            </button>
          )}
          {onMoreInfo && (
            <button
              onClick={onMoreInfo}
              aria-label={`More info about ${title}`}
              className="flex items-center gap-2 h-10 sm:h-12 px-5 sm:px-8 rounded-md bg-white/20 backdrop-blur-sm text-white font-bold text-sm sm:text-base hover:bg-white/30 transition-colors border border-white/30"
            >
              <span className="text-base">&#9432;</span> More Info
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
