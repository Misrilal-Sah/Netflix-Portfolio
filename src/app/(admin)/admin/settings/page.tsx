import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  let settings: Array<{ key: string; value: Record<string, unknown> }> = [];
  try {
    const db = createAdminClient();
    const { data } = await db.from("site_settings").select("key, value").order("key");
    settings = (data as typeof settings) ?? [];
  } catch { /* no service key */ }
  return <SettingsClient initialSettings={settings} />;
}

