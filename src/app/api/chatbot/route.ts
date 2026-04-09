import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ─── Build the system prompt from all Supabase tables ────────────────────────

async function buildSystemPrompt(): Promise<string> {
  const db = createAdminClient();

  // Fetch all data in parallel
  const [
    aboutRes,
    skillsRes,
    projectsRes,
    experienceRes,
    certsRes,
  ] = await Promise.all([
    db.from("about_sections").select("*").order("display_order"),
    db.from("skills").select("*").eq("visible", true).order("display_order"),
    db.from("projects").select("*").eq("visible", true).order("display_order"),
    db.from("experience").select("*").order("display_order"),
    db.from("certifications").select("*").eq("visible", true).order("display_order"),
  ]);

  // ─── About ────
  const aboutLines = (aboutRes.data ?? [])
    .map((s: Record<string, unknown>) => `${s.title}: ${s.content ?? ""}`)
    .join("\n");

  // ─── Skills ────
  const skillsByCategory: Record<string, string[]> = {};
  for (const s of skillsRes.data ?? []) {
    const cat = (s as Record<string, unknown>).category as string;
    const name = (s as Record<string, unknown>).name as string;
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(name);
  }
  const skillsLines = Object.entries(skillsByCategory)
    .map(([cat, names]) => `${cat}: ${names.join(", ")}`)
    .join("\n");

  // ─── Projects ────
  const projectsLines = (projectsRes.data ?? [])
    .map((p: Record<string, unknown>) => {
      const tags = Array.isArray(p.tags) ? (p.tags as string[]).join(", ") : "";
      return `- ${p.title}: ${p.description ?? ""}${tags ? ` [Tech: ${tags}]` : ""}${p.demo_url ? ` Demo: ${p.demo_url}` : ""}${p.github_url ? ` GitHub: ${p.github_url}` : ""}`;
    })
    .join("\n");

  // ─── Experience ────
  const experienceLines = (experienceRes.data ?? [])
    .map((e: Record<string, unknown>) => {
      const bullets = Array.isArray(e.bullets) ? (e.bullets as string[]).join("; ") : "";
      const techs = Array.isArray(e.technologies) ? (e.technologies as string[]).join(", ") : "";
      return `- ${e.role} at ${e.company} (${e.start_date}${e.current ? " – Present" : e.end_date ? ` – ${e.end_date}` : ""}): ${e.description ?? ""}${bullets ? ` | Key work: ${bullets}` : ""}${techs ? ` | Technologies: ${techs}` : ""}`;
    })
    .join("\n");

  // ─── Certifications ────
  const certsLines = (certsRes.data ?? [])
    .map((c: Record<string, unknown>) =>
      `- ${c.title} by ${c.provider}${c.date_earned ? ` (${c.date_earned})` : ""}${c.verification_url ? ` — Verify: ${c.verification_url}` : ""}`
    )
    .join("\n");

  return `You are an AI assistant for Misrilal Sah's Netflix-themed portfolio website (misril.dev).
You ONLY answer questions about Misrilal Sah using the data provided below.
Be friendly, concise (under 150 words), and professional.
Use bullet points and markdown-lite formatting where helpful.
If the visitor asks anything outside the scope of Misrilal's portfolio data, respond EXACTLY:
"Sorry, I can only answer questions about Misrilal Sah. For anything else, visit /contact or email: misrilalsah09@gmail.com"

=== ABOUT ===
Name: Misrilal Sah
Title: Software Engineer at Ciklum India
Education: B.E. Computer Engineering, University of Mumbai — 8.8 CGPA
Portfolio: https://misril.dev
Email: misrilalsah09@gmail.com
LinkedIn: https://linkedin.com/in/misrilal
GitHub: https://github.com/misrilal
${aboutLines}

=== SKILLS ===
${skillsLines}

=== PROJECTS ===
${projectsLines}

=== EXPERIENCE ===
${experienceLines}

=== CERTIFICATIONS ===
${certsLines}`;
}

// ─── Get or build cached system prompt ───────────────────────────────────────

async function getSystemPrompt(): Promise<string> {
  const db = createAdminClient();

  // Try cache first
  const { data: cache } = await db
    .from("chatbot_cache")
    .select("context_text")
    .limit(1)
    .maybeSingle();

  if (cache?.context_text) {
    return cache.context_text as string;
  }

  // Build fresh and cache it
  const prompt = await buildSystemPrompt();
  await db.from("chatbot_cache").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // clear all
  await db.from("chatbot_cache").insert({ context_text: prompt });
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
