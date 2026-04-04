"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import type { Skill } from "@/lib/types/database";
import { createSkill, updateSkill, deleteSkill, reorderSkills } from "@/lib/actions/content";
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
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
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
          toast.success("Skill created");
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
          <input {...register("category", { required: true })} className={cn(inputClass, errors.category && "border-[#E50914]")} placeholder="Frontend, Backend, DB…" />
        </div>
      </div>
      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Icon URL</label>
        <input {...register("icon_url")} className={inputClass} placeholder="https://cdn.simpleicons.org/react" />
      </div>
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

export function SkillsClient({ initialSkills }: { initialSkills: Skill[] }) {
  const [skills, setSkills] = useState(initialSkills);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Delete this skill?")) return;
    startTransition(async () => {
      try {
        await deleteSkill(id);
        setSkills((prev) => prev.filter((s) => s.id !== id));
        toast.success("Skill deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest">{skills.length} Skills</h2>
        <button onClick={() => { setCreating(true); setEditing(null); }} className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] text-white font-bold text-sm rounded-sm transition-colors">
          <Plus size={14} /> New Skill
        </button>
      </div>

      {(creating || editing) && (
        <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">{editing ? "Edit Skill" : "New Skill"}</h3>
            <button onClick={() => { setCreating(false); setEditing(null); }} className="text-[#555] hover:text-white"><X size={18} /></button>
          </div>
          <SkillForm skill={editing ?? undefined} onDone={() => { setCreating(false); setEditing(null); }} />
        </div>
      )}

      <SortableList
        items={skills}
        onReorder={async (ids) => { try { await reorderSkills(ids); } catch { toast.error("Reorder failed"); } }}
        renderItem={(skill) => (
          <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-sm px-4 py-3 hover:border-[rgba(255,255,255,0.15)] transition-colors">
            <div className="flex-1 min-w-0">
              <span className="text-white text-sm font-medium">{skill.name}</span>
              <span className="text-[#555] text-xs ml-2">{skill.category}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => { setEditing(skill); setCreating(false); }} className="p-1.5 text-[#555] hover:text-white transition-colors"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(skill.id)} disabled={isPending} className="p-1.5 text-[#555] hover:text-[#E50914] transition-colors disabled:opacity-50"><Trash2 size={14} /></button>
            </div>
          </div>
        )}
      />
      {skills.length === 0 && !creating && <div className="text-center py-16 text-[#555] text-sm">No skills yet.</div>}
    </div>
  );
}
