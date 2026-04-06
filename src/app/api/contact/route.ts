import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDataClient } from "@/lib/supabase/data-client";
import { sendWhatsAppMessage } from "@/lib/services/whatsapp";
import { getContactInfoData } from "@/lib/data/contact-info";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  subject: z.string().max(300).optional().default(""),
  message: z.string().min(1).max(5000),
  profile: z.enum(["recruiter", "developer", "stalker", "adventurer"]),
  recaptcha_token: z.string().optional(),
});

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) return true; // Skip verification when key not configured

  const params = new URLSearchParams({ secret: secretKey, response: token });
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: params,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

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

    const { name, email, subject, message, profile, recaptcha_token } = parsed.data;

    // reCAPTCHA verification (skipped gracefully when secret key not configured)
    if (recaptcha_token) {
      const valid = await verifyRecaptcha(recaptcha_token);
      if (!valid) {
        return NextResponse.json(
          { error: "reCAPTCHA verification failed. Please try again." },
          { status: 400 }
        );
      }
    }

    // Get contact info to check notification preferences
    const contactInfo = await getContactInfoData();
    const brevoKey = process.env.BREVO_API_KEY;

    // Persist to Supabase regardless of notification provider
    const db = getDataClient();
    if (db) {
      await db.from("contact_submissions").insert({
        name,
        email,
        subject: subject || null,
        message,
      });
    }

    // Send email if enabled
    if (contactInfo.notifications.email_enabled && brevoKey) {
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
      }
    } else if (!contactInfo.notifications.email_enabled) {
      console.log("[contact] Email notifications disabled");
    } else {
      console.log("[contact] No BREVO_API_KEY configured");
    }

    // Send WhatsApp notification if enabled
    if (contactInfo.notifications.whatsapp_enabled) {
      const whatsappResult = await sendWhatsAppMessage(name, email, subject, message, profile);
      if (!whatsappResult.success) {
        console.warn("[contact] WhatsApp notification failed:", whatsappResult.error);
        // Don't fail the request if WhatsApp fails
      }
    } else {
      console.log("[contact] WhatsApp notifications disabled");
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
