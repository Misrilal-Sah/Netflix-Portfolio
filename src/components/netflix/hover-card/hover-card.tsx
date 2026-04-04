"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHoverIntent } from "@/hooks/use-hover-intent";

interface HoverCardProps {
  children: ReactNode;
  title: string;
  metadata?: string;
  onMoreInfo?: () => void;
  className?: string;
}

export function HoverCard({
  children,
  title,
  metadata,
  onMoreInfo,
  className,
}: HoverCardProps) {
  const { isHovered, onMouseEnter, onMouseLeave } = useHoverIntent(300);

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.4 : 1,
          zIndex: isHovered ? 50 : "auto",
        }}
        transition={{
          scale: { duration: isHovered ? 0.3 : 0.2, ease: [0.16, 1, 0.3, 1] },
        }}
        style={{
          transformOrigin: "center center",
          boxShadow: isHovered
            ? "0 8px 32px rgba(0,0,0,0.6)"
            : "0 2px 8px rgba(0,0,0,0.4)",
        }}
        className="rounded-md overflow-hidden"
      >
        {/* Card image/content */}
        {children}

        {/* Info overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-surface p-sm"
            >
              <p className="text-[length:var(--font-size-body)] font-bold text-text truncate">
                {title}
              </p>
              {metadata && (
                <p className="text-[length:var(--font-size-body)] text-text-muted mt-xs truncate">
                  {metadata}
                </p>
              )}
              {onMoreInfo && (
                <button
                  onClick={onMoreInfo}
                  className="mt-sm text-[length:var(--font-size-body)] text-text-muted hover:text-text transition-colors"
                >
                  ⓘ More Info
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
