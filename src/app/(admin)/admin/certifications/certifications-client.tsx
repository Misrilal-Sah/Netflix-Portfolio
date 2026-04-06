"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { openConfirm } from "@/components/ui/confirm-dialog";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import type { Certification } from "@/lib/types/database";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createCertification, updateCertification, deleteCertification, reorderCertifications } from "@/lib/actions/content";
import { SortableList } from "@/components/admin/sortable-list";
import { cn } from "@/lib/utils";

type FormValues = {
  title: string;
  provider: string;
  logo_url: string;
  date_earned: string;
  date_expires: string;
  short_description: string;
  verification_url: string;
  visible: boolean;
};

const inputClass = "w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-3 py-2 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors";

function CertForm({ cert, onDone }: { cert?: Certification; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: cert?.title ?? "",
      provider: cert?.provider ?? "",
      logo_url: cert?.logo_url ?? "",
      date_earned: cert?.date_earned ?? "",
      date_expires: cert?.date_expires ?? "",
      short_description: cert?.short_description ?? "",
      verification_url: cert?.verification_url ?? "",
      visible: cert?.visible ?? true,
    },
  });

  function onSubmit(values: FormValues) {
    const payload = {
      title: values.title,
      provider: values.provider,
      logo_url: values.logo_url || null,
      date_earned: values.date_earned || null,
      date_expires: values.date_expires || null,
      short_description: values.short_description || null,
      verification_url: values.verification_url || null,
      visible: values.visible,
      display_order: cert?.display_order ?? 0,
    };
    startTransition(async () => {
      try {
        if (cert) { await updateCertification(cert.id, payload); toast.success("Updated"); }
        else { await createCertification(payload); toast.success("Created"); }
        onDone();
      } catch (err) { toast.error(err instanceof Error ? err.message : "Error"); }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Title *</label>
          <input {...register("title", { required: true })} className={cn(inputClass, errors.title && "border-[#E50914]")} />
        </div>
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Provider *</label>
          <input {...register("provider", { required: true })} className={cn(inputClass, errors.provider && "border-[#E50914]")} placeholder="Google, AWS, Meta…" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Date Earned</label>
          <input {...register("date_earned")} type="date" className={inputClass} />
        </div>
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Date Expires (Optional)</label>
          <input {...register("date_expires")} type="date" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Short Description</label>
        <textarea {...register("short_description")} rows={2} className={cn(inputClass, "resize-none")} placeholder="Brief details about the certification…" />
      </div>
      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Verification URL</label>
        <input {...register("verification_url")} type="url" className={inputClass} placeholder="https://…" />
      </div>
      <ImageUploadField
        label="Logo"
        value={watch("logo_url")}
        onChange={(url) => setValue("logo_url", url, { shouldDirty: true })}
      />
      <label className="flex items-center gap-2 cursor-pointer">
        <input {...register("visible")} type="checkbox" className="accent-[#E50914]" />
        <span className="text-sm text-[#808080]">Visible</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending} className="px-5 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-50 text-white font-bold text-sm rounded-sm transition-colors">{isPending ? "Saving…" : cert ? "Update" : "Create"}</button>
        <button type="button" onClick={onDone} className="px-5 py-2 bg-[#1a1a1a] hover:bg-[#222] text-[#808080] font-bold text-sm rounded-sm border border-[rgba(255,255,255,0.1)] transition-colors">Cancel</button>
      </div>
    </form>
  );
}

export function CertificationsClient({ initialCerts }: { initialCerts: Certification[] }) {
  const [certs, setCerts] = useState(initialCerts);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [creating, setCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    const ok = await openConfirm("This certification will be permanently removed.", { title: "Delete certification?", confirmLabel: "Delete" });
    if (!ok) return;
    startTransition(async () => {
      try { await deleteCertification(id); setCerts(prev => prev.filter(c => c.id !== id)); toast.success("Deleted"); }
      catch (err) { toast.error(err instanceof Error ? err.message : "Error"); }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest">{certs.length} Certifications</h2>
        <button onClick={() => { setCreating(true); setEditing(null); }} className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] text-white font-bold text-sm rounded-sm transition-colors"><Plus size={14} /> New Certification</button>
      </div>
      {(creating || editing) && (
        <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">{editing ? "Edit Certification" : "New Certification"}</h3>
            <button onClick={() => { setCreating(false); setEditing(null); }} className="text-[#555] hover:text-white"><X size={18} /></button>
          </div>
          <CertForm cert={editing ?? undefined} onDone={() => { setCreating(false); setEditing(null); }} />
        </div>
      )}
      <SortableList
        listId="certifications"
        items={certs}
        onReorder={async (ids) => { try { await reorderCertifications(ids); } catch { toast.error("Reorder failed"); } }}
        renderItem={(cert) => (
          <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-sm px-4 py-3 hover:border-[rgba(255,255,255,0.15)] transition-colors">
            <div className="flex-1 min-w-0">
              <span className="text-white text-sm font-medium">{cert.title}</span>
              <span className="text-[#555] text-xs ml-2">{cert.provider} · {cert.date_earned ?? "—"}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => { setEditing(cert); setCreating(false); }} className="p-1.5 text-[#555] hover:text-white transition-colors"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(cert.id)} disabled={isPending} className="p-1.5 text-[#555] hover:text-[#E50914] transition-colors disabled:opacity-50"><Trash2 size={14} /></button>
            </div>
          </div>
        )}
      />
      {certs.length === 0 && !creating && <div className="text-center py-16 text-[#555] text-sm">No certifications yet.</div>}
    </div>
  );
}
