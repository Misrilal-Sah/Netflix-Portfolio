"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { openConfirm } from "@/components/ui/confirm-dialog";
import { Pencil, Trash2, Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import type { Experience } from "@/lib/types/database";
import { createExperience, updateExperience, deleteExperience, reorderExperience } from "@/lib/actions/content";
import { cn } from "@/lib/utils";

const COLOR_PRESETS = [
  "#b7f3b7", // mint green (work default)
  "#FFE5B4", // peach (education default)
  "#b3d9ff", // sky blue
  "#ffd6d6", // rose
  "#e8d5ff", // lavender
  "#fff3b3", // lemon
  "#d5f5e3", // teal
  "#fce4d6", // coral
  "#f0f0f0", // light grey
];

type FormValues = {
  company: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string;
  current: boolean;
  card_color: string;
};

const inputClass = "w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-3 py-2 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors";

function ExperienceForm({ exp, onDone }: { exp?: Experience; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      company: exp?.company ?? "",
      role: exp?.role ?? "",
      description: exp?.description ?? "",
      start_date: exp?.start_date ?? "",
      end_date: exp?.end_date ?? "",
      current: exp?.current ?? false,
      card_color: exp?.card_color ?? "#b7f3b7",
    },
  });
  const isCurrent = watch("current");
  const cardColor = watch("card_color");

  function onSubmit(values: FormValues) {
    const payload = {
      company: values.company,
      role: values.role,
      description: values.description || null,
      start_date: values.start_date,
      end_date: values.current ? null : (values.end_date || null),
      current: values.current,
      display_order: exp?.display_order ?? 0,
      card_color: values.card_color || null,
    };
    startTransition(async () => {
      try {
        if (exp) { await updateExperience(exp.id, payload); toast.success("Updated"); }
        else { await createExperience(payload); toast.success("Created"); }
        onDone();
      } catch (err) { toast.error(err instanceof Error ? err.message : "Error"); }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Company *</label>
          <input {...register("company", { required: true })} className={cn(inputClass, errors.company && "border-[#E50914]")} />
        </div>
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Role *</label>
          <input {...register("role", { required: true })} className={cn(inputClass, errors.role && "border-[#E50914]")} />
        </div>
      </div>
      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Description</label>
        <textarea {...register("description")} rows={3} className={cn(inputClass, "resize-none")} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Start Date *</label>
          <input {...register("start_date", { required: true })} type="date" className={cn(inputClass, errors.start_date && "border-[#E50914]")} />
        </div>
        {!isCurrent && (
          <div>
            <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">End Date</label>
            <input {...register("end_date")} type="date" className={inputClass} />
          </div>
        )}
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input {...register("current")} type="checkbox" className="accent-[#E50914]" />
        <span className="text-sm text-[#808080]">Current Role</span>
      </label>

      {/* Card Color picker */}
      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Card Background Color</label>
        {/* Hidden registered field */}
        <input type="hidden" {...register("card_color")} />
        <div className="flex flex-wrap items-center gap-2">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue("card_color", color)}
              title={color}
              className="w-8 h-8 rounded-sm transition-all flex-shrink-0"
              style={{
                backgroundColor: color,
                outline: cardColor === color ? "2px solid #ffffff" : "2px solid transparent",
                outlineOffset: "2px",
              }}
            />
          ))}
          {/* Custom color input */}
          <div className="relative flex-shrink-0">
            <input
              type="color"
              value={cardColor || "#b7f3b7"}
              onChange={(e) => setValue("card_color", e.target.value)}
              title="Custom color"
              className="w-8 h-8 rounded-sm cursor-pointer border border-[rgba(255,255,255,0.2)] bg-transparent"
              style={{ padding: "1px" }}
            />
          </div>
          <span className="text-[#555] text-xs ml-1 font-mono">{cardColor || "#b7f3b7"}</span>
        </div>
        {/* Preview strip */}
        <div
          className="mt-2 h-6 rounded-sm border border-[rgba(255,255,255,0.1)]"
          style={{ backgroundColor: cardColor || "#b7f3b7" }}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending} className="px-5 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-50 text-white font-bold text-sm rounded-sm transition-colors">
          {isPending ? "Saving…" : exp ? "Update" : "Create"}
        </button>
        <button type="button" onClick={onDone} className="px-5 py-2 bg-[#1a1a1a] hover:bg-[#222] text-[#808080] font-bold text-sm rounded-sm border border-[rgba(255,255,255,0.1)] transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ExperienceClient({ initialExperience }: { initialExperience: Experience[] }) {
  const [experience, setExperience] = useState(initialExperience);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    const ok = await openConfirm("This experience entry will be permanently removed.", { title: "Delete entry?", confirmLabel: "Delete" });
    if (!ok) return;
    startTransition(async () => {
      try { await deleteExperience(id); setExperience(prev => prev.filter(e => e.id !== id)); toast.success("Deleted"); }
      catch (err) { toast.error(err instanceof Error ? err.message : "Error"); }
    });
  }

  function moveItem(index: number, direction: -1 | 1) {
    const swapIdx = index + direction;
    if (swapIdx < 0 || swapIdx >= experience.length) return;
    const newList = [...experience];
    [newList[index], newList[swapIdx]] = [newList[swapIdx], newList[index]];
    setExperience(newList);
    startTransition(async () => {
      try { await reorderExperience(newList.map(e => e.id)); }
      catch { toast.error("Failed to save order"); }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest">{experience.length} Experience Entries</h2>
        <button onClick={() => { setCreating(true); setEditing(null); }} className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] text-white font-bold text-sm rounded-sm transition-colors">
          <Plus size={14} /> New Entry
        </button>
      </div>

      {(creating || editing) && (
        <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">{editing ? "Edit Experience" : "New Experience"}</h3>
            <button onClick={() => { setCreating(false); setEditing(null); }} className="text-[#555] hover:text-white"><X size={18} /></button>
          </div>
          <ExperienceForm exp={editing ?? undefined} onDone={() => { setCreating(false); setEditing(null); }} />
        </div>
      )}

      <div className="space-y-2">
        {experience.map((exp, index) => (
          <div key={exp.id} className="flex items-center gap-3 bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-sm px-4 py-3 hover:border-[rgba(255,255,255,0.15)] transition-colors">
            {/* Reorder buttons */}
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button
                onClick={() => moveItem(index, -1)}
                disabled={isPending || index === 0}
                className="p-0.5 text-[#555] hover:text-white disabled:opacity-20 transition-colors"
                title="Move up"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={() => moveItem(index, 1)}
                disabled={isPending || index === experience.length - 1}
                className="p-0.5 text-[#555] hover:text-white disabled:opacity-20 transition-colors"
                title="Move down"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Color swatch */}
            <div
              className="w-4 h-10 rounded-sm flex-shrink-0 border border-[rgba(255,255,255,0.15)]"
              style={{ backgroundColor: exp.card_color || "#b7f3b7" }}
              title={exp.card_color || "default"}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium">{exp.role}</span>
                {exp.current && <span className="text-xs bg-[rgba(229,9,20,0.15)] text-[#E50914] px-2 py-0.5 rounded-sm">Current</span>}
              </div>
              <span className="text-[#555] text-xs">{exp.company} · {exp.start_date} – {exp.current ? "Present" : (exp.end_date ?? "—")}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => { setEditing(exp); setCreating(false); }} className="p-1.5 text-[#555] hover:text-white transition-colors"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(exp.id)} disabled={isPending} className="p-1.5 text-[#555] hover:text-[#E50914] transition-colors disabled:opacity-50"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {experience.length === 0 && !creating && (
        <div className="text-center py-16 text-[#555] text-sm">No experience entries yet.</div>
      )}
    </div>
  );
}

