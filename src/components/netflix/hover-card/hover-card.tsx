"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHoverIntent } from "@/hooks/use-hover-intent";

interface HoverCardProps {
  children: ReactNode;
  title: string;
  metadata?: string;
  onMoreInfo?: () => void;
  className?: string;
  /** Optional link URL — makes entire card clickable */
  href?: string;
}

export function HoverCard({
  children,
  title,
  metadata,
  onMoreInfo,
  className,
  href,
}: HoverCardProps) {
  const { isHovered, onMouseEnter, onMouseLeave } = useHoverIntent(200);

  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? { href, onClick: undefined }
    : {
        onClick: onMoreInfo,
        onKeyDown: (e: React.KeyboardEvent) => {
          if ((e.key === "Enter" || e.key === " ") && onMoreInfo) {
            e.preventDefault();
            onMoreInfo();
          }
        },
        tabIndex: onMoreInfo ? 0 : undefined,
        role: onMoreInfo ? "button" as const : undefined,
        "aria-label": onMoreInfo ? `${title} — press Enter for more info` : undefined,
      };

  return (
    <Wrapper
      {...(wrapperProps as Record<string, unknown>)}
      className={cn("relative block group", className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.04 : 1,
        }}
        transition={{
          scale: { duration: isHovered ? 0.25 : 0.2, ease: [0.16, 1, 0.3, 1] },
        }}
        style={{
          transformOrigin: "center center",
          boxShadow: isHovered
            ? "0 0 0 2px #E50914, 0 4px 20px rgba(229, 9, 20, 0.3)"
            : "0 2px 8px rgba(0,0,0,0.4)",
        }}
        className="rounded-md overflow-hidden relative"
      >
        {/* Card image/content */}
        {children}

        {/* Text overlay on image */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pb-3 pt-8">
          <p className="text-sm font-bold text-white truncate drop-shadow-md">
            {title}
          </p>
          {metadata && (
            <p className="text-xs text-white/70 mt-0.5 truncate drop-shadow-md">
              {metadata}
            </p>
          )}
        </div>
      </motion.div>
    </Wrapper>
  );
}

