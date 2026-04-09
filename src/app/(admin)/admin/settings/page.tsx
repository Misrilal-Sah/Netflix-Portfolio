import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  let settings: Array<{ key: string; value: Record<string, unknown> }> = [];
  let chatbotLastSynced: string | null = null;

  try {
    const db = createAdminClient();
    const { data } = await db.from("site_settings").select("key, value").order("key");
    settings = (data as typeof settings) ?? [];

    // Fetch chatbot cache timestamp
    const { data: cache } = await db
      .from("chatbot_cache")
      .select("updated_at")
      .limit(1)
      .maybeSingle();
    chatbotLastSynced = (cache?.updated_at as string) ?? null;
  } catch { /* no service key */ }

  return (
    <SettingsClient
      initialSettings={settings}
      chatbotLastSynced={chatbotLastSynced}
    />
  );
}

