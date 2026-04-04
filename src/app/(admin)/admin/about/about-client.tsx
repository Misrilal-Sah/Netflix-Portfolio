"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Pencil, X, Check } from "lucide-react";
import type { AboutSection } from "@/lib/types/database";
import { updateAboutSection, createAboutSection } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

const inputClass = "w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-3 py-2 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors";

type FormValues = { title: string; content: string };

function SectionEditor({ section, onDone }: { section: AboutSection; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { title: section.title, content: section.content ?? "" },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        await updateAboutSection(section.id, { title: values.title, content: values.content || null });
        toast.success("Section updated");
        onDone();
      } catch (err) { toast.error(err instanceof Error ? err.message : "Error"); }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-3">
      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Title</label>
        <input {...register("title")} className={inputClass} />
      </div>
      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Content</label>
        <textarea {...register("content")} rows={5} className={cn(inputClass, "resize-y")} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-50 text-white font-bold text-sm rounded-sm transition-colors">
          <Check size={14} /> {isPending ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onDone} className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-[#808080] font-bold text-sm rounded-sm border border-[rgba(255,255,255,0.1)] transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function AboutClient({ initialSections }: { initialSections: AboutSection[] }) {
  const [sections, setSections] = useState(initialSections);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest mb-6">About Content</h2>
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[#808080] text-xs font-bold uppercase tracking-wider">{section.section_key}</span>
                <h3 className="text-white font-bold mt-0.5">{section.title}</h3>
              </div>
              <button
                onClick={() => setEditingId(editingId === section.id ? null : section.id)}
                className="p-1.5 text-[#555] hover:text-white transition-colors"
              >
                {editingId === section.id ? <X size={16} /> : <Pencil size={16} />}
              </button>
            </div>

            {editingId === section.id ? (
              <SectionEditor section={section} onDone={() => setEditingId(null)} />
            ) : (
              <p className="mt-3 text-[#808080] text-sm leading-relaxed">
                {section.content ?? <span className="text-[#444] italic">No content</span>}
              </p>
            )}
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-16 text-[#555] text-sm">No about sections yet. Run the seed script first.</div>
        )}
      </div>
    </div>
  );
}
