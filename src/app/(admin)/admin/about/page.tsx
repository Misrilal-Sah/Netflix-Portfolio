import { createAdminClient } from "@/lib/supabase/admin";
import type { AboutSection, Skill } from "@/lib/types/database";
import { AboutClient } from "./about-client";
import { getAboutSkillsConfig, getAboutHero, DEFAULT_ABOUT_HERO, type AboutSkillsConfig, type AboutHero } from "@/lib/data/about";
import { profileBioVariants } from "@/lib/data/about";
import type { ProfileType } from "@/lib/constants";

const PROFILES: ProfileType[] = ["recruiter", "developer", "stalker", "adventurer"];

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

  try {
    const db = createAdminClient();
    const [sectionsRes, skillsRes, biosRes] = await Promise.all([
      db.from("about_sections").select("*").order("display_order"),
      db.from("skills").select("*").eq("visible", true).order("category").order("display_order"),
      db.from("content_variants")
        .select("profile_type, content")
        .eq("entity_type", "about")
        .eq("field_name", "bio"),
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
  } catch { /* no service key */ }

  return (
    <AboutClient
      initialSections={sections}
      initialSkillsConfig={skillsConfig}
      allSkills={allSkills}
      initialHero={hero}
      initialBios={bios}
    />
  );
}

