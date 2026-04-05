"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import type { HomepageCard, Project } from "@/lib/types/database";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  createHomepageCard,
  updateHomepageCard,
  deleteHomepageCard,
  reorderHomepageCards,
  setHomepageProjectPicks,
} from "@/lib/actions/admin";

const inputClass =
  "w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-3 py-2 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors";
const btnClass =
  "px-4 py-2 rounded-sm text-sm font-medium transition-colors";
const LINK_TYPES = [
  { value: "skills", label: "Skills" },
  { value: "certifications", label: "Certifications" },
  { value: "experience", label: "Experience" },
  { value: "about", label: "About" },
  { value: "contact", label: "Contact" },
  { value: "projects", label: "Projects" },
  { value: "other", label: "Other (custom URL)" },
] as const;

const SECTIONS = [
  { value: "continue_watching" as const, label: "Continue Watching", maxSlots: 3 },
  { value: "top_picks" as const, label: "Top Picks for You", maxSlots: 4 },
] as const;

function resolveLink(linkType: string, linkUrl: string, profileType: ProfileType): string {
  if (linkType === "other") return linkUrl;
  return `/${profileType}/${linkType === "about" ? "about" : linkType}`;
}

interface HomepageClientProps {
  initialCards: HomepageCard[];
  allProjects: Project[];
  initialPicks: Array<{ id: string; profile_type: string; project_id: string; display_order: number }>;
}

