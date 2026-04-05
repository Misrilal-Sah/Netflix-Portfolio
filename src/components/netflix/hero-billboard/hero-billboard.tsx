"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

interface HeroBillboardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onPlay?: () => void;
  onMoreInfo?: () => void;
  resumeUrl?: string;
  linkedinUrl?: string;
}

export function HeroBillboard({
  title,
  description,
  imageUrl,
  onPlay,
  onMoreInfo,
  resumeUrl,
  linkedinUrl,
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
        <h1 className="text-[20px] sm:text-[24px] lg:text-[30px] xl:text-[36px] font-black text-text leading-tight drop-shadow-lg">
          {title}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-text/90 max-w-[90%] sm:max-w-[70%] lg:max-w-[40vw] line-clamp-3 drop-shadow">
          {description}
        </p>

        {/* CTA buttons */}
        <div className="flex gap-3 mt-5">
          {resumeUrl && (
            <a
              href={resumeUrl}
              download
              aria-label="Download Resume"
              className="flex items-center gap-2 h-10 sm:h-12 px-5 sm:px-8 rounded-md bg-white text-black font-bold text-sm sm:text-base hover:bg-white/90 transition-colors shadow-lg"
            >
              <span className="text-lg leading-none">&#9654;</span> Resume
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="flex items-center gap-2 h-10 sm:h-12 px-5 sm:px-8 rounded-md bg-[#0A66C2]/80 backdrop-blur-sm text-white font-bold text-sm sm:text-base hover:bg-[#0A66C2] transition-colors border border-[#0A66C2]"
            >
              <LinkedInIcon size={18} /> Linkedin
            </a>
          )}
          {onPlay && !resumeUrl && (
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
