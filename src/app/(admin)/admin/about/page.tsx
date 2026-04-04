import { createAdminClient } from "@/lib/supabase/admin";
import type { AboutSection } from "@/lib/types/database";
import { AboutClient } from "./about-client";

export default async function AdminAboutPage() {
  let sections: AboutSection[] = [];
  try {
    const db = createAdminClient();
    const { data } = await db.from("about_sections").select("*").order("display_order");
    sections = (data as AboutSection[]) ?? [];
  } catch { /* no service key */ }
  return <AboutClient initialSections={sections} />;
}

