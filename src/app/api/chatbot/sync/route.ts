import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildChatbotSystemPrompt } from "@/lib/chatbot/system-prompt";

/** Untyped client for chatbot_cache (not in generated DB types) */
function getRawAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Rebuild system prompt from DB tables ───────────────────────────────────

async function buildSystemPrompt(): Promise<string> {
  return buildChatbotSystemPrompt();
}

// ─── POST handler — sync/regenerate chatbot cache ────────────────────────────

export async function POST() {
  try {
    const raw = getRawAdminClient();
    const prompt = await buildSystemPrompt();

    // Clear old cache and insert fresh
    await raw.from("chatbot_cache").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error } = await raw.from("chatbot_cache").insert({ context_text: prompt });

    if (error) {
      console.error("[chatbot/sync] Insert error:", error);
      return NextResponse.json(
        { error: "Failed to update cache" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updated_at: new Date().toISOString(),
      prompt_length: prompt.length,
    });
  } catch (err) {
    console.error("[chatbot/sync] Error:", err);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
