"use client";

import { useState, useMemo } from "react";
import type { ProfileType } from "@/lib/constants";
import type { Project } from "@/lib/types/database";
import { ProjectCard } from "@/components/netflix/project-card";
import { ProjectDetailModal } from "@/components/netflix/project-detail-modal";
import { cn } from "@/lib/utils";
import type { ProjectsPageCopy } from "@/lib/data/page-copy";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProjectsClientProps {
  profile: ProfileType;
  projects: Project[];
  categories: string[];
  tags: string[];
  copy: ProjectsPageCopy;
}

export function ProjectsClient({
  profile,
  projects,
  categories,
  tags,
  copy,
}: ProjectsClientProps) {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set()
  );
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [showCategories, setShowCategories] = useState(true);
  const [showStack, setShowStack] = useState(false);

  // Filter projects by selected categories AND tags (intersection)
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const categoryMatch =
        activeCategories.size === 0 ||
        (p.category && activeCategories.has(p.category));
      const tagMatch =
        activeTags.size === 0 ||
        p.tags.some((t) => activeTags.has(t));
      return categoryMatch && tagMatch;
    });
  }, [projects, activeCategories, activeTags]);

  function toggleCategory(cat: string) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function clearAllFilters() {
    setActiveCategories(new Set());
    setActiveTags(new Set());
  }

  const hasFilters = activeCategories.size > 0 || activeTags.size > 0;

  return (
    <div className="min-h-screen bg-bg pb-2xl">
      {/* Page Header */}
      <div className="pt-12 lg:pt-[68px]">
        <div className="px-[4vw] py-lg">
          <h1 className="text-[length:var(--font-size-display)] font-bold text-text">
            {copy.title}
          </h1>
          <p className="mt-2 text-base text-text-muted w-full">
            {copy.subtitle}
          </p>
        </div>
      </div>

      {/* Category Filters — collapsible, open by default */}
      <div className="px-[4vw] pb-md">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="flex items-center gap-2 mb-2 group"
        >
          <span className="text-text-dim text-xs font-bold uppercase tracking-wider group-hover:text-text transition-colors">
            Category
          </span>
          {activeCategories.size > 0 && (
            <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {activeCategories.size}
            </span>
          )}
          {showCategories ? (
            <ChevronUp size={14} className="text-text-dim" />
          ) : (
            <ChevronDown size={14} className="text-text-dim" />
          )}
          {hasFilters && (
            <span
              onClick={(e) => { e.stopPropagation(); clearAllFilters(); }}
              className="text-accent text-xs hover:underline ml-auto cursor-pointer"
            >
              Clear all
            </span>
          )}
        </button>
        <AnimatePresence initial={false}>
          {showCategories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pb-1">
                {categories.map((cat) => {
                  const isActive = activeCategories.has(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      aria-pressed={isActive}
                      className={cn(
                        "px-3 py-1.5 rounded text-xs font-bold transition-all duration-200 border",
                        isActive
                          ? "bg-accent text-white border-accent"
                          : "bg-transparent text-text-muted border-border hover:border-text-muted hover:text-text"
                      )}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stack / Tag Filters — collapsible, hidden by default */}
      <div className="px-[4vw] pb-xl">
        <button
          onClick={() => setShowStack(!showStack)}
          className="flex items-center gap-2 mb-2 group"
        >
          <span className="text-text-dim text-xs font-bold uppercase tracking-wider group-hover:text-text transition-colors">
            Stack
          </span>
          {activeTags.size > 0 && (
            <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {activeTags.size}
            </span>
          )}
          {showStack ? (
            <ChevronUp size={14} className="text-text-dim" />
          ) : (
            <ChevronDown size={14} className="text-text-dim" />
          )}
        </button>
        <AnimatePresence initial={false}>
          {showStack && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pb-1">
                {tags.map((tag) => {
                  const isActive = activeTags.has(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      aria-pressed={isActive}
                      className={cn(
                        "px-3 py-1 rounded text-[11px] font-semibold transition-all duration-200",
                        isActive
                          ? "bg-accent text-white"
                          : "bg-surface-hover text-text-muted hover:text-text"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      <div className="px-[4vw] pb-md">
        <span className="text-text-dim text-xs">
          Showing {filtered.length} of {projects.length} projects
        </span>
      </div>

      {/* Projects Grid */}
      <div className="px-[4vw]">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                profile={profile}
                onDetails={() => setModalProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {filtered.length === 0 && (
        <div className="px-[4vw] py-3xl text-center">
          <p className="text-[length:var(--font-size-heading)] text-text-muted">
            No projects match your filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-md text-accent hover:underline text-sm"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <ProjectDetailModal
        project={modalProject}
        profile={profile}
        onClose={() => setModalProject(null)}
      />
    </div>
  );
}
