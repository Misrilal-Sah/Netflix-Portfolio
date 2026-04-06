import { createAdminClient } from "@/lib/supabase/admin";
import type { AboutSection, Skill } from "@/lib/types/database";
import { AboutClient } from "./about-client";
import { getAboutSkillsConfig, getAboutHero, DEFAULT_ABOUT_HERO, type AboutSkillsConfig, type AboutHero } from "@/lib/data/about";
import { profileBioVariants } from "@/lib/data/about";
import type { ProfileType } from "@/lib/constants";

const PROFILES: ProfileType[] = ["recruiter", "developer", "stalker", "adventurer"];

// Per-profile variants for a single about section
type SectionVariants = Record<ProfileType, { title: string; content: string }>;

export default async function AdminAboutPage() {
  let sections: AboutSection[] = [];
  let allSkills: Skill[] = [];
  let skillsConfig: AboutSkillsConfig = { categoryOrder: [], skillsByCategory: {} };
  let hero: AboutHero = DEFAULT_ABOUT_HERO;
  let bios: Record<ProfileType, string> = {
    recruiter: "",
    developer: "",
    stalker: "",
    adventurer: "",
  };
  let sectionVariants: Record<string, SectionVariants> = {};

  try {
    const db = createAdminClient();
    const [sectionsRes, skillsRes, biosRes, sectionVariantsRes] = await Promise.all([
      db.from("about_sections").select("*").order("display_order"),
      db.from("skills").select("*").eq("visible", true).order("category").order("display_order"),
      db.from("content_variants")
        .select("profile_type, content")
        .eq("entity_type", "about")
        .eq("entity_id", "bio")
        .eq("field_name", "bio"),
      db.from("content_variants")
        .select("entity_id, profile_type, field_name, content")
        .eq("entity_type", "about_section"),
    ]);
    sections = (sectionsRes.data as AboutSection[]) ?? [];
    allSkills = (skillsRes.data as Skill[]) ?? [];
    skillsConfig = await getAboutSkillsConfig();
    hero = await getAboutHero();

    // Merge DB bios with fallback
    const dbBios = (biosRes.data ?? []) as Array<{ profile_type: string; content: string }>;
    for (const p of PROFILES) {
      const found = dbBios.find((b) => b.profile_type === p);
      bios[p] = found?.content ?? profileBioVariants[p] ?? "";
    }

    // Build per-section, per-profile variant map
    const rawVariants = (sectionVariantsRes.data ?? []) as Array<{
      entity_id: string;
      profile_type: string;
      field_name: string;
      content: string;
    }>;
    for (const row of rawVariants) {
      if (!sectionVariants[row.entity_id]) {
        sectionVariants[row.entity_id] = {
          recruiter: { title: "", content: "" },
          developer: { title: "", content: "" },
          stalker: { title: "", content: "" },
          adventurer: { title: "", content: "" },
        };
      }
      const prof = row.profile_type as ProfileType;
      if (row.field_name === "title") {
        sectionVariants[row.entity_id][prof].title = row.content;
      } else if (row.field_name === "content") {
        sectionVariants[row.entity_id][prof].content = row.content;
      }
    }
  } catch { /* no service key or table not yet created */ }

  return (
    <AboutClient
      initialSections={sections}
      initialSkillsConfig={skillsConfig}
      allSkills={allSkills}
      initialHero={hero}
      initialBios={bios}
      initialSectionVariants={sectionVariants}
    />
  );
}

