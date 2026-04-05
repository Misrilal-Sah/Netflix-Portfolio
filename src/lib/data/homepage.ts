import type { ProfileType } from "@/lib/constants";
import type { HomepageCard, HomepageProjectPick, Project } from "@/lib/types/database";
import { getDataClient } from "@/lib/supabase/data-client";

// ─── Homepage Cards ──────────────────────────────────────────────────────────

export async function getHomepageCards(
  profileType: ProfileType,
  section: "continue_watching" | "top_picks"
): Promise<HomepageCard[]> {
  const db = getDataClient();
  if (!db) return [];
  const { data, error } = await db
    .from("homepage_cards")
    .select("*")
    .eq("profile_type", profileType)
    .eq("section", section)
    .order("display_order");
  if (error) return [];
  return (data ?? []) as HomepageCard[];
}

// ─── Homepage Project Picks (joined with projects) ──────────────────────────

export async function getHomepageProjectPicks(
  profileType: ProfileType
): Promise<(HomepageProjectPick & { project: Project })[]> {
  const db = getDataClient();
  if (!db) return [];
  const { data, error } = await db
    .from("homepage_project_picks")
    .select("*, project:projects(*)")
    .eq("profile_type", profileType)
    .order("display_order");
  if (error) return [];
  return (data ?? []) as (HomepageProjectPick & { project: Project })[];
}
