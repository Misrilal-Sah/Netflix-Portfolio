"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Eye, EyeOff, Star } from "lucide-react";
import type { Project } from "@/lib/types/database";
import {
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from "@/lib/actions/content";
import { SortableList } from "@/components/admin/sortable-list";
import { cn } from "@/lib/utils";

type FormValues = {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
  github_url: string;
  demo_url: string;
  screenshot_url: string;
  featured: boolean;
  visible: boolean;
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ProjectFormProps {
  project?: Project;
  onDone: () => void;
}

function ProjectForm({ project, onDone }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      description: project?.description ?? "",
      category: project?.category ?? "",
      tags: project?.tags?.join(", ") ?? "",
      github_url: project?.github_url ?? "",
      demo_url: project?.demo_url ?? "",
      screenshot_url: project?.screenshot_url ?? "",
      featured: project?.featured ?? false,
      visible: project?.visible ?? true,
    },
  });

  const titleValue = watch("title");

  function onSubmit(values: FormValues) {
    const payload = {
      title: values.title,
      slug: values.slug || slugify(values.title),
      description: values.description || null,
      category: values.category || null,
      tags: values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      github_url: values.github_url || null,
      demo_url: values.demo_url || null,
      screenshot_url: values.screenshot_url || null,
      featured: values.featured,
      visible: values.visible,
      display_order: project?.display_order ?? 0,
    };

    startTransition(async () => {
      try {
        if (project) {
          await updateProject(project.id, payload);
          toast.success("Project updated");
        } else {
          await createProject(payload);
          toast.success("Project created");
        }
        onDone();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    });
  }

  const inputClass =
    "w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-3 py-2 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Title *</label>
          <input
            {...register("title", { required: true })}
            className={cn(inputClass, errors.title && "border-[#E50914]")}
            placeholder="Project title"
            onChange={(e) => {
              register("title").onChange(e);
              if (!project) setValue("slug", slugify(e.target.value));
            }}
          />
        </div>
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Slug *</label>
          <input
            {...register("slug", { required: true })}
            className={cn(inputClass, errors.slug && "border-[#E50914]")}
            placeholder="auto-generated"
          />
        </div>
      </div>

      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className={cn(inputClass, "resize-none")}
          placeholder="Project description"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Category</label>
          <input {...register("category")} className={inputClass} placeholder="Full Stack, React, Python…" />
        </div>
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
          <input {...register("tags")} className={inputClass} placeholder="React, TypeScript, Next.js" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">GitHub URL</label>
          <input {...register("github_url")} type="url" className={inputClass} placeholder="https://github.com/…" />
        </div>
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Demo URL</label>
          <input {...register("demo_url")} type="url" className={inputClass} placeholder="https://…" />
        </div>
      </div>

      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Screenshot URL</label>
        <input {...register("screenshot_url")} className={inputClass} placeholder="/images/Projects/…  or https://…" />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input {...register("featured")} type="checkbox" className="accent-[#E50914]" />
          <span className="text-sm text-[#808080]">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input {...register("visible")} type="checkbox" className="accent-[#E50914]" />
          <span className="text-sm text-[#808080]">Visible</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-50 text-white font-bold text-sm rounded-sm transition-colors"
        >
          {isPending ? "Saving…" : project ? "Update Project" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="px-5 py-2 bg-[#1a1a1a] hover:bg-[#222] text-[#808080] font-bold text-sm rounded-sm border border-[rgba(255,255,255,0.1)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

interface ProjectsClientProps {
  initialProjects: Project[];
}

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDeleteProject(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast.success("Project deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  async function handleReorder(orderedIds: string[]) {
    try {
      await reorderProjects(orderedIds);
    } catch {
      toast.error("Reorder failed");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest">
          {projects.length} Projects
        </h2>
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] text-white font-bold text-sm rounded-sm transition-colors"
        >
          <Plus size={14} /> New Project
        </button>
      </div>

      {(creating || editing) && (
        <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">{editing ? "Edit Project" : "New Project"}</h3>
            <button onClick={() => { setCreating(false); setEditing(null); }} className="text-[#555] hover:text-white">
              <X size={18} />
            </button>
          </div>
          <ProjectForm
            project={editing ?? undefined}
            onDone={() => { setCreating(false); setEditing(null); }}
          />
        </div>
      )}

      <SortableList
        items={projects}
        onReorder={handleReorder}
        renderItem={(project) => (
          <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-sm px-4 py-3 hover:border-[rgba(255,255,255,0.15)] transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium truncate">{project.title}</span>
                {project.featured && <Star size={12} className="text-[#F5C518] flex-shrink-0" />}
                {!project.visible && <EyeOff size={12} className="text-[#555] flex-shrink-0" />}
              </div>
              <span className="text-[#555] text-xs">{project.category ?? "—"} · {project.tags.slice(0, 3).join(", ")}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => { setEditing(project); setCreating(false); }}
                className="p-1.5 text-[#555] hover:text-white transition-colors"
                aria-label="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDeleteProject(project.id)}
                disabled={isPending}
                className="p-1.5 text-[#555] hover:text-[#E50914] transition-colors disabled:opacity-50"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}
      />

      {projects.length === 0 && !creating && (
        <div className="text-center py-16 text-[#555] text-sm">
          No projects yet. Click &quot;New Project&quot; to add one.
        </div>
      )}
    </div>
  );
}
