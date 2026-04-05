"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { openConfirm } from "@/components/ui/confirm-dialog";
import { Pencil, Trash2, Plus, X, ChevronDown, ChevronRight } from "lucide-react";
import type { Skill } from "@/lib/types/database";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createSkill, updateSkill, deleteSkill, reorderSkillsGrouped } from "@/lib/actions/content";
import { SortableList } from "@/components/admin/sortable-list";
import { cn } from "@/lib/utils";

type FormValues = {
  name: string;
  category: string;
  icon_url: string;
  description: string;
  visible: boolean;
};

const inputClass =
  "w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-3 py-2 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors";

function SkillForm({ skill, onDone }: { skill?: Skill; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "",
      icon_url: skill?.icon_url ?? "",
      description: skill?.description ?? "",
      visible: skill?.visible ?? true,
    },
  });

  function onSubmit(values: FormValues) {
    const payload = {
      name: values.name,
      category: values.category,
      icon_url: values.icon_url || null,
      description: values.description || null,
      visible: values.visible,
      display_order: skill?.display_order ?? 0,
    };

    startTransition(async () => {
      try {
        if (skill) {
          await updateSkill(skill.id, payload);
          toast.success("Skill updated");
        } else {
          await createSkill(payload);
          toast.success("Skill created — reload to see it");
        }
        onDone();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Name *</label>
          <input {...register("name", { required: true })} className={cn(inputClass, errors.name && "border-[#E50914]")} placeholder="React" />
        </div>
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Category *</label>
          <input {...register("category", { required: true })} className={cn(inputClass, errors.category && "border-[#E50914]")} placeholder="Frontend, Backend, Database…" />
        </div>
      </div>
      <ImageUploadField
        label="Icon"
        value={watch("icon_url")}
        onChange={(url) => setValue("icon_url", url, { shouldDirty: true })}
      />
      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Description</label>
        <input {...register("description")} className={inputClass} placeholder="Short description" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input {...register("visible")} type="checkbox" className="accent-[#E50914]" />
        <span className="text-sm text-[#808080]">Visible</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending} className="px-5 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-50 text-white font-bold text-sm rounded-sm transition-colors">
          {isPending ? "Saving…" : skill ? "Update" : "Create Skill"}
        </button>
        <button type="button" onClick={onDone} className="px-5 py-2 bg-[#1a1a1a] hover:bg-[#222] text-[#808080] font-bold text-sm rounded-sm border border-[rgba(255,255,255,0.1)] transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});
}

function getCategoryOrder(skills: Skill[]): string[] {
  // Preserve unique categories in order of first appearance (sorted by display_order)
  const seen = new Set<string>();
  const order: string[] = [];
  [...skills].sort((a, b) => a.display_order - b.display_order).forEach((s) => {
    if (!seen.has(s.category)) { seen.add(s.category); order.push(s.category); }
  });
  return order;
}

type CategoryItem = { id: string };

export function SkillsClient({ initialSkills }: { initialSkills: Skill[] }) {
  const [skillsByCategory, setSkillsByCategory] = useState<Record<string, Skill[]>>(
    groupByCategory(initialSkills)
  );
  const [categoryOrder, setCategoryOrder] = useState<string[]>(
    getCategoryOrder(initialSkills)
  );
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Skill | null>(null);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function saveGroupedOrder(
    catOrder: string[],
    skillsMap: Record<string, Skill[]>
  ) {
    const skillsPerCategory: Record<string, string[]> = {};
    catOrder.forEach((cat) => {
      skillsPerCategory[cat] = (skillsMap[cat] ?? []).map((s) => s.id);
    });
    try {
      await reorderSkillsGrouped(catOrder, skillsPerCategory);
    } catch {
      toast.error("Reorder failed");
    }
  }

  async function handleCategoryReorder(ids: string[]) {
    setCategoryOrder(ids);
    await saveGroupedOrder(ids, skillsByCategory);
  }

  async function handleSkillReorder(category: string, ids: string[]) {
    const current = skillsByCategory[category] ?? [];
    const reordered = ids.map((id) => current.find((s) => s.id === id)!);
    const newMap = { ...skillsByCategory, [category]: reordered };
    setSkillsByCategory(newMap);
    await saveGroupedOrder(categoryOrder, newMap);
  }

  async function handleDelete(id: string, category: string) {
    const ok = await openConfirm("This skill will be permanently removed.", { title: "Delete skill?", confirmLabel: "Delete" });
    if (!ok) return;
    startTransition(async () => {
      try {
        await deleteSkill(id);
        const newMap = {
          ...skillsByCategory,
          [category]: skillsByCategory[category].filter((s) => s.id !== id),
        };
        setSkillsByCategory(newMap);
        toast.success("Skill deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  const totalSkills = Object.values(skillsByCategory).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const categoryItems: CategoryItem[] = categoryOrder.map((c) => ({ id: c }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest">
          {totalSkills} Skills · {categoryOrder.length} Categories
        </h2>
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] text-white font-bold text-sm rounded-sm transition-colors"
        >
          <Plus size={14} /> New Skill
        </button>
      </div>

      {(creating || editing) && (
        <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">{editing ? "Edit Skill" : "New Skill"}</h3>
            <button
              onClick={() => { setCreating(false); setEditing(null); }}
              className="text-[#555] hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          <SkillForm
            skill={editing ?? undefined}
            onDone={() => { setCreating(false); setEditing(null); }}
          />
        </div>
      )}

      <p className="text-[#555] text-xs mb-4">
        Drag <span className="text-[#808080]">≡</span> handles to reorder categories or skills within a category.
      </p>

      {/* Category-level drag */}
      <SortableList
        listId="skills-categories"
        items={categoryItems}
        onReorder={handleCategoryReorder}
        renderItem={(catItem) => {
          const cat = catItem.id;
          const catSkills = skillsByCategory[cat] ?? [];
          const isCollapsed = collapsed[cat];

          return (
            <div className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-md overflow-hidden">
              {/* Category header */}
              <button
                onClick={() =>
                  setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }))
                }
                className="w-full flex items-center justify-between px-4 py-3 bg-[#161616] hover:bg-[#1c1c1c] transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isCollapsed ? (
                    <ChevronRight size={14} className="text-[#555]" />
                  ) : (
                    <ChevronDown size={14} className="text-[#555]" />
                  )}
                  <span className="text-[#E50914] font-bold text-sm uppercase tracking-wide">
                    {cat}
                  </span>
                  <span className="text-[#555] text-xs">({catSkills.length})</span>
                </div>
              </button>

              {/* Skills within category */}
              {!isCollapsed && (
                <div className="p-3">
                  <SortableList
                    listId={`skills-${cat}`}
                    items={catSkills}
                    onReorder={(ids) => handleSkillReorder(cat, ids)}
                    renderItem={(skill) => (
                      <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[rgba(255,255,255,0.06)] rounded-sm px-3 py-2.5 hover:border-[rgba(255,255,255,0.15)] transition-colors">
                        <span className="text-white text-sm flex-1">{skill.name}</span>
                        {skill.description && (
                          <span className="text-[#444] text-xs hidden sm:block truncate max-w-[200px]">
                            {skill.description}
                          </span>
                        )}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => { setEditing(skill); setCreating(false); }}
                            className="p-1.5 text-[#555] hover:text-white transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id, cat)}
                            disabled={isPending}
                            className="p-1.5 text-[#555] hover:text-[#E50914] transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  />
                  {catSkills.length === 0 && (
                    <p className="text-[#444] text-xs text-center py-4">No skills in this category.</p>
                  )}
                </div>
              )}
            </div>
          );
        }}
      />

      {categoryOrder.length === 0 && !creating && (
        <div className="text-center py-16 text-[#555] text-sm">No skills yet.</div>
      )}
    </div>
  );
}

