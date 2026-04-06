import type { ProfileType } from "@/lib/constants";
import { getDataClient } from "@/lib/supabase/data-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BasicPageCopy = {
  title: string;
  subtitle: string;
};

export type ProjectsPageCopy = {
  title: string;
  subtitle: string;
  allLabel: string;
};

export type ContactPageCopy = {
  title: string;
  subtitle: string;
  namePlaceholder: string;
  msgPlaceholder: string;
};

export type PageCopyMap<T> = Record<ProfileType, T>;

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_EXPERIENCE_COPY: PageCopyMap<BasicPageCopy> = {
  recruiter: {
    title: "Work Experience",
    subtitle: "My professional journey and educational background.",
  },
  developer: {
    title: "Career Timeline",
    subtitle: "Where I shipped code and what I built.",
  },
  stalker: {
    title: "The Resume",
    subtitle: "Yes, this is basically my CV. You're welcome.",
  },
  adventurer: {
    title: "Guild History",
    subtitle: "Every guild I've joined and the raids I've completed.",
  },
};

export const DEFAULT_ABOUT_COPY: PageCopyMap<BasicPageCopy> = {
  recruiter: {
    title: "Candidate Summary",
    subtitle: "Background, experience, and what I bring to a team.",
  },
  developer: {
    title: "README.md",
    subtitle: "The architecture of a developer — design decisions included.",
  },
  stalker: {
    title: "The Real Me",
    subtitle: "You chose Stalker. Here's the unfiltered version.",
  },
  adventurer: {
    title: "The Lore",
    subtitle: "Origins, class traits, side quests, and final boss status.",
  },
};

export const DEFAULT_SKILLS_COPY: PageCopyMap<BasicPageCopy> = {
  recruiter: {
    title: "Core Competencies",
    subtitle: "Technologies in active production use — no padding.",
  },
  developer: {
    title: "Tech Inventory",
    subtitle: "The full stack, honestly rated. Click any to know how deep.",
  },
  stalker: {
    title: "What I Actually Know",
    subtitle: 'No fluff. No "familiar with". This is real.',
  },
  adventurer: {
    title: "Unlocked Abilities",
    subtitle: "Skills forged through quests, side projects, and late nights.",
  },
};

export const DEFAULT_CERTIFICATIONS_COPY: PageCopyMap<BasicPageCopy> = {
  recruiter: {
    title: "Credentials & Training",
    subtitle: "Validated skills with official recognition.",
  },
  developer: {
    title: "Certs & Courses",
    subtitle:
      "Formal training alongside the self-taught grind — because both matter.",
  },
  stalker: {
    title: "Paper Trail",
    subtitle: "The receipts. Every single one.",
  },
  adventurer: {
    title: "Achievement Unlocked",
    subtitle: "Rare drops from the learning dungeon.",
  },
};

export const DEFAULT_PROJECTS_COPY: PageCopyMap<ProjectsPageCopy> = {
  recruiter: {
    title: "Shipped Work",
    subtitle:
      "Production applications delivered across frontend, backend, and AI.",
    allLabel: "All Projects",
  },
  developer: {
    title: "GitHub Timeline",
    subtitle: "Repositories, architectures, and build decisions.",
    allLabel: "All Repos",
  },
  stalker: {
    title: "The Build Log",
    subtitle: "Everything I've made — warts and all.",
    allLabel: "All Builds",
  },
  adventurer: {
    title: "Completed Quests",
    subtitle: "Every project: an adventure with a final boss.",
    allLabel: "All Quests",
  },
};

export const DEFAULT_CONTACT_COPY: PageCopyMap<ContactPageCopy> = {
  recruiter: {
    title: "Get In Touch",
    subtitle:
      "Interested in working together? I respond promptly to professional inquiries.",
    namePlaceholder: "Your Name / Company",
    msgPlaceholder: "Tell me about the role or project...",
  },
  developer: {
    title: "Open An Issue",
    subtitle:
      "Bug reports, feature requests, collab proposals, or just a good tech discussion.",
    namePlaceholder: "Your handle or name",
    msgPlaceholder: "What's on your mind? Code, ideas, anything...",
  },
  stalker: {
    title: "Slide Into My Inbox",
    subtitle: "Go ahead. I'm literally right here.",
    namePlaceholder: "Name (or alias, I'm not judging)",
    msgPlaceholder: "Say whatever you were going to say...",
  },
  adventurer: {
    title: "Send A Raven",
    subtitle: "Got a quest to propose? A dungeon to raid? I'm listening.",
    namePlaceholder: "Adventurer name",
    msgPlaceholder: "Describe the quest...",
  },
};

// ─── Generic fetcher ──────────────────────────────────────────────────────────

async function fetchPageCopy<T extends Record<string, unknown>>(
  settingsKey: string,
  defaults: PageCopyMap<T>
): Promise<PageCopyMap<T>> {
  const db = getDataClient();
  if (!db) return defaults;

  const { data } = await db
    .from("site_settings")
    .select("value")
    .eq("key", settingsKey)
    .maybeSingle();

  if (!data?.value || typeof data.value !== "object") return defaults;

  const stored = data.value as Record<string, Record<string, unknown>>;
  const result = { ...defaults };

  for (const profile of Object.keys(defaults) as ProfileType[]) {
    const dbProfile = stored[profile];
    if (dbProfile && typeof dbProfile === "object") {
      result[profile] = { ...defaults[profile], ...dbProfile } as T;
    }
  }

  return result;
}

// ─── Page-specific getters ─────────────────────────────────────────────────────

export async function getExperiencePageCopy() {
  return fetchPageCopy("page_copy_experience", DEFAULT_EXPERIENCE_COPY);
}

export async function getAboutPageCopy() {
  return fetchPageCopy("page_copy_about", DEFAULT_ABOUT_COPY);
}

export async function getSkillsPageCopy() {
  return fetchPageCopy("page_copy_skills", DEFAULT_SKILLS_COPY);
}

export async function getCertificationsPageCopy() {
  return fetchPageCopy("page_copy_certifications", DEFAULT_CERTIFICATIONS_COPY);
}

export async function getProjectsPageCopy() {
  return fetchPageCopy("page_copy_projects", DEFAULT_PROJECTS_COPY);
}

export async function getContactPageCopy() {
  return fetchPageCopy("page_copy_contact", DEFAULT_CONTACT_COPY);
}
