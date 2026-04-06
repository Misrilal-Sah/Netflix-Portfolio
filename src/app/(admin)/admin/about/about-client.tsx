"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { openConfirm } from "@/components/ui/confirm-dialog";
import { Pencil, X, Check, Plus, Trash2, ChevronDown, ChevronRight, Save } from "lucide-react";
import type { AboutSection, Skill } from "@/lib/types/database";
import { updateAboutSkillsConfig, upsertAboutHero, upsertAboutBio, upsertAboutSectionVariant } from "@/lib/actions/admin";
import { SortableList } from "@/components/admin/sortable-list";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { cn } from "@/lib/utils";
import type { AboutSkillsConfig, AboutHero } from "@/lib/data/about";
import type { ProfileType } from "@/lib/constants";

const inputClass = "w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-3 py-2 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors";

// ─── Hero Editor ──────────────────────────────────────────────────────────────

const PROFILES: ProfileType[] = ["recruiter", "developer", "stalker", "adventurer"];
const PROFILE_COLORS: Record<ProfileType, string> = {
  recruiter: "#3b82f6",
  developer: "#22c55e",
  stalker: "#a855f7",
  adventurer: "#f59e0b",
};

function HeroEditor({
  initialHero,
  initialBios,
}: {
  initialHero: AboutHero;
  initialBios: Record<ProfileType, string>;
}) {
  const [imageUrl, setImageUrl] = useState(initialHero.image_url);
  const [stats, setStats] = useState<Array<{ value: string; label: string }>>(initialHero.stats);
  const [bios, setBios] = useState<Record<ProfileType, string>>(initialBios);
  const [activeProfile, setActiveProfile] = useState<ProfileType>("recruiter");
  const [isSavingHero, startHeroTransition] = useTransition();
  const [isSavingBio, startBioTransition] = useTransition();

  function updateStat(index: number, field: "value" | "label", val: string) {
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
  }

  function saveHero() {
    startHeroTransition(async () => {
      try {
        await upsertAboutHero({ image_url: imageUrl, stats });
        toast.success("Hero saved");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  function saveBio(profile: ProfileType) {
    startBioTransition(async () => {
      try {
        await upsertAboutBio(profile, bios[profile]);
        toast.success(`Bio saved for ${profile}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Image + Stats */}
      <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-md p-5 space-y-5">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider">Profile Image &amp; Stats</h3>

        {/* Image upload */}
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-3">Profile Photo</label>
          <div className="flex items-start gap-4">
            {imageUrl && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-[rgba(255,255,255,0.1)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <ImageUploadField
                label="Profile Image"
                value={imageUrl}
                onChange={setImageUrl}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div>
          <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-3">Stats Blocks</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-md p-3 space-y-2">
                <div>
                  <label className="block text-[#555] text-xs mb-1">Value</label>
                  <input
                    value={stat.value}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 2+"
                  />
                </div>
                <div>
                  <label className="block text-[#555] text-xs mb-1">Label</label>
                  <input
                    value={stat.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Years Experience"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={saveHero}
          disabled={isSavingHero}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-50 text-white font-bold text-sm rounded-sm transition-colors"
        >
          <Save size={14} /> {isSavingHero ? "Saving…" : "Save Image & Stats"}
        </button>
      </div>

      {/* Bio per profile */}
      <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-md p-5">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Profile Bio</h3>
        <p className="text-[#555] text-xs mb-4">The bio shown in the hero card on the About page. Each persona has its own copy.</p>

        {/* Profile tabs */}
        <div className="flex gap-1 mb-4 border-b border-[rgba(255,255,255,0.08)]">
          {PROFILES.map((p) => (
            <button
              key={p}
              onClick={() => setActiveProfile(p)}
              className={cn(
                "px-3 py-2 text-xs font-bold capitalize transition-colors border-b-2 -mb-px",
                activeProfile === p ? "text-white border-current" : "text-[#555] border-transparent hover:text-[#808080]"
              )}
              style={activeProfile === p ? { color: PROFILE_COLORS[p], borderColor: PROFILE_COLORS[p] } : {}}
            >
              {p}
            </button>
          ))}
        </div>

        <textarea
          rows={6}
          value={bios[activeProfile]}
          onChange={(e) => setBios((prev) => ({ ...prev, [activeProfile]: e.target.value }))}
          className={cn(inputClass, "resize-y")}
          placeholder={`Bio for ${activeProfile} persona…`}
        />
        <button
          onClick={() => saveBio(activeProfile)}
          disabled={isSavingBio}
          className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-50 text-white font-bold text-sm rounded-sm transition-colors"
        >
          <Save size={14} /> {isSavingBio ? "Saving…" : `Save ${activeProfile} bio`}
        </button>
      </div>
    </div>
  );
}



type SectionVariants = Record<ProfileType, { title: string; content: string }>;

function SectionEditor({
  section,
  initialVariants,
  onDone,
}: {
  section: AboutSection;
  initialVariants: SectionVariants;
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [activeProfile, setActiveProfile] = useState<ProfileType>("recruiter");
  const [variants, setVariants] = useState<SectionVariants>(initialVariants);

  function updateVariant(profile: ProfileType, field: "title" | "content", val: string) {
    setVariants((prev) => ({
      ...prev,
      [profile]: { ...prev[profile], [field]: val },
    }));
  }

  function saveVariant(profile: ProfileType) {
    startTransition(async () => {
      try {
        await upsertAboutSectionVariant(section.section_key, profile, variants[profile]);
        toast.success(`Saved for ${profile}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  return (
    <div className="mt-3 space-y-3">
      {/* Profile tabs */}
      <div className="flex gap-1 border-b border-[rgba(255,255,255,0.08)]">
        {PROFILES.map((p) => (
          <button
            key={p}
            onClick={() => setActiveProfile(p)}
            className={cn(
              "px-3 py-2 text-xs font-bold capitalize transition-colors border-b-2 -mb-px",
              activeProfile === p ? "text-white border-current" : "text-[#555] border-transparent hover:text-[#808080]"
            )}
            style={activeProfile === p ? { color: PROFILE_COLORS[p], borderColor: PROFILE_COLORS[p] } : {}}
          >
            {p}
          </button>
        ))}
      </div>
      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Title</label>
        <input
          value={variants[activeProfile].title}
          onChange={(e) => updateVariant(activeProfile, "title", e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-[#808080] text-xs font-bold uppercase tracking-wider mb-1.5">Content</label>
        <textarea
          value={variants[activeProfile].content}
          onChange={(e) => updateVariant(activeProfile, "content", e.target.value)}
          rows={5}
          className={cn(inputClass, "resize-y")}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => saveVariant(activeProfile)}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#f40d1a] disabled:opacity-50 text-white font-bold text-sm rounded-sm transition-colors"
        >
          <Check size={14} /> {isPending ? "Saving…" : `Save ${activeProfile}`}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-[#808080] font-bold text-sm rounded-sm border border-[rgba(255,255,255,0.1)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── About Skills Manager ─────────────────────────────────────────────────────

function AboutSkillsManager({
  initialConfig,
  allSkills,
}: {
  initialConfig: AboutSkillsConfig;
  allSkills: Skill[];
}) {
  const [config, setConfig] = useState<AboutSkillsConfig>(initialConfig);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  // All skill names available (from skills table)
  const availableNames = allSkills.map((s) => s.name);

  async function save(next: AboutSkillsConfig) {
    setConfig(next);
    startTransition(async () => {
      try {
        await updateAboutSkillsConfig(next);
        toast.success("About skills saved");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  async function handleCategoryReorder(ids: string[]) {
    await save({ ...config, categoryOrder: ids });
  }

  async function handleSkillReorder(cat: string, ids: string[]) {
    const next = {
      ...config,
      skillsByCategory: { ...config.skillsByCategory, [cat]: ids },
    };
    await save(next);
  }

  function removeSkill(cat: string, name: string) {
    const next = {
      ...config,
      skillsByCategory: {
        ...config.skillsByCategory,
        [cat]: config.skillsByCategory[cat].filter((s) => s !== name),
      },
    };
    save(next);
  }

  function addSkill(cat: string, name: string) {
    if (!name.trim() || config.skillsByCategory[cat]?.includes(name)) return;
    const next = {
      ...config,
      skillsByCategory: {
        ...config.skillsByCategory,
        [cat]: [...(config.skillsByCategory[cat] ?? []), name],
      },
    };
    save(next);
    setAddingTo(null);
  }

  function addCategory() {
    const name = newCategoryName.trim();
    if (!name || config.categoryOrder.includes(name)) return;
    const next = {
      categoryOrder: [...config.categoryOrder, name],
      skillsByCategory: { ...config.skillsByCategory, [name]: [] },
    };
    save(next);
    setNewCategoryName("");
    setShowCategoryInput(false);
  }

  async function removeCategory(cat: string) {
    const ok = await openConfirm(`"${cat}" and all its skills will be removed from the About page.`, { title: `Remove "${cat}"?`, confirmLabel: "Remove", danger: false });
    if (!ok) return;
    const { [cat]: _, ...rest } = config.skillsByCategory;
    const next = {
      categoryOrder: config.categoryOrder.filter((c) => c !== cat),
      skillsByCategory: rest,
    };
    save(next);
  }

  const categoryItems = config.categoryOrder.map((c) => ({ id: c }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#555] text-xs">
          Drag <span className="text-[#808080]">≡</span> handles to reorder. Changes auto-save.
          {isPending && <span className="text-[#E50914] ml-2">Saving…</span>}
        </p>
        <button
          onClick={() => setShowCategoryInput(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#222] text-[#808080] text-xs font-bold rounded-sm border border-[rgba(255,255,255,0.1)] transition-colors"
        >
          <Plus size={12} /> Add Category
        </button>
      </div>

      {showCategoryInput && (
        <div className="flex gap-2 mb-4">
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="Category name (e.g. AI / ML)"
            className={inputClass}
            autoFocus
          />
          <button onClick={addCategory} className="px-3 py-1.5 bg-[#E50914] text-white text-sm font-bold rounded-sm flex-shrink-0">Add</button>
          <button onClick={() => { setShowCategoryInput(false); setNewCategoryName(""); }} className="px-3 py-1.5 bg-[#1a1a1a] text-[#808080] text-sm rounded-sm border border-[rgba(255,255,255,0.1)] flex-shrink-0"><X size={14} /></button>
        </div>
      )}

      <SortableList
        listId="about-categories"
        items={categoryItems}
        onReorder={handleCategoryReorder}
        renderItem={(catItem) => {
          const cat = catItem.id;
          const skills = config.skillsByCategory[cat] ?? [];
          const isCollapsed = collapsed[cat];
          const skillItems = skills.map((s) => ({ id: s }));

          return (
            <div className="bg-[#111] border border-[rgba(255,255,255,0.08)] rounded-md overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#161616]">
                <button
                  onClick={() => setCollapsed((p) => ({ ...p, [cat]: !p[cat] }))}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  {isCollapsed ? <ChevronRight size={13} className="text-[#555]" /> : <ChevronDown size={13} className="text-[#555]" />}
                  <span className="text-[#E50914] font-bold text-sm uppercase tracking-wide">{cat}</span>
                  <span className="text-[#555] text-xs">({skills.length})</span>
                </button>
                <button onClick={() => removeCategory(cat)} className="p-1 text-[#555] hover:text-[#E50914] transition-colors ml-2"><Trash2 size={13} /></button>
              </div>

              {!isCollapsed && (
                <div className="p-3 space-y-2">
                  <SortableList
                    listId={`about-skills-${cat}`}
                    items={skillItems}
                    onReorder={(ids) => handleSkillReorder(cat, ids)}
                    renderItem={(item) => (
                      <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[rgba(255,255,255,0.06)] rounded-sm px-3 py-2">
                        <span className="text-white text-sm flex-1">{item.id}</span>
                        <button onClick={() => removeSkill(cat, item.id)} className="text-[#555] hover:text-[#E50914] transition-colors"><X size={13} /></button>
                      </div>
                    )}
                  />
                  {/* Add skill dropdown */}
                  {addingTo === cat ? (
                    <div className="flex gap-2 mt-1">
                      <select
                        defaultValue=""
                        onChange={(e) => { if (e.target.value) { addSkill(cat, e.target.value); } }}
                        className="flex-1 bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-2 py-1.5 text-white text-sm focus:outline-none"
                      >
                        <option value="" disabled>Select a skill…</option>
                        {availableNames
                          .filter((n) => !skills.includes(n))
                          .map((n) => <option key={n} value={n}>{n}</option>)
                        }
                      </select>
                      <button onClick={() => setAddingTo(null)} className="text-[#555] hover:text-white px-2"><X size={14} /></button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingTo(cat)}
                      className="flex items-center gap-1.5 text-[#555] hover:text-white text-xs transition-colors mt-1"
                    >
                      <Plus size={12} /> Add skill
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        }}
      />

      {config.categoryOrder.length === 0 && (
        <div className="text-center py-10 text-[#555] text-sm">No categories. Add one above.</div>
      )}
    </div>
  );
}

// ─── Main AboutClient ─────────────────────────────────────────────────────────

export function AboutClient({
  initialSections,
  initialSkillsConfig,
  allSkills,
  initialHero,
  initialBios,
  initialSectionVariants,
}: {
  initialSections: AboutSection[];
  initialSkillsConfig: AboutSkillsConfig;
  allSkills: Skill[];
  initialHero: AboutHero;
  initialBios: Record<ProfileType, string>;
  initialSectionVariants: Record<string, SectionVariants>;
}) {
  const [sections] = useState(initialSections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"hero" | "content" | "skills">("hero");

  // Build fallback variants for sections that have no DB variants yet
  function getVariantsForSection(section: AboutSection): SectionVariants {
    const db = initialSectionVariants[section.section_key];
    if (db) {
      // Fill any missing profile slots with the global section default
      return (["recruiter", "developer", "stalker", "adventurer"] as ProfileType[]).reduce(
        (acc, p) => ({
          ...acc,
          [p]: db[p]?.title
            ? db[p]
            : { title: section.title, content: section.content ?? "" },
        }),
        {} as SectionVariants
      );
    }
    return {
      recruiter: { title: section.title, content: section.content ?? "" },
      developer: { title: section.title, content: section.content ?? "" },
      stalker: { title: section.title, content: section.content ?? "" },
      adventurer: { title: section.title, content: section.content ?? "" },
    };
  }

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 border-b border-[rgba(255,255,255,0.08)]">
        {(["hero", "content", "skills"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-sm font-bold capitalize transition-colors border-b-2 -mb-px",
              tab === t
                ? "text-white border-[#E50914]"
                : "text-[#555] border-transparent hover:text-[#808080]"
            )}
          >
            {t === "hero" ? "Hero Section" : t === "content" ? "About Sections" : "Skills (About Page)"}
          </button>
        ))}
      </div>

      {tab === "hero" && (
        <HeroEditor initialHero={initialHero} initialBios={initialBios} />
      )}

      {tab === "content" && (
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
                <SectionEditor
                  section={section}
                  initialVariants={getVariantsForSection(section)}
                  onDone={() => setEditingId(null)}
                />
              ) : (
                <p className="mt-3 text-[#808080] text-sm leading-relaxed">
                  {section.content ?? <span className="text-[#444] italic">No content</span>}
                </p>
              )}
            </div>
          ))}
          {sections.length === 0 && (
            <div className="text-center py-16 text-[#555] text-sm">No about sections yet.</div>
          )}
        </div>
      )}

      {tab === "skills" && (
        <AboutSkillsManager initialConfig={initialSkillsConfig} allSkills={allSkills} />
      )}
    </div>
  );
}

