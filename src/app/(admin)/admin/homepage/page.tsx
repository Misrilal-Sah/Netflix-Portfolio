import { createAdminClient } from "@/lib/supabase/admin";
import type { HomepageCard, Project } from "@/lib/types/database";
import { HomepageClient } from "./homepage-client";

export default async function AdminHomepagePage() {
  let cards: HomepageCard[] = [];
  let projects: Project[] = [];
  let picks: Array<{ id: string; profile_type: string; project_id: string; display_order: number }> = [];

  try {
    const db = createAdminClient();
    const [cardsRes, projectsRes, picksRes] = await Promise.all([
      db.from("homepage_cards").select("*").order("display_order"),
      db.from("projects").select("*").eq("visible", true).order("display_order"),
      db.from("homepage_project_picks").select("*").order("display_order"),
    ]);
    cards = (cardsRes.data as HomepageCard[]) ?? [];
    projects = (projectsRes.data as Project[]) ?? [];
    picks = (picksRes.data as typeof picks) ?? [];
  } catch {
    /* no service key */
  }

  return (
    <HomepageClient
      initialCards={cards}
      allProjects={projects}
      initialPicks={picks}
    />
  );
}
