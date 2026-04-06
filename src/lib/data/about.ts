import type { AboutSection } from "@/lib/types/database";
import type { ProfileType } from "@/lib/constants";
import { getDataClient } from "@/lib/supabase/data-client";

export type AboutSkillsConfig = {
  categoryOrder: string[];
  skillsByCategory: Record<string, string[]>;
};

const defaultAboutSkillsConfig: AboutSkillsConfig = {
  categoryOrder: ["Frontend", "Backend", "Database", "DevOps", "Tools"],
  skillsByCategory: {
    Frontend: ["JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS", "HTML5 / CSS3", "Framer Motion"],
    Backend: ["Node.js", "Python", "PHP / Laravel", "FastAPI"],
    Database: ["PostgreSQL", "MySQL", "MongoDB", "Supabase"],
    DevOps: ["Docker", "Git / GitHub", "Vercel", "AWS"],
    Tools: ["VS Code", "Figma", "Postman"],
  },
};

const aboutSections: AboutSection[] = [
  {
    id: "a-001",
    section_key: "bio",
    title: "About Me",
    content:
      "I'm Misrilal Sah, a Full Stack Developer at Ciklum India with a passion for building clean, performant, and user-friendly web applications. I hold a B.E. in Computer Engineering from the University of Mumbai (CGPA 8.7/10). I work across the entire stack — from crafting pixel-perfect UIs with React and Tailwind to designing robust APIs with Node.js and Laravel. I'm always exploring new technologies, whether it's AI-powered tools, browser extensions, or desktop applications.",
    image_url: null,
    display_order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "a-002",
    section_key: "journey",
    title: "My Journey",
    content:
      "Started coding in C during university, moved to web development with PHP/Laravel, then expanded to the modern JavaScript ecosystem with React, Next.js, and TypeScript. Now building full-stack applications at Ciklum India while creating side projects that push the boundaries of what web technology can do.",
    image_url: null,
    display_order: 2,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "a-003",
    section_key: "hobbies",
    title: "Beyond Code",
    content:
      "When I'm not coding, you'll find me exploring new tools and technologies, contributing to open-source projects, or building creative side projects like game arcades and AI agents. I enjoy chess (hence the chess clock project!) and have a knack for turning everyday problems into software solutions.",
    image_url: null,
    display_order: 3,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

export const profileBioVariants: Record<ProfileType, string> = {
  recruiter:
    "Experienced Full Stack Developer with 2+ years at Ciklum India. Proficient in React, Next.js, TypeScript, Node.js, Laravel, and PostgreSQL. Delivered production applications including Stripe integrations, AI-powered tools, and chrome extensions. B.E. Computer Engineering, Mumbai University (CGPA 8.7/10).",
  developer:
    "Full stack with a bias toward clean architecture. Daily driver: TypeScript + React + Next.js on the front, Node.js + PostgreSQL on the back. Comfortable with Python for ML pipelines and FastAPI. 25+ projects on GitHub spanning web apps, browser extensions, VS Code extensions, desktop tools, and CLI agents.",
  stalker:
    "Hey, you chose Stalker — so here's the unfiltered version. I'm Misrilal, I write code for a living and for fun. I've built everything from a chess clock to an AI that reviews code. I think in components and dream in TypeScript. Yes, I made a Netflix-themed portfolio. No, I'm not sorry.",
  adventurer:
    "Welcome, adventurer! I'm Misrilal — a developer who treats every project like a quest. From hacking together a 20-game retro arcade to building AI agents that review code, every build is an expedition. Pull up a seat and explore what I've been up to.",
};

export async function getAboutSections(): Promise<AboutSection[]> {
  const db = getDataClient();
  if (db) {
    const { data, error } = await db
      .from("about_sections")
      .select("*")
      .order("display_order");
    if (!error && data) return data;
  }
  return aboutSections.sort((a, b) => a.display_order - b.display_order);
}

export async function getAboutContent(
  profileType?: ProfileType
): Promise<{ sections: AboutSection[]; bio: string }> {
  const sections = await getAboutSections();

  const db = getDataClient();

  // Apply per-profile section overrides (title + content per profile)
  let resolvedSections = sections;
  if (db && profileType) {
    const { data: sectionVariants } = await db
      .from("content_variants")
      .select("entity_id, field_name, content")
      .eq("entity_type", "about_section")
      .eq("profile_type", profileType);

    if (sectionVariants?.length) {
      const variantMap: Record<string, Record<string, string>> = {};
      for (const v of sectionVariants) {
        if (!variantMap[v.entity_id]) variantMap[v.entity_id] = {};
        variantMap[v.entity_id][v.field_name] = v.content;
      }
      resolvedSections = sections.map((s) => {
        const overrides = variantMap[s.section_key];
        if (!overrides) return s;
        return {
          ...s,
          title: overrides.title ?? s.title,
          content: overrides.content ?? s.content,
        };
      });
    }
  }

  // Try fetching profile bio from content_variants
  let bio: string | null = null;
  if (db && profileType) {
    const { data } = await db
      .from("content_variants")
      .select("content")
      .eq("entity_type", "about")
      .eq("field_name", "bio")
      .eq("profile_type", profileType)
      .maybeSingle();
    bio = data?.content ?? null;
  }

  const fallbackBio = profileType
    ? profileBioVariants[profileType]
    : profileBioVariants.recruiter;

  return { sections: resolvedSections, bio: bio ?? fallbackBio };
}

// ─── About Hero ───────────────────────────────────────────────────────────────

export type AboutHero = {
  image_url: string;
  stats: Array<{ value: string; label: string }>;
};

const defaultAboutHero: AboutHero = {
  image_url: "/others/misril.png",
  stats: [
    { value: "2+", label: "Years Experience" },
    { value: "25+", label: "GitHub Projects" },
    { value: "8.7", label: "B.E. CGPA" },
    { value: "7", label: "Certifications" },
  ],
};

export async function getAboutHero(): Promise<AboutHero> {
  const db = getDataClient();
  if (db) {
    const { data } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "about_hero")
      .maybeSingle();
    if (data?.value) return data.value as AboutHero;
  }
  return defaultAboutHero;
}

export const DEFAULT_ABOUT_HERO = defaultAboutHero;

export async function getAboutSkillsConfig(): Promise<AboutSkillsConfig> {
  const db = getDataClient();
  if (db) {
    const { data } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "about_skills")
      .maybeSingle();
    if (data?.value) return data.value as AboutSkillsConfig;
  }
  return defaultAboutSkillsConfig;
}
