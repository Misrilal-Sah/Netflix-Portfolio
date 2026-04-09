import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildChatbotSystemPrompt } from "@/lib/chatbot/system-prompt";

/** Untyped client used only for the chatbot_cache table (not in generated DB types) */
function getRawAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Build the system prompt from Supabase tables ───────────────────────────

async function buildSystemPrompt(): Promise<string> {
  return buildChatbotSystemPrompt();
}

// ─── Get or build cached system prompt ───────────────────────────────────────

async function getSystemPrompt(): Promise<string> {
  const raw = getRawAdminClient();

  // Try cache first
  const { data: cache } = await raw
    .from("chatbot_cache")
    .select("context_text")
    .limit(1)
    .maybeSingle();

  if (cache?.context_text) {
    return cache.context_text as string;
  }

  // Build fresh and cache it
  const prompt = await buildSystemPrompt();
  await raw.from("chatbot_cache").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await raw.from("chatbot_cache").insert({ context_text: prompt });
  return prompt;
}

// ─── POST handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chatbot not configured" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const userMessages: Array<{ role: string; content: string }> =
      body.messages ?? [];

    if (!userMessages.length) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    // Build the full message list with system prompt
    const systemPrompt = await getSystemPrompt();

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...userMessages.slice(-8), // keep last 8 messages for context
    ];

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: groqMessages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      console.error("[chatbot] Groq API error:", groqRes.status, errBody);
      return NextResponse.json(
        { error: "AI service error" },
        { status: 502 }
      );
    }

    const groqData = await groqRes.json();
    const reply =
      groqData.choices?.[0]?.message?.content ??
      "Sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chatbot] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
