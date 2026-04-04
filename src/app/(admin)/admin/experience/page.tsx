import { createAdminClient } from "@/lib/supabase/admin";
import type { Experience } from "@/lib/types/database";
import { ExperienceClient } from "./experience-client";

export default async function AdminExperiencePage() {
  let experience: Experience[] = [];
  try {
    const db = createAdminClient();
    const { data } = await db.from("experience").select("*").order("start_date", { ascending: false });
    experience = (data as Experience[]) ?? [];
  } catch { /* no service key */ }
  return <ExperienceClient initialExperience={experience} />;
}
