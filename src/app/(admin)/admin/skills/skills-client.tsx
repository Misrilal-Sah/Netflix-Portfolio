"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { openConfirm } from "@/components/ui/confirm-dialog";
import { Pencil, Trash2, Plus, X, ChevronDown, ChevronRight, FolderPlus, Check } from "lucide-react";
import type { Skill } from "@/lib/types/database";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createSkill, updateSkill, deleteSkill, reorderSkillsGrouped, renameCategory } from "@/lib/actions/content";
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

function SkillForm({
  skill,
  defaultCategory,
  existingCategories,
  onDone,
}: {
  skill?: Skill;
  defaultCategory?: string;
  existingCategories: string[];
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? defaultCategory ?? "",
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
          {existingCategories.length > 0 ? (
            <select
              {...register("category", { required: true })}
              className={cn(inputClass, errors.category && "border-[#E50914]")}
            >
              <option value="">— select category —</option>
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          ) : (
            <input
              {...register("category", { required: true })}
              className={cn(inputClass, errors.category && "border-[#E50914]")}
              placeholder="Frontend, Backend, Database…"
            />
          )}
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
  // editingSkill: which skill is open in the modal
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  // creating: top-level new skill (no specific category)
  const [creating, setCreating] = useState(false);
  // creatingInCategory: inline create within a specific category
  const [creatingInCategory, setCreatingInCategory] = useState<string | null>(null);
  // addingCategory
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  // renamingCategory: which category is being renamed
  const [renamingCategory, setRenamingCategory] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isRenamePending, startRenamePending] = useTransition();

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

  function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    if (categoryOrder.includes(name)) {
      toast.error("Category already exists");
      return;
    }
    const newOrder = [...categoryOrder, name];
    setCategoryOrder(newOrder);
    setSkillsByCategory((prev) => ({ ...prev, [name]: [] }));
    setNewCategoryName("");
    setAddingCategory(false);
    toast.success(`Category "${name}" added — add skills to save it`);
  }

  async function handleDeleteCategory(cat: string) {
    const skills = skillsByCategory[cat] ?? [];
    if (skills.length > 0) {
      toast.error(`Move or delete all ${skills.length} skill(s) first`);
      return;
    }
    const ok = await openConfirm(`Remove the empty category "${cat}"?`, { title: "Delete category?", confirmLabel: "Delete" });
    if (!ok) return;
    const newOrder = categoryOrder.filter((c) => c !== cat);
    const newMap = { ...skillsByCategory };
    delete newMap[cat];
    setCategoryOrder(newOrder);
    setSkillsByCategory(newMap);
    toast.success("Category removed");
  }

  function startRename(cat: string) {
    setRenamingCategory(cat);
    setRenameValue(cat);
  }

  function handleSaveRename() {
    const oldName = renamingCategory!;
    const newName = renameValue.trim();
    if (!newName || newName === oldName) {
      setRenamingCategory(null);
      return;
    }
    if (categoryOrder.includes(newName)) {
      toast.error("Category with that name already exists");
      return;
    }
    startRenamePending(async () => {
      try {
        await renameCategory(oldName, newName);
        // Update local state
        const newOrder = categoryOrder.map((c) => (c === oldName ? newName : c));
        const skills = skillsByCategory[oldName] ?? [];
        const newMap = { ...skillsByCategory };
        delete newMap[oldName];
        newMap[newName] = skills.map((s) => ({ ...s, category: newName }));
        setCategoryOrder(newOrder);
        setSkillsByCategory(newMap);
        toast.success(`Renamed to "${newName}"`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Rename failed");
      } finally {
        setRenamingCategory(null);
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest">
          {totalSkills} Skills · {categoryOrder.length} Categories
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => { setAddingCategory(true); setCreating(false); setEditingSkill(null); setCreatingInCategory(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-[#808080] hover:text-white font-bold text-sm rounded-sm border border-[rgba(255,255,255,0.1)] transition-colors"
          >
            <FolderPlus size={14} /> New Category
          </button>
          <button
            onClick={() => { setCreating(true); setEditingSkill(null); setCreatingInCategory(null); setAddingCategory(false); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] text-white font-bold text-sm rounded-sm transition-colors"
          >
            <Plus size={14} /> New Skill
          </button>
        </div>
      </div>

      {/* Add Category Form */}
      {addingCategory && (
        <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-md p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-sm">New Category</h3>
            <button onClick={() => { setAddingCategory(false); setNewCategoryName(""); }} className="text-[#555] hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="flex gap-3">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              className={inputClass}
              placeholder="e.g. Frameworks, Payments, AI / ML"
              autoFocus
            />
            <button
              onClick={handleAddCategory}
              className="px-5 py-2 bg-[#E50914] hover:bg-[#f40d1a] text-white font-bold text-sm rounded-sm whitespace-nowrap transition-colors"
            >
              Add
            </button>
          </div>
          <p className="text-[#444] text-xs mt-2">Category will be saved once you add a skill to it.</p>
        </div>
      )}

      {/* Top-level New Skill Form — only shown when creating (not editing) */}
      {creating && !editingSkill && !creatingInCategory && (
        <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">New Skill</h3>
            <button
              onClick={() => setCreating(false)}
              className="text-[#555] hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          <SkillForm
            existingCategories={categoryOrder}
            onDone={() => setCreating(false)}
          />
        </div>
      )}

      {/* Inline Edit Skill Form — same pattern as New Skill, shown at top */}
      {editingSkill && (
        <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.15)] rounded-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Edit Skill — {editingSkill.name}</h3>
            <button onClick={() => setEditingSkill(null)} className="text-[#555] hover:text-white">
              <X size={18} />
            </button>
          </div>
          <SkillForm
            skill={editingSkill}
            existingCategories={categoryOrder}
            onDone={() => setEditingSkill(null)}
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
          const isRenaming = renamingCategory === cat;

          return (
            <div className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-md overflow-hidden">
              {/* Category header */}
              <div className="flex items-center">
                <button
                  onClick={() =>
                    !isRenaming && setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }))
                  }
                  className="flex-1 flex items-center gap-2 px-4 py-3 bg-[#161616] hover:bg-[#1c1c1c] transition-colors text-left"
                >
                  {isCollapsed ? (
                    <ChevronRight size={14} className="text-[#555]" />
                  ) : (
                    <ChevronDown size={14} className="text-[#555]" />
                  )}
                  {isRenaming ? (
                    <input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Enter") handleSaveRename();
                        if (e.key === "Escape") setRenamingCategory(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-transparent border-b border-[#E50914] text-[#E50914] font-bold text-sm uppercase tracking-wide outline-none flex-1"
                      autoFocus
                    />
                  ) : (
                    <span className="text-[#E50914] font-bold text-sm uppercase tracking-wide">
                      {cat}
                    </span>
                  )}
                  <span className="text-[#555] text-xs">({catSkills.length})</span>
                </button>

                {/* Per-category actions */}
                <div className="flex items-center gap-1 pr-3 bg-[#161616]">
                  {isRenaming ? (
                    <>
                      <button
                        title="Save rename"
                        onClick={() => handleSaveRename()}
                        disabled={isRenamePending}
                        className="p-1.5 text-[#555] hover:text-green-400 transition-colors disabled:opacity-50"
                      >
                        <Check size={13} />
                      </button>
                      <button
                        title="Cancel rename"
                        onClick={() => setRenamingCategory(null)}
                        className="p-1.5 text-[#555] hover:text-white transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        title="Rename category"
                        onClick={() => startRename(cat)}
                        className="p-1.5 text-[#555] hover:text-white transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        title="Add skill to this category"
                        onClick={() => {
                          setCreatingInCategory(cat);
                          setCreating(false);
                          setEditingSkill(null);
                          setAddingCategory(false);
                          setCollapsed((prev) => ({ ...prev, [cat]: false }));
                        }}
                        className="p-1.5 text-[#555] hover:text-[#E50914] transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                      <button
                        title="Delete category (must be empty)"
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-1.5 text-[#555] hover:text-[#E50914] transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Inline "add skill to this category" form */}
              {creatingInCategory === cat && (
                <div className="border-t border-[rgba(255,255,255,0.06)] bg-[#1a1a1a] px-4 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white text-sm font-bold">Add skill to {cat}</span>
                    <button onClick={() => setCreatingInCategory(null)} className="text-[#555] hover:text-white">
                      <X size={16} />
                    </button>
                  </div>
                  <SkillForm
                    defaultCategory={cat}
                    existingCategories={categoryOrder}
                    onDone={() => setCreatingInCategory(null)}
                  />
                </div>
              )}

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
                            onClick={() => {
                              setEditingSkill(skill);
                              setCreating(false);
                              setCreatingInCategory(null);
                              setAddingCategory(false);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
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
                  {catSkills.length === 0 && creatingInCategory !== cat && (
                    <p className="text-[#444] text-xs text-center py-4">No skills in this category.</p>
                  )}
                </div>
              )}
            </div>
          );
        }}
      />

      {categoryOrder.length === 0 && !creating && !addingCategory && (
        <div className="text-center py-16 text-[#555] text-sm">No skills yet.</div>
      )}

      {/* Edit Skill Modal removed — edit now shows inline at top */}
    </div>
  );
}