export function HomepageClient({ initialCards, allProjects, initialPicks }: HomepageClientProps) {
  const [activeProfile, setActiveProfile] = useState<ProfileType>("recruiter");
  const [cards, setCards] = useState(initialCards);
  const [picks, setPicks] = useState(initialPicks);
  const [isPending, startTransition] = useTransition();

  // ─── Filtered data per profile ────────────────────────────────────
  const profileCards = (section: "continue_watching" | "top_picks") =>
    cards
      .filter((c) => c.profile_type === activeProfile && c.section === section)
      .sort((a, b) => a.display_order - b.display_order);

  const profilePicks = picks
    .filter((p) => p.profile_type === activeProfile)
    .sort((a, b) => a.display_order - b.display_order);

  const selectedProjectIds = new Set(profilePicks.map((p) => p.project_id));

  // ─── Card CRUD ────────────────────────────────────────────────────

  function handleAddCard(section: "continue_watching" | "top_picks") {
    const existing = profileCards(section);
    const maxSlots = section === "continue_watching" ? 3 : 4;
    if (existing.length >= maxSlots) {
      toast.error(`Maximum ${maxSlots} cards for ${section === "continue_watching" ? "Continue Watching" : "Top Picks"}`);
      return;
    }
    startTransition(async () => {
      try {
        await createHomepageCard({
          profile_type: activeProfile,
          section,
          title: "New Card",
          subtitle: "",
          image_url: "",
          link_type: "about",
          link_url: resolveLink("about", "", activeProfile),
          display_order: existing.length,
        });
        toast.success("Card added");
        window.location.reload();
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  function handleSaveCard(card: HomepageCard) {
    startTransition(async () => {
      try {
        const url = card.link_type === "other" ? card.link_url : resolveLink(card.link_type, card.link_url, activeProfile);
        await updateHomepageCard(card.id, {
          title: card.title,
          subtitle: card.subtitle ?? "",
          image_url: card.image_url ?? "",
          link_type: card.link_type,
          link_url: url,
        });
        toast.success("Card saved");
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  function handleDeleteCard(id: string) {
    startTransition(async () => {
      try {
        await deleteHomepageCard(id);
        setCards((prev) => prev.filter((c) => c.id !== id));
        toast.success("Card deleted");
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  function handleMoveCard(section: "continue_watching" | "top_picks", fromIdx: number, dir: -1 | 1) {
    const sectionCards = profileCards(section);
    const toIdx = fromIdx + dir;
    if (toIdx < 0 || toIdx >= sectionCards.length) return;

    const reordered = [...sectionCards];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    // Update local state
    const ids = reordered.map((c) => c.id);
    setCards((prev) => {
      const others = prev.filter((c) => !(c.profile_type === activeProfile && c.section === section));
      const updated = reordered.map((c, i) => ({ ...c, display_order: i }));
      return [...others, ...updated];
    });

    startTransition(async () => {
      try {
        await reorderHomepageCards(ids);
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  function updateCardLocal(id: string, patch: Partial<HomepageCard>) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  // ─── Project Picks ────────────────────────────────────────────────

  function handleToggleProject(projectId: string) {
    const current = profilePicks.map((p) => p.project_id);
    let next: string[];
    if (current.includes(projectId)) {
      next = current.filter((id) => id !== projectId);
    } else {
      if (current.length >= 4) {
        toast.error("Maximum 4 projects");
        return;
      }
      next = [...current, projectId];
    }
    // Optimistic update
    setPicks((prev) => {
      const others = prev.filter((p) => p.profile_type !== activeProfile);
      const newPicks = next.map((pid, i) => ({
        id: `temp-${pid}`,
        profile_type: activeProfile,
        project_id: pid,
        display_order: i,
      }));
      return [...others, ...newPicks];
    });
    startTransition(async () => {
      try {
        await setHomepageProjectPicks(activeProfile, next);
        toast.success("Project picks updated");
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  function handleMoveProject(fromIdx: number, dir: -1 | 1) {
    const toIdx = fromIdx + dir;
    if (toIdx < 0 || toIdx >= profilePicks.length) return;
    const reordered = [...profilePicks];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    const ids = reordered.map((p) => p.project_id);
    setPicks((prev) => {
      const others = prev.filter((p) => p.profile_type !== activeProfile);
      const updated = reordered.map((p, i) => ({ ...p, display_order: i }));
      return [...others, ...updated];
    });
    startTransition(async () => {
      try {
        await setHomepageProjectPicks(activeProfile, ids);
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  // ─── Render ───────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Homepage</h1>
      </div>

      {/* Profile Tabs */}
      <div className="flex gap-2">
        {PROFILE_TYPES.map((pt) => (
          <button
            key={pt}
            onClick={() => setActiveProfile(pt)}
            className={`${btnClass} capitalize ${
              activeProfile === pt
                ? "bg-[#E50914] text-white"
                : "bg-[#232323] text-[#808080] hover:text-white"
            }`}
          >
            {pt}
          </button>
        ))}
      </div>

      {/* Sections */}
      {SECTIONS.map(({ value: section, label, maxSlots }) => (
        <SectionEditor
          key={`${activeProfile}-${section}`}
          label={label}
          section={section}
          maxSlots={maxSlots}
          cards={profileCards(section)}
          isPending={isPending}
          onAdd={() => handleAddCard(section)}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
          onMove={(idx, dir) => handleMoveCard(section, idx, dir)}
          onUpdateLocal={updateCardLocal}
        />
      ))}

      {/* Project Picks */}
      <div className="bg-[#1a1a1a] rounded-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Projects (select up to 4)</h2>
          <span className="text-sm text-[#808080]">{profilePicks.length}/4 selected</span>
        </div>

        {/* Selected picks — reorderable */}
        {profilePicks.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs text-[#808080] uppercase tracking-wider">Selected order</p>
            {profilePicks.map((pick, idx) => {
              const proj = allProjects.find((p) => p.id === pick.project_id);
              return (
                <div key={pick.project_id} className="flex items-center gap-3 bg-[#232323] px-3 py-2 rounded-sm">
                  <GripVertical size={14} className="text-[#555]" />
                  <span className="text-sm text-white flex-1">{proj?.title ?? pick.project_id}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleMoveProject(idx, -1)}
                      disabled={idx === 0}
                      className="text-xs px-2 py-1 text-[#808080] hover:text-white disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveProject(idx, 1)}
                      disabled={idx === profilePicks.length - 1}
                      className="text-xs px-2 py-1 text-[#808080] hover:text-white disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    onClick={() => handleToggleProject(pick.project_id)}
                    className="text-xs px-2 py-1 text-[#E50914] hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* All projects grid */}
        <div className="grid grid-cols-2 gap-2">
          {allProjects.map((project) => {
            const isSelected = selectedProjectIds.has(project.id);
            return (
              <button
                key={project.id}
                onClick={() => handleToggleProject(project.id)}
                disabled={isPending}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-[rgba(229,9,20,0.15)] text-[#E50914] border border-[#E50914]/30"
                    : "bg-[#232323] text-[#808080] hover:text-white hover:bg-[#2a2a2a]"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "border-[#E50914] bg-[#E50914]" : "border-[#555]"
                  }`}
                >
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </span>
                <span className="truncate">{project.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Section Editor (Continue Watching / Top Picks) ─────────────────────────

function SectionEditor({
  label,
  section,
  maxSlots,
  cards,
  isPending,
  onAdd,
  onSave,
  onDelete,
  onMove,
  onUpdateLocal,
}: {
  label: string;
  section: string;
  maxSlots: number;
  cards: HomepageCard[];
  isPending: boolean;
  onAdd: () => void;
  onSave: (card: HomepageCard) => void;
  onDelete: (id: string) => void;
  onMove: (idx: number, dir: -1 | 1) => void;
  onUpdateLocal: (id: string, patch: Partial<HomepageCard>) => void;
}) {
  return (
    <div className="bg-[#1a1a1a] rounded-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">{label}</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#808080]">{cards.length}/{maxSlots} slots</span>
          <button
            onClick={onAdd}
            disabled={isPending || cards.length >= maxSlots}
            className={`${btnClass} bg-[#E50914] text-white hover:bg-[#B20710] disabled:opacity-50 flex items-center gap-1.5`}
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {cards.length === 0 && (
        <p className="text-sm text-[#555] text-center py-8">
          No cards yet. Click &quot;Add&quot; to create one.
        </p>
      )}

      {cards.map((card, idx) => (
        <CardEditor
          key={card.id}
          card={card}
          index={idx}
          total={cards.length}
          isPending={isPending}
          onSave={() => onSave(card)}
          onDelete={() => onDelete(card.id)}
          onMoveUp={() => onMove(idx, -1)}
          onMoveDown={() => onMove(idx, 1)}
          onUpdate={(patch) => onUpdateLocal(card.id, patch)}
        />
      ))}
    </div>
  );
}

// ─── Card Editor ────────────────────────────────────────────────────────────

function CardEditor({
  card,
  index,
  total,
  isPending,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
  onUpdate,
}: {
  card: HomepageCard;
  index: number;
  total: number;
  isPending: boolean;
  onSave: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdate: (patch: Partial<HomepageCard>) => void;
}) {
  return (
    <div className="bg-[#232323] rounded-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-0.5">
          <button onClick={onMoveUp} disabled={index === 0} className="text-[#555] hover:text-white disabled:opacity-30 text-xs">↑</button>
          <button onClick={onMoveDown} disabled={index === total - 1} className="text-[#555] hover:text-white disabled:opacity-30 text-xs">↓</button>
        </div>
        <span className="text-xs text-[#555] font-mono w-6">#{index + 1}</span>
        <input
          className={`${inputClass} flex-1`}
          placeholder="Title"
          value={card.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
        <button
          onClick={onSave}
          disabled={isPending}
          className="p-2 text-[#808080] hover:text-green-400 transition-colors"
          title="Save"
        >
          <Save size={16} />
        </button>
        <button
          onClick={onDelete}
          disabled={isPending}
          className="p-2 text-[#808080] hover:text-[#E50914] transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[#808080] mb-1 block">Subtitle</label>
          <input
            className={inputClass}
            placeholder="Subtitle"
            value={card.subtitle ?? ""}
            onChange={(e) => onUpdate({ subtitle: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-[#808080] mb-1 block">Page Link</label>
          <select
            className={inputClass}
            value={card.link_type}
            onChange={(e) => onUpdate({ link_type: e.target.value as HomepageCard["link_type"] })}
          >
            {LINK_TYPES.map((lt) => (
              <option key={lt.value} value={lt.value}>{lt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {card.link_type === "other" && (
        <div>
          <label className="text-xs text-[#808080] mb-1 block">Custom URL</label>
          <input
            className={inputClass}
            placeholder="https://..."
            value={card.link_url}
            onChange={(e) => onUpdate({ link_url: e.target.value })}
          />
        </div>
      )}

      <ImageUploadField
        label="Card Image"
        value={card.image_url ?? ""}
        onChange={(url) => onUpdate({ image_url: url })}
      />
    </div>
  );
}
