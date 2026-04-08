"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, GitBranch } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/utils";
import type { Project, ProjectButtonConfig } from "@/lib/types/database";
import type { ProfileType } from "@/lib/constants";

interface ProjectDetailModalProps {
  project: Project | null;
  profile: ProfileType;
  onClose: () => void;
}

function isBadgeImage(src?: string | Blob) {
  if (typeof src !== "string") return false;
  return /(?:^|\/\/)(?:img\.shields\.io|skillicons\.dev)\//i.test(src);
}

const DEFAULT_BUTTON_CONFIG: ProjectButtonConfig = {
  demo_text: "View Live",
  demo_color: "#E50914",
  details_text: "Details",
  details_color: "#333333",
  github_text: "View Code",
  github_color: "#333333",
};

export function ProjectDetailModal({
  project,
  profile,
  onClose,
}: ProjectDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const config: ProjectButtonConfig = {
    ...DEFAULT_BUTTON_CONFIG,
    ...(project?.button_config?.[profile] ?? {}),
  };

  useEffect(() => {
    if (project) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [project]);

  useEffect(() => {
    if (project) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [project]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    },
    [onClose]
  );

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center overflow-y-auto py-8"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-overlay backdrop-blur-[4px]"
            onClick={onClose}
            aria-hidden
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[min(900px,92vw)] bg-surface rounded-lg overflow-hidden shadow-[var(--shadow-modal)]"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute top-4 right-4 z-[var(--z-modal-close)] w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-white" />
            </button>

            {/* Hero image */}
            {project.screenshot_url && (
              <div className="relative h-[250px] sm:h-[300px] overflow-hidden">
                <Image
                  src={project.screenshot_url}
                  alt={`${project.title} preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 900px"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />

                {/* Action buttons overlaid on hero */}
                <div className="absolute bottom-6 left-6 flex gap-3 z-10">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded text-white text-sm font-bold transition-all duration-200 hover:brightness-110 hover:scale-105"
                      style={{ backgroundColor: config.demo_color }}
                    >
                      <ExternalLink size={16} />
                      {config.demo_text}
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded text-white text-sm font-bold bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-200 hover:bg-white/30 hover:scale-105"
                    >
                      <GitBranch size={16} />
                      {config.github_text}
                    </a>
                  )}
                </div>
              </div>
            )}

            {!project.screenshot_url && (
              <div className="p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-white">{project.title}</h2>
              </div>
            )}

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Title + meta (when hero image exists) */}
              {project.screenshot_url && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    {project.category && <span>{project.category}</span>}
                    {project.sub_category && (
                      <>
                        <span className="text-border">•</span>
                        <span>{project.sub_category}</span>
                      </>
                    )}
                    {project.date_label && (
                      <>
                        <span className="text-border">•</span>
                        <span className="text-accent">{project.date_label}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-accent/90 text-white text-xs font-semibold rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-text-muted text-sm leading-relaxed">
                {project.description}
              </p>

              {/* README content as markdown */}
              {project.readme_content && (
                <div className="border-t border-border pt-5">
                  <h3 className="text-white font-bold text-lg mb-4">
                    README
                  </h3>
                  <div
                    className={cn(
                      "prose prose-invert prose-sm max-w-none",
                      "prose-headings:text-white prose-headings:font-bold",
                      "prose-p:text-text-muted prose-p:leading-relaxed",
                      "prose-a:text-accent prose-a:no-underline hover:prose-a:underline",
                      "prose-code:bg-surface-hover prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs",
                      "prose-pre:bg-[#0d0d0d] prose-pre:border prose-pre:border-border prose-pre:rounded-md",
                      "prose-img:rounded-md prose-img:border prose-img:border-border",
                      "prose-strong:text-white",
                      "prose-li:text-text-muted",
                      "prose-th:text-white prose-td:text-text-muted"
                    )}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        // Make tables horizontally scrollable
                        table: ({ node: _node, ...props }) => (
                          <div className="overflow-x-auto">
                            <table {...props} />
                          </div>
                        ),
                        // Open all links in new tab
                        a: ({ node: _node, ...props }) => (
                          <a target="_blank" rel="noopener noreferrer" {...props} />
                        ),
                        // Render images with max-width
                        img: ({ node: _node, ...props }) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            {...props}
                            alt={props.alt ?? ""}
                            style={
                              isBadgeImage(props.src)
                                ? {
                                    maxWidth: "100%",
                                    height: "auto",
                                    display: "inline-block",
                                    verticalAlign: "middle",
                                    margin: "0 0.45rem 0.45rem 0",
                                    borderRadius: "4px",
                                  }
                                : {
                                    maxWidth: "100%",
                                    height: "auto",
                                    display: "block",
                                    margin: "0.75rem auto",
                                    borderRadius: "6px",
                                  }
                            }
                          />
                        ),
                      }}
                    >
                      {project.readme_content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* If no readme, show a note */}
              {!project.readme_content && (
                <div className="border-t border-border pt-5">
                  <p className="text-text-dim text-sm italic">
                    Full README coming soon. Check out the{" "}
                    {project.github_url ? (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        GitHub repository
                      </a>
                    ) : (
                      "source code"
                    )}{" "}
                    for more details.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
