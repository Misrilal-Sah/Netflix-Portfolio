import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@supabase/supabase-js";

/** Untyped client for chatbot_cache (not in generated DB types) */
function getRawAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Rebuild system prompt from all DB tables ────────────────────────────────

async function buildSystemPrompt(): Promise<string> {
  const db = createAdminClient();

  const [aboutRes, skillsRes, projectsRes, experienceRes, certsRes] =
    await Promise.all([
      db.from("about_sections").select("*").order("display_order"),
      db.from("skills").select("*").eq("visible", true).order("display_order"),
      db.from("projects").select("*").eq("visible", true).order("display_order"),
      db.from("experience").select("*").order("display_order"),
      db.from("certifications").select("*").eq("visible", true).order("display_order"),
    ]);

  const aboutLines = (aboutRes.data ?? [])
    .map((s: Record<string, unknown>) => `${s.title}: ${s.content ?? ""}`)
    .join("\n");

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

  const projectsLines = (projectsRes.data ?? [])
    .map((p: Record<string, unknown>) => {
      const tags = Array.isArray(p.tags) ? (p.tags as string[]).join(", ") : "";
      return `- ${p.title}: ${p.description ?? ""}${tags ? ` [Tech: ${tags}]` : ""}${p.demo_url ? ` Demo: ${p.demo_url}` : ""}${p.github_url ? ` GitHub: ${p.github_url}` : ""}`;
    })
    .join("\n");

  const experienceLines = (experienceRes.data ?? [])
    .map((e: Record<string, unknown>) => {
      const bullets = Array.isArray(e.bullets) ? (e.bullets as string[]).join("; ") : "";
      const techs = Array.isArray(e.technologies) ? (e.technologies as string[]).join(", ") : "";
      return `- ${e.role} at ${e.company} (${e.start_date}${e.current ? " – Present" : e.end_date ? ` – ${e.end_date}` : ""}): ${e.description ?? ""}${bullets ? ` | Key work: ${bullets}` : ""}${techs ? ` | Technologies: ${techs}` : ""}`;
    })
    .join("\n");

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
"Sorry, I can only answer questions about Misrilal Sah. For anything else, visit /contact or email: misrilalsah.work@gmail.com"

=== ABOUT ===
Name: Misrilal Sah
Title: Software Engineer at Ciklum India
Education: B.E. Computer Engineering, University of Mumbai — 8.8 CGPA
Portfolio: https://misril.dev
Email: misrilalsah.work@gmail.com
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
