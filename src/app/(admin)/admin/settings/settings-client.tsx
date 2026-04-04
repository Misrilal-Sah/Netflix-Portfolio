"use client";

import { useState, useTransition, useRef } from "react";
import { toast } from "sonner";
import { Plus, Save, Upload, X } from "lucide-react";
import { upsertSiteSetting } from "@/lib/actions/admin";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const inputClass = "w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-3 py-2 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors";

// ─── Image Upload ─────────────────────────────────────────────────────────────

async function resizeAndConvertToWebP(file: File, maxPx = 1920): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        const ratio = Math.min(maxPx / width, maxPx / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => { URL.revokeObjectURL(url); if (blob) resolve(blob); else reject(new Error("Canvas toBlob failed")); },
        "image/webp",
        0.85
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [lastUrl, setLastUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) { toast.error("File too large (max 10MB)"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Only image files supported"); return; }

    setUploading(true);
    try {
      const blob = await resizeAndConvertToWebP(file);
      if (blob.size > 2 * 1024 * 1024) { toast.error("Resized image still exceeds 2MB"); setUploading(false); return; }

      const supabase = createClient();
      const filename = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.webp`;
      const { data, error } = await supabase.storage.from("portfolio-images").upload(filename, blob, { contentType: "image/webp", upsert: false });

      if (error) { toast.error(`Upload failed: ${error.message}`); return; }

      const { data: { publicUrl } } = supabase.storage.from("portfolio-images").getPublicUrl(data.path);
      setLastUrl(publicUrl);
      toast.success("Uploaded! URL copied to clipboard");
      navigator.clipboard.writeText(publicUrl).catch(() => {});
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-md p-5">
      <h3 className="text-white font-bold mb-1">Image Upload</h3>
      <p className="text-[#555] text-xs mb-4">Auto-resized to max 1920px, converted to WebP (&lt;2MB). Public URL copied to clipboard on upload.</p>

      <label className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-bold cursor-pointer transition-colors",
        uploading ? "bg-[#333] text-[#555] cursor-not-allowed" : "bg-[#E50914] hover:bg-[#f40d1a] text-white"
      )}>
        <Upload size={14} />
        {uploading ? "Uploading…" : "Choose Image"}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      {lastUrl && (
        <div className="mt-3 flex items-center gap-2">
          <input readOnly value={lastUrl} className={cn(inputClass, "text-xs font-mono")} onClick={(e) => (e.target as HTMLInputElement).select()} />
          <button onClick={() => { navigator.clipboard.writeText(lastUrl); toast.success("Copied!"); }} className="p-2 text-[#555] hover:text-white transition-colors flex-shrink-0">
            <Plus size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Settings Editor ──────────────────────────────────────────────────────────

const DEFAULT_KEYS = [
  { key: "footer_tagline", label: "Footer Tagline", placeholder: "Full Stack Developer · Building the web, one component at a time" },
  { key: "hero_title_recruiter", label: "Hero Title (Recruiter)", placeholder: "Full Stack Developer" },
  { key: "hero_title_developer", label: "Hero Title (Developer)", placeholder: "Builder of Things" },
  { key: "hero_title_stalker", label: "Hero Title (Stalker)", placeholder: "Code Monkey" },
  { key: "hero_title_adventurer", label: "Hero Title (Adventurer)", placeholder: "Quest Seeker" },
];

function SettingRow({ settingKey, label, placeholder, currentValue }: {
  settingKey: string; label: string; placeholder: string; currentValue: string;
}) {
  const [value, setValue] = useState(currentValue);
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      try { await upsertSiteSetting(settingKey, { value }); toast.success("Saved"); }
      catch (err) { toast.error(err instanceof Error ? err.message : "Error"); }
    });
  }

  return (
    <div>
      <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex gap-2">
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} className={cn(inputClass, "flex-1")} />
        <button onClick={save} disabled={isPending || value === currentValue} className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-40 text-white font-bold text-sm rounded-sm transition-colors flex-shrink-0">
          <Save size={14} /> {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

export function SettingsClient({ initialSettings }: { initialSettings: Array<{ key: string; value: Record<string, unknown> }> }) {
  const settingMap = Object.fromEntries(initialSettings.map((s) => [s.key, String(s.value?.value ?? "")]));

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest mb-6">Site Settings</h2>
        <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-md p-5 space-y-5">
          {DEFAULT_KEYS.map(({ key, label, placeholder }) => (
            <SettingRow key={key} settingKey={key} label={label} placeholder={placeholder} currentValue={settingMap[key] ?? ""} />
          ))}
        </div>
      </div>
      <ImageUpload />
    </div>
  );
}
