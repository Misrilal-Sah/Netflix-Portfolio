"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, GitBranch, Info, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project, ProjectButtonConfig } from "@/lib/types/database";
import type { ProfileType } from "@/lib/constants";

interface ProjectCardProps {
  project: Project;
  profile: ProfileType;
  onDetails: () => void;
}

const DEFAULT_BUTTON_CONFIG: ProjectButtonConfig = {
  demo_text: "View Live",
  demo_color: "#E50914",
  details_text: "Details",
  details_color: "#333333",
  github_text: "GitHub",
  github_color: "#333333",
};

function getButtonConfig(
  project: Project,
  profile: ProfileType
): ProjectButtonConfig {
  const perProfile = project.button_config?.[profile];
  return { ...DEFAULT_BUTTON_CONFIG, ...perProfile };
}

export function ProjectCard({ project, profile, onDetails }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const config = getButtonConfig(project, profile);

  function handleMouseEnter() {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setIsHovered(true), 150);
  }

  function handleMouseLeave() {
    clearTimeout(hoverTimeout.current);
    setIsHovered(false);
  }

  return (
    <motion.div
      className="relative bg-surface rounded-lg overflow-hidden flex flex-col cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        boxShadow: isHovered
          ? "0 16px 48px rgba(229, 9, 20, 0.3), 0 6px 24px rgba(0,0,0,0.6)"
          : "0 2px 8px rgba(0,0,0,0.3)",
        transform: isHovered ? "translateY(-10px) scale(1.06)" : "translateY(0) scale(1)",
        transition: "box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Image area with hover overlay */}
      <div className="relative aspect-video overflow-hidden">
        {project.screenshot_url ? (
          <Image
            src={project.screenshot_url}
            alt={`${project.title} screenshot`}
            fill
            className={cn(
              "object-cover transition-all duration-700 ease-out",
              isHovered && "scale-110 brightness-75"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className={cn(
            "w-full h-full bg-surface-hover flex items-center justify-center transition-all duration-500",
            isHovered && "bg-[#111]"
          )}>
            <span className="text-text-muted font-bold text-lg text-center px-4">
              {project.title}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {project.featured && (
          <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-sm z-20 uppercase tracking-wider">
            Featured
          </span>
        )}

        {/* Hover overlay with 3 buttons */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center"
              style={{
                background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2.5"
              >
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-white text-xs font-bold transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
                    style={{ backgroundColor: config.demo_color }}
                  >
                    <ExternalLink size={13} />
                    {config.demo_text}
                  </a>
                )}
                {!project.demo_url && project.download_url && (
                  <a
                    href={project.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-white text-xs font-bold transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
                    style={{ backgroundColor: config.demo_color }}
                  >
                    <Download size={13} />
                    Download
                  </a>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDetails();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-white text-xs font-bold transition-all duration-200 hover:scale-110 active:scale-95 border border-white/40 shadow-lg backdrop-blur-sm bg-white/10 hover:bg-white/20"
                >
                  <Info size={13} />
                  {config.details_text}
                </button>
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-white text-xs font-bold transition-all duration-200 hover:scale-110 active:scale-95 border border-white/40 shadow-lg backdrop-blur-sm bg-white/10 hover:bg-white/20"
                  >
                    <GitBranch size={13} />
                    {config.github_text}
                  </a>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h3 className="text-white font-bold text-base leading-tight mb-2 line-clamp-1">
          {project.title}
        </h3>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-accent/90 text-white text-[11px] font-semibold rounded"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="px-2 py-0.5 bg-surface-hover text-text-muted text-[11px] font-semibold rounded">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-text-muted text-[13px] leading-relaxed line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Footer: date + category */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-accent text-xs font-medium">
            {project.date_label ?? new Date(project.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
          <span className="text-text-muted text-xs">
            {project.sub_category ?? project.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
