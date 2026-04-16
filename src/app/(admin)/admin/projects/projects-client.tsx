"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Eye, EyeOff, Star, ChevronDown, ChevronUp, Search, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Project, ProjectButtonConfig, ProjectInsert, ProjectCategory, ProjectTag } from "@/lib/types/database";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  createProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,
  reorderProjectCategories,
  createProjectTag,
  updateProjectTag,
  deleteProjectTag,
  reorderProjectTags,
  seedProjectDefaults,
} from "@/lib/actions/content";
import { SortableList } from "@/components/admin/sortable-list";
import { openConfirm } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

type FormValues = {
  title: string;
  slug: string;
  description: string;
  category: string;
  sub_category: string;
  tags: string;
  github_url: string;
  demo_url: string;
  download_url: string;
  screenshot_url: string;
  date_label: string;
  readme_content: string;
  featured: boolean;
  visible: boolean;
  // Button config per profile
  btn_recruiter_demo_text: string;
  btn_recruiter_demo_color: string;
  btn_recruiter_details_text: string;
  btn_recruiter_details_color: string;
  btn_recruiter_github_text: string;
  btn_recruiter_github_color: string;
  btn_developer_demo_text: string;
  btn_developer_demo_color: string;
  btn_developer_details_text: string;
  btn_developer_details_color: string;
  btn_developer_github_text: string;
  btn_developer_github_color: string;
  btn_stalker_demo_text: string;
  btn_stalker_demo_color: string;
  btn_stalker_details_text: string;
  btn_stalker_details_color: string;
  btn_stalker_github_text: string;
  btn_stalker_github_color: string;
  btn_adventurer_demo_text: string;
  btn_adventurer_demo_color: string;
  btn_adventurer_details_text: string;
  btn_adventurer_details_color: string;
  btn_adventurer_github_text: string;
  btn_adventurer_github_color: string;
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
  onSave: (saved: ProjectInsert & { id?: string }) => void;
}

const PROFILES = ["recruiter", "developer", "stalker", "adventurer"] as const;

function getBtnDefault(
  project: Project | undefined,
  profile: string,
  field: keyof ProjectButtonConfig
): string {
  return (project?.button_config?.[profile]?.[field] as string) ?? "";
}

