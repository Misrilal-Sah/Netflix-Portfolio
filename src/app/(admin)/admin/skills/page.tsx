import { createAdminClient } from "@/lib/supabase/admin";
import type { Skill } from "@/lib/types/database";
import { SkillsClient } from "./skills-client";

export default async function AdminSkillsPage() {
  let skills: Skill[] = [];
  try {
    const db = createAdminClient();
    const { data } = await db.from("skills").select("*").order("display_order");
    skills = (data as Skill[]) ?? [];
  } catch { /* no service key configured */ }
  return <SkillsClient initialSkills={skills} />;
}
