"use client";

import { useState, useTransition, useRef } from "react";
import { toast } from "sonner";
import { Plus, Save, Upload, X } from "lucide-react";
import { upsertSiteSetting, upsertHomepageHero, setResumeUrlAllProfiles } from "@/lib/actions/admin";
import { uploadImage } from "@/lib/actions/upload";
import { uploadResume } from "@/lib/actions/upload-resume";
import { cn } from "@/lib/utils";
import { ChatbotSyncButton } from "./ChatbotSyncButton";
import {
  DEFAULT_EXPERIENCE_COPY,
  DEFAULT_ABOUT_COPY,
  DEFAULT_SKILLS_COPY,
  DEFAULT_CERTIFICATIONS_COPY,
  DEFAULT_PROJECTS_COPY,
  DEFAULT_CONTACT_COPY,
} from "@/lib/data/page-copy";
import { DEFAULT_HOMEPAGE_HERO } from "@/lib/data/contact-info";
import type { HomepageHero } from "@/lib/data/contact-info";
import type { ProfileType } from "@/lib/constants";

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

function isGifFile(file: File): boolean {
  return file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
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
      let uploadFile: File;
      let filename: string;

      if (isGifFile(file)) {
        filename = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.gif`;
        uploadFile = new File([file], filename, { type: "image/gif" });
      } else {
        const blob = await resizeAndConvertToWebP(file);
        if (blob.size > 2 * 1024 * 1024) { toast.error("Resized image still exceeds 2MB"); setUploading(false); return; }
        filename = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.webp`;
        uploadFile = new File([blob], filename, { type: "image/webp" });
      }

      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("filename", filename);
      const publicUrl = await uploadImage(formData);
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
      <p className="text-[#555] text-xs mb-4">GIF uploads are preserved as animated GIF. Other images are auto-resized to max 1920px and converted to WebP (&lt;2MB). Public URL copied to clipboard on upload.</p>

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

// ─── Resume Upload ────────────────────────────────────────────────────────────

function ResumeUploadSection() {
  const [uploading, setUploading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("File too large (max 10MB)"); return; }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are supported"); return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const publicUrl = await uploadResume(formData);
      // Automatically save the URL to all profile hero records in the DB
      await setResumeUrlAllProfiles(publicUrl);
      setCurrentUrl(publicUrl);
      toast.success("Resume uploaded & saved! All profiles updated.");
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
      <h3 className="text-white font-bold mb-1">Resume Upload</h3>
      <p className="text-[#555] text-xs mb-4">
        Upload a PDF resume. The previous resume is auto-deleted to save storage space.
        After uploading, paste the URL into the Homepage Hero &quot;Resume URL&quot; field and save.
      </p>

      <label className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-bold cursor-pointer transition-colors",
        uploading ? "bg-[#333] text-[#555] cursor-not-allowed" : "bg-[#E50914] hover:bg-[#f40d1a] text-white"
      )}>
        <Upload size={14} />
        {uploading ? "Uploading…" : "Choose Resume (PDF)"}
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      {currentUrl && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded-sm px-3 py-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <input
              readOnly
              value={currentUrl}
              className={cn(inputClass, "text-xs font-mono flex-1")}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={() => { navigator.clipboard.writeText(currentUrl); toast.success("URL copied!"); }}
              className="p-2 text-[#555] hover:text-white transition-colors flex-shrink-0"
              title="Copy URL"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-[#444] text-[11px]">URL saved to all profiles automatically. Old resume deleted from storage.</p>
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

// ─── Persona Copy Section ─────────────────────────────────────────────────────

const PROFILES: ProfileType[] = ["recruiter", "developer", "stalker", "adventurer"];

const PROFILE_COLORS: Record<ProfileType, string> = {
  recruiter: "#3b82f6",
  developer: "#22c55e",
  stalker: "#a855f7",
  adventurer: "#f59e0b",
};

function PersonaCopySection({
  pageKey,
  pageLabel,
  fields,
  initialData,
}: {
  pageKey: string;
  pageLabel: string;
  fields: Array<{ key: string; label: string }>;
  initialData: Record<ProfileType, Record<string, string>>;
}) {
  const [data, setData] = useState<Record<ProfileType, Record<string, string>>>(initialData);
  const [isPending, startTransition] = useTransition();

  function handleChange(profile: ProfileType, field: string, value: string) {
    setData((prev) => ({
      ...prev,
      [profile]: { ...prev[profile], [field]: value },
    }));
  }

  function save() {
    startTransition(async () => {
      try {
        await upsertSiteSetting(pageKey, data as unknown as Record<string, unknown>);
        toast.success(`${pageLabel} copy saved`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error saving");
      }
    });
  }

  return (
    <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-md p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-bold">{pageLabel}</h3>
        <button
          onClick={save}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-40 text-white font-bold text-sm rounded-sm transition-colors"
        >
          <Save size={14} /> {isPending ? "Saving…" : "Save All"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROFILES.map((profile) => (
          <div
            key={profile}
            className="border border-[rgba(255,255,255,0.08)] rounded-md p-4 space-y-3"
          >
            <h4
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: PROFILE_COLORS[profile] }}
            >
              {profile}
            </h4>
            {fields.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-[#555] text-xs mb-1">{label}</label>
                <input
                  value={data[profile]?.[key] ?? ""}
                  onChange={(e) => handleChange(profile, key, e.target.value)}
                  placeholder={initialData[profile]?.[key] ?? ""}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Homepage Hero Section ────────────────────────────────────────────────────

function HomepageHeroSection({ initialHeroes }: { initialHeroes: Record<ProfileType, HomepageHero> }) {
  const [activeProfile, setActiveProfile] = useState<ProfileType>("recruiter");
  const [heroes, setHeroes] = useState<Record<ProfileType, HomepageHero>>(initialHeroes);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const hero = heroes[activeProfile];

  function update<K extends keyof HomepageHero>(field: K, value: HomepageHero[K]) {
    setHeroes((prev) => ({
      ...prev,
      [activeProfile]: { ...prev[activeProfile], [field]: value },
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("File too large (max 10MB)"); return; }
    setUploading(true);
    try {
      let uploadFile: File;
      let filename: string;

      if (isGifFile(file)) {
        filename = `hero-${activeProfile}-${Date.now()}.gif`;
        uploadFile = new File([file], filename, { type: "image/gif" });
      } else {
        const blob = await resizeAndConvertToWebP(file);
        filename = `hero-${activeProfile}-${Date.now()}.webp`;
        uploadFile = new File([blob], filename, { type: "image/webp" });
      }

      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("filename", filename);
      const publicUrl = await uploadImage(formData);
      update("image_url", publicUrl);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function save() {
    startTransition(async () => {
      try {
        await upsertHomepageHero(hero as unknown as Record<string, unknown>, activeProfile);
        toast.success(`Homepage hero saved for ${activeProfile}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error saving");
      }
    });
  }

  const profileColors: Record<ProfileType, string> = {
    recruiter: "#3b82f6",
    developer: "#22c55e",
    stalker: "#a855f7",
    adventurer: "#f59e0b",
  };

  return (
    <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-md p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold">Homepage Hero</h3>
        <button onClick={save} disabled={isPending} className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-40 text-white font-bold text-sm rounded-sm transition-colors">
          <Save size={14} /> {isPending ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Profile Tabs */}
      <div className="flex gap-2">
        {(["recruiter", "developer", "stalker", "adventurer"] as ProfileType[]).map((pt) => (
          <button
            key={pt}
            onClick={() => setActiveProfile(pt)}
            className={cn(
              "px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors capitalize",
              activeProfile === pt
                ? "text-white"
                : "text-[#555] hover:text-[#808080]"
            )}
            style={activeProfile === pt ? { backgroundColor: profileColors[pt] } : undefined}
          >
            {pt}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Title</label>
        <input value={hero.title} onChange={(e) => update("title", e.target.value)} placeholder="Your Name — Job Title" className={inputClass} />
      </div>

      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Description</label>
        <textarea value={hero.description} onChange={(e) => update("description", e.target.value)} rows={3} placeholder="Short bio shown on hero…" className={cn(inputClass, "resize-none")} />
      </div>

      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Hero Image</label>
        {hero.image_url && (
          <div className="relative w-32 h-20 mb-2 rounded-sm overflow-hidden border border-[rgba(255,255,255,0.1)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.image_url} alt="Hero preview" className="w-full h-full object-cover" />
            <button onClick={() => update("image_url", "")} className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 text-white hover:bg-black transition-colors">
              <X size={12} />
            </button>
          </div>
        )}
        <label className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-bold cursor-pointer transition-colors", uploading ? "bg-[#333] text-[#555]" : "bg-[#333] hover:bg-[#444] text-white")}>
          <Upload size={14} />
          {uploading ? "Uploading…" : "Choose Image"}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
        </label>
      </div>

      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">LinkedIn URL</label>
        <input value={hero.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/…" className={inputClass} />
      </div>
    </div>
  );
}

export function SettingsClient({ initialSettings, chatbotLastSynced }: { initialSettings: Array<{ key: string; value: Record<string, unknown> }>; chatbotLastSynced?: string | null }) {
  const settingMap = Object.fromEntries(initialSettings.map((s) => [s.key, String(s.value?.value ?? "")]));

  // Extract persona copy settings — keyed per page
  function getPageCopyInitial<T extends Record<string, string>>(
    settingsKey: string,
    defaults: Record<ProfileType, T>
  ): Record<ProfileType, T> {
    const stored = initialSettings.find((s) => s.key === settingsKey)?.value;
    if (!stored || typeof stored !== "object") return defaults;
    const storedMap = stored as Record<string, Record<string, string>>;
    return (["recruiter", "developer", "stalker", "adventurer"] as ProfileType[]).reduce(
      (acc, profile) => {
        acc[profile] = { ...defaults[profile], ...(storedMap[profile] ?? {}) } as T;
        return acc;
      },
      {} as Record<ProfileType, T>
    );
  }

  const experienceCopy = getPageCopyInitial("page_copy_experience", DEFAULT_EXPERIENCE_COPY);
  const aboutCopy = getPageCopyInitial("page_copy_about", DEFAULT_ABOUT_COPY);
  const skillsCopy = getPageCopyInitial("page_copy_skills", DEFAULT_SKILLS_COPY);
  const certsCopy = getPageCopyInitial("page_copy_certifications", DEFAULT_CERTIFICATIONS_COPY);
  const projectsCopy = getPageCopyInitial("page_copy_projects", DEFAULT_PROJECTS_COPY);
  const contactCopy = getPageCopyInitial("page_copy_contact", DEFAULT_CONTACT_COPY);

  const storedHeroShared = initialSettings.find((s) => s.key === "homepage_hero")?.value;
  const sharedHero: HomepageHero = { ...DEFAULT_HOMEPAGE_HERO, ...(typeof storedHeroShared === "object" && storedHeroShared ? storedHeroShared as Partial<HomepageHero> : {}) };

  const initialHeroes = (["recruiter", "developer", "stalker", "adventurer"] as ProfileType[]).reduce(
    (acc, profile) => {
      const stored = initialSettings.find((s) => s.key === `homepage_hero_${profile}`)?.value;
      acc[profile] = stored && typeof stored === "object"
        ? { ...DEFAULT_HOMEPAGE_HERO, ...(stored as Partial<HomepageHero>) }
        : { ...sharedHero };
      return acc;
    },
    {} as Record<ProfileType, HomepageHero>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest mb-6" style={{ textAlign: "center" }}>Site Settings</h2>
        {/* <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-md p-5 space-y-5">
          {DEFAULT_KEYS.map(({ key, label, placeholder }) => (
            <SettingRow key={key} settingKey={key} label={label} placeholder={placeholder} currentValue={settingMap[key] ?? ""} />
          ))}
        </div> */}
      </div>

      <div>
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest mb-6">Homepage Hero</h2>
        <HomepageHeroSection initialHeroes={initialHeroes} />
      </div>


      <div>
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest mb-6">Page Persona Copy</h2>
        <div className="space-y-6">
          <PersonaCopySection
            pageKey="page_copy_experience"
            pageLabel="Experience Page"
            fields={[
              { key: "title", label: "Title" },
              { key: "subtitle", label: "Subtitle" },
            ]}
            initialData={experienceCopy as Record<ProfileType, Record<string, string>>}
          />
          <PersonaCopySection
            pageKey="page_copy_about"
            pageLabel="About Page"
            fields={[
              { key: "title", label: "Title" },
              { key: "subtitle", label: "Subtitle" },
            ]}
            initialData={aboutCopy as Record<ProfileType, Record<string, string>>}
          />
          <PersonaCopySection
            pageKey="page_copy_skills"
            pageLabel="Skills Page"
            fields={[
              { key: "title", label: "Title" },
              { key: "subtitle", label: "Subtitle" },
            ]}
            initialData={skillsCopy as Record<ProfileType, Record<string, string>>}
          />
          <PersonaCopySection
            pageKey="page_copy_certifications"
            pageLabel="Certifications Page"
            fields={[
              { key: "title", label: "Title" },
              { key: "subtitle", label: "Subtitle" },
            ]}
            initialData={certsCopy as Record<ProfileType, Record<string, string>>}
          />
          <PersonaCopySection
            pageKey="page_copy_projects"
            pageLabel="Projects Page"
            fields={[
              { key: "title", label: "Title" },
              { key: "subtitle", label: "Subtitle" },
              { key: "allLabel", label: '"All" Button Label' },
            ]}
            initialData={projectsCopy as Record<ProfileType, Record<string, string>>}
          />
          <PersonaCopySection
            pageKey="page_copy_contact"
            pageLabel="Contact Page"
            fields={[
              { key: "title", label: "Title" },
              { key: "subtitle", label: "Subtitle" },
              { key: "namePlaceholder", label: "Name Placeholder" },
              { key: "msgPlaceholder", label: "Message Placeholder" },
            ]}
            initialData={contactCopy as Record<ProfileType, Record<string, string>>}
          />
        </div>
      </div>
      <ImageUpload />

      {/* ─── Resume Upload ─── */}
      <div>
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest mb-6">📄 Resume</h2>
        <ResumeUploadSection />
      </div>

      {/* ─── Chatbot Data Sync ─── */}
      <div>
        <h2 className="text-[#808080] text-sm font-bold uppercase tracking-widest mb-6">🤖 Chatbot Data</h2>
        <ChatbotSyncButton initialLastSynced={chatbotLastSynced ?? null} />
      </div>
    </div>
  );
}