function ProjectForm({ project, onDone, onSave }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const [showBtnConfig, setShowBtnConfig] = useState(false);
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
      sub_category: project?.sub_category ?? "",
      tags: project?.tags?.join(", ") ?? "",
      github_url: project?.github_url ?? "",
      demo_url: project?.demo_url ?? "",
      download_url: project?.download_url ?? "",
      screenshot_url: project?.screenshot_url ?? "",
      date_label: project?.date_label ?? "",
      readme_content: project?.readme_content ?? "",
      featured: project?.featured ?? false,
      visible: project?.visible ?? true,
      // Per-profile button config
      btn_recruiter_demo_text: getBtnDefault(project, "recruiter", "demo_text"),
      btn_recruiter_demo_color: getBtnDefault(project, "recruiter", "demo_color"),
      btn_recruiter_details_text: getBtnDefault(project, "recruiter", "details_text"),
      btn_recruiter_details_color: getBtnDefault(project, "recruiter", "details_color"),
      btn_recruiter_github_text: getBtnDefault(project, "recruiter", "github_text"),
      btn_recruiter_github_color: getBtnDefault(project, "recruiter", "github_color"),
      btn_developer_demo_text: getBtnDefault(project, "developer", "demo_text"),
      btn_developer_demo_color: getBtnDefault(project, "developer", "demo_color"),
      btn_developer_details_text: getBtnDefault(project, "developer", "details_text"),
      btn_developer_details_color: getBtnDefault(project, "developer", "details_color"),
      btn_developer_github_text: getBtnDefault(project, "developer", "github_text"),
      btn_developer_github_color: getBtnDefault(project, "developer", "github_color"),
      btn_stalker_demo_text: getBtnDefault(project, "stalker", "demo_text"),
      btn_stalker_demo_color: getBtnDefault(project, "stalker", "demo_color"),
      btn_stalker_details_text: getBtnDefault(project, "stalker", "details_text"),
      btn_stalker_details_color: getBtnDefault(project, "stalker", "details_color"),
      btn_stalker_github_text: getBtnDefault(project, "stalker", "github_text"),
      btn_stalker_github_color: getBtnDefault(project, "stalker", "github_color"),
      btn_adventurer_demo_text: getBtnDefault(project, "adventurer", "demo_text"),
      btn_adventurer_demo_color: getBtnDefault(project, "adventurer", "demo_color"),
      btn_adventurer_details_text: getBtnDefault(project, "adventurer", "details_text"),
      btn_adventurer_details_color: getBtnDefault(project, "adventurer", "details_color"),
      btn_adventurer_github_text: getBtnDefault(project, "adventurer", "github_text"),
      btn_adventurer_github_color: getBtnDefault(project, "adventurer", "github_color"),
    },
  });

  const titleValue = watch("title");

  function onSubmit(values: FormValues) {
    // Build button_config from form values
    const buttonConfig: Record<string, ProjectButtonConfig> = {};
    for (const p of PROFILES) {
      const cfg: ProjectButtonConfig = {};
      const demoText = values[`btn_${p}_demo_text` as keyof FormValues] as string;
      const demoColor = values[`btn_${p}_demo_color` as keyof FormValues] as string;
      const detailsText = values[`btn_${p}_details_text` as keyof FormValues] as string;
      const detailsColor = values[`btn_${p}_details_color` as keyof FormValues] as string;
      const githubText = values[`btn_${p}_github_text` as keyof FormValues] as string;
      const githubColor = values[`btn_${p}_github_color` as keyof FormValues] as string;
      if (demoText) cfg.demo_text = demoText;
      if (demoColor) cfg.demo_color = demoColor;
      if (detailsText) cfg.details_text = detailsText;
      if (detailsColor) cfg.details_color = detailsColor;
      if (githubText) cfg.github_text = githubText;
      if (githubColor) cfg.github_color = githubColor;
      if (Object.keys(cfg).length > 0) buttonConfig[p] = cfg;
    }

    const payload = {
      title: values.title,
      slug: values.slug || slugify(values.title),
      description: values.description || null,
      category: values.category || null,
      sub_category: values.sub_category || null,
      tags: values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      github_url: values.github_url || null,
      demo_url: values.demo_url || null,
      download_url: values.download_url || null,
      screenshot_url: values.screenshot_url || null,
      date_label: values.date_label || null,
      readme_content: values.readme_content || null,
      button_config: buttonConfig,
      featured: values.featured,
      visible: values.visible,
      display_order: project?.display_order ?? 0,
    };

    startTransition(async () => {
      try {
        if (project) {
          await updateProject(project.id, payload);
          toast.success("Project updated");
          onSave({ ...payload, id: project.id });
        } else {
          await createProject(payload);
          toast.success("Project created");
          onSave(payload);
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
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Sub-category</label>
          <input {...register("sub_category")} className={inputClass} placeholder="Web Applications, Extensions…" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
          <input {...register("tags")} className={inputClass} placeholder="React, TypeScript, Next.js" />
        </div>
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Date Label</label>
          <input {...register("date_label")} className={inputClass} placeholder="March 2025, Published, etc." />
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
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Download APK URL</label>
        <input
          {...register("download_url")}
          type="url"
          className={inputClass}
          placeholder="https://… (leave empty if not applicable)"
        />
      </div>

      <ImageUploadField
        label="Screenshot"
        value={watch("screenshot_url")}
        onChange={(url) => setValue("screenshot_url", url, { shouldDirty: true })}
      />

      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">README Content (Markdown)</label>
        <textarea
          {...register("readme_content")}
          rows={8}
          className={cn(inputClass, "resize-y font-mono text-xs")}
          placeholder="Paste full README markdown here…"
        />
      </div>

      {/* Button Config per Profile — Collapsible */}
      <div className="border border-[rgba(255,255,255,0.1)] rounded-md overflow-hidden">
        <button
          type="button"
          onClick={() => setShowBtnConfig(!showBtnConfig)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#111] text-[#808080] text-xs font-bold uppercase tracking-wider hover:bg-[#1a1a1a] transition-colors"
        >
          <span>Button Config (per profile — optional)</span>
          {showBtnConfig ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showBtnConfig && (
          <div className="p-4 space-y-4 bg-[#0d0d0d]">
            <p className="text-[#555] text-xs">Leave empty to use defaults: View Live / Details / GitHub</p>
            {PROFILES.map((p) => (
              <div key={p} className="space-y-2">
                <span className="text-[#666] text-xs font-bold uppercase tracking-wider capitalize">{p}</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <input
                    {...register(`btn_${p}_demo_text` as keyof FormValues)}
                    className={cn(inputClass, "text-xs")}
                    placeholder="Demo btn text"
                  />
                  <input
                    {...register(`btn_${p}_demo_color` as keyof FormValues)}
                    className={cn(inputClass, "text-xs")}
                    placeholder="Demo btn color (#E50914)"
                  />
                  <input
                    {...register(`btn_${p}_details_text` as keyof FormValues)}
                    className={cn(inputClass, "text-xs")}
                    placeholder="Details btn text"
                  />
                  <input
                    {...register(`btn_${p}_details_color` as keyof FormValues)}
                    className={cn(inputClass, "text-xs")}
                    placeholder="Details btn color"
                  />
                  <input
                    {...register(`btn_${p}_github_text` as keyof FormValues)}
                    className={cn(inputClass, "text-xs")}
                    placeholder="GitHub btn text"
                  />
                  <input
                    {...register(`btn_${p}_github_color` as keyof FormValues)}
                    className={cn(inputClass, "text-xs")}
                    placeholder="GitHub btn color"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
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
  initialCategories: ProjectCategory[];
  initialTags: ProjectTag[];
}

// ─── Sortable row used inside TaxonomyManager ───────────────────────────────
function TaxonomySortableRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "grid grid-cols-[auto_1fr_auto] items-center px-3 py-2.5 hover:bg-[#1a1a1a] group transition-colors",
        isDragging && "opacity-40 bg-[#1a1a1a]"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="mr-2 text-[#333] hover:text-[#666] cursor-grab active:cursor-grabbing p-0.5 flex-shrink-0"
        tabIndex={-1}
      >
        <GripVertical size={14} />
      </button>
      {children}
    </div>
  );
}

// ─── Inline taxonomy manager (categories or tags) ────────────────────────────
function TaxonomyManager({
  label,
  items,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}: {
  label: string;
  items: { id: string; name: string }[];
  onAdd: (name: string) => Promise<void>;
  onUpdate: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<void>;
}) {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [localItems, setLocalItems] = useState(items);
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  // Sync localItems when parent re-fetches after mutations
  useEffect(() => setLocalItems(items), [items]);

  const filtered = search.trim()
    ? localItems.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : localItems;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = localItems.findIndex((i) => i.id === active.id);
    const newIdx = localItems.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(localItems, oldIdx, newIdx);
    setLocalItems(reordered);
    startTransition(() => onReorder(reordered.map((i) => i.id)));
  }

  const inputClass =
    "bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-2 py-1.5 text-white text-xs placeholder:text-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors w-full";

  return (
    <div className="space-y-0">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#111] hover:bg-[#161616] border border-[rgba(255,255,255,0.08)] rounded-md transition-colors"
      >
        <div className="flex items-center gap-2">
          {show ? <ChevronUp size={13} className="text-[#555]" /> : <ChevronDown size={13} className="text-[#555]" />}
          <span className="text-[#808080] text-xs font-bold uppercase tracking-wider">{label}</span>
          <span className="bg-[#2a2a2a] text-[#666] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {show && (
        <div className="border border-t-0 border-[rgba(255,255,255,0.08)] rounded-b-md overflow-hidden">
          {/* Search bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0d0d0d] border-b border-[rgba(255,255,255,0.06)]">
            <Search size={12} className="text-[#555] flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${label.toLowerCase().replace(" (stack)", "")}…`}
              className="flex-1 bg-transparent text-white text-xs placeholder:text-[#444] focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-[#555] hover:text-white">
                <X size={11} />
              </button>
            )}
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[auto_1fr_auto] bg-[#111] px-3 py-2 border-b border-[rgba(255,255,255,0.08)]">
            <span className="w-6" />
            <span className="text-[#555] text-[11px] font-bold uppercase tracking-wider">Name</span>
            <span className="text-[#555] text-[11px] font-bold uppercase tracking-wider">Actions</span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-center text-[#555] text-xs">
              {search ? `No results for "${search}"` : `No ${label.toLowerCase()} yet. Add one below.`}
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filtered.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="divide-y divide-[rgba(255,255,255,0.05)] max-h-64 overflow-y-auto">
                  {filtered.map((item, index) => (
                    <TaxonomySortableRow key={item.id} id={item.id}>
                      {/* Name / edit input */}
                      {editingId === item.id ? (
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className={inputClass}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && editingName.trim()) {
                              startTransition(async () => {
                                await onUpdate(item.id, editingName.trim());
                                setEditingId(null);
                              });
                            }
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[#444] text-[10px] w-4 text-right tabular-nums flex-shrink-0">{index + 1}</span>
                          <span className="text-white text-sm">{item.name}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-1 ml-3">
                        {editingId === item.id ? (
                          <>
                            <button
                              onClick={() =>
                                editingName.trim() &&
                                startTransition(async () => {
                                  await onUpdate(item.id, editingName.trim());
                                  setEditingId(null);
                                })
                              }
                              disabled={isPending || !editingName.trim()}
                              className="px-2 py-1 bg-green-700 hover:bg-green-600 disabled:opacity-30 text-white text-[11px] font-bold rounded-sm transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 text-[#555] hover:text-white transition-colors"
                            >
                              <X size={13} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => { setEditingId(item.id); setEditingName(item.name); }}
                              className="p-1.5 text-[#555] hover:text-white opacity-0 group-hover:opacity-100 transition-all rounded-sm hover:bg-[#2a2a2a]"
                              title="Edit"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={async () => {
                                const ok = await openConfirm(`"${item.name}" will be permanently deleted.`, { title: `Delete "${item.name}"?`, confirmLabel: "Delete" });
                                if (ok) startTransition(() => onDelete(item.id));
                              }}
                              disabled={isPending}
                              className="p-1.5 text-[#555] hover:text-[#E50914] opacity-0 group-hover:opacity-100 transition-all rounded-sm hover:bg-[#2a1010] disabled:cursor-not-allowed"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    </TaxonomySortableRow>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Add new row */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center px-3 py-2.5 bg-[#0d0d0d] border-t border-[rgba(255,255,255,0.08)]">
            <span className="w-6 mr-2" />
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`Add new ${label.toLowerCase().replace(" (stack)", "")}…`}
              className={inputClass}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newName.trim()) {
                  startTransition(async () => {
                    await onAdd(newName.trim());
                    setNewName("");
                  });
                }
              }}
            />
            <button
              onClick={() =>
                newName.trim() &&
                startTransition(async () => {
                  await onAdd(newName.trim());
                  setNewName("");
                })
              }
              disabled={isPending || !newName.trim()}
              className="ml-3 flex items-center gap-1.5 px-3 py-1.5 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-30 text-white text-xs font-bold rounded-sm transition-colors"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectsClient({ initialProjects, initialCategories, initialTags }: ProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [categories, setCategories] = useState(initialCategories);
  const [tags, setTags] = useState(initialTags);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [showTaxonomy, setShowTaxonomy] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave(saved: ProjectInsert & { id?: string }) {
    if (saved.id) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === saved.id
            ? { ...p, ...saved, updated_at: new Date().toISOString() }
            : p
        )
      );
    }
    router.refresh();
  }

  async function handleDeleteProject(id: string) {
    const ok = await openConfirm("This project will be permanently deleted. This cannot be undone.", { title: "Delete project?", confirmLabel: "Delete" });
    if (!ok) return;
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

  async function handleSeedDefaults() {
    const ok = await openConfirm("This will insert all default categories and tags into the database, skipping any that already exist.", { title: "Load defaults?", confirmLabel: "Load", danger: false });
    if (!ok) return;
    startTransition(async () => {
      try {
        await seedProjectDefaults();
        router.refresh();
        toast.success("Default categories & tags loaded");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Seed failed");
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest">
          {projects.length} Projects
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTaxonomy(!showTaxonomy)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-[#808080] font-bold text-sm rounded-sm border border-[rgba(255,255,255,0.1)] transition-colors"
          >
            {showTaxonomy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Categories & Tags
          </button>
          <button
            onClick={() => { setCreating(true); setEditing(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] text-white font-bold text-sm rounded-sm transition-colors"
          >
            <Plus size={14} /> New Project
          </button>
        </div>
      </div>

      {/* Category & Tag Management */}
      {showTaxonomy && (
        <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-md p-5 mb-6 space-y-4">
          {/* Seed defaults banner */}
          {categories.length === 0 && tags.length === 0 && (
            <div className="flex items-center justify-between bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-md px-4 py-3">
              <div>
                <p className="text-white text-sm font-semibold">Tables are empty</p>
                <p className="text-[#555] text-xs mt-0.5">Load all default categories &amp; tags (8 categories, 36 tags) to get started.</p>
              </div>
              <button
                onClick={handleSeedDefaults}
                disabled={isPending}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-40 text-white text-xs font-bold rounded-sm transition-colors whitespace-nowrap"
              >
                <Plus size={12} />
                Load Defaults
              </button>
            </div>
          )}

          <TaxonomyManager
            label="Categories"
            items={categories}
            onAdd={async (name) => {
              await createProjectCategory(name);
              router.refresh();
            }}
            onUpdate={async (id, name) => {
              await updateProjectCategory(id, name);
              router.refresh();
            }}
            onDelete={async (id) => {
              await deleteProjectCategory(id);
              router.refresh();
            }}
            onReorder={async (ids) => {
              await reorderProjectCategories(ids);
            }}
          />
          <TaxonomyManager
            label="Tags (Stack)"
            items={tags}
            onAdd={async (name) => {
              await createProjectTag(name);
              router.refresh();
            }}
            onUpdate={async (id, name) => {
              await updateProjectTag(id, name);
              router.refresh();
            }}
            onDelete={async (id) => {
              await deleteProjectTag(id);
              router.refresh();
            }}
            onReorder={async (ids) => {
              await reorderProjectTags(ids);
            }}
          />
        </div>
      )}

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
            onSave={handleSave}
          />
        </div>
      )}

      <SortableList
        listId="projects"
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
