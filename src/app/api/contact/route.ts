import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDataClient } from "@/lib/supabase/data-client";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  subject: z.string().max(300).optional().default(""),
  message: z.string().min(1).max(5000),
  profile: z.enum(["recruiter", "developer", "stalker", "adventurer"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data. Please check all fields." },
        { status: 400 }
      );
    }

    const { name, email, subject, message, profile } = parsed.data;

    const brevoKey = process.env.BREVO_API_KEY;

    // Persist to Supabase regardless of email provider
    const db = getDataClient();
    if (db) {
      await db.from("contact_submissions").insert({
        name,
        email,
        subject: subject || null,
        message,
      });
    }

    if (brevoKey) {
      const subjectLine = subject
        ? `[misril.dev/${profile}] ${subject}`
        : `[misril.dev/${profile}] New message from ${name}`;

      const htmlBody = `
        <h2 style="color:#E50914">New contact form submission</h2>
        <table style="border-collapse:collapse; width:100%">
          <tr><td style="padding:8px; font-weight:bold; width:120px">Profile</td><td style="padding:8px">${profile}</td></tr>
          <tr><td style="padding:8px; font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
          <tr><td style="padding:8px; font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px; font-weight:bold">Subject</td><td style="padding:8px">${subject || "(none)"}</td></tr>
          <tr><td style="padding:8px; font-weight:bold; vertical-align:top">Message</td><td style="padding:8px; white-space:pre-wrap">${message}</td></tr>
        </table>
      `;

      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoKey,
        },
        body: JSON.stringify({
          sender: { name: "misril.dev contact", email: "noreply@misril.dev" },
          to: [{ email: "misrilalsah09@gmail.com", name: "Misrilal Sah" }],
          replyTo: { email, name },
          subject: subjectLine,
          htmlContent: htmlBody,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error("[contact] Brevo error:", errBody);
        return NextResponse.json(
          { error: "Failed to send message. Please try again later." },
          { status: 502 }
        );
      }
    } else {
      // No email provider configured — submission saved to Supabase only
      console.log("[contact] No BREVO_API_KEY — saved to DB only:", { name, email, subject });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
