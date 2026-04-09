import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_CONTACT_INFO, type SocialLink } from "@/lib/data/contact-info";

/** Untyped client — contact_info is not in the generated Database types */
function getRawAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type JsonRecord = Record<string, unknown>;

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function mergeObject<T extends Record<string, unknown>>(base: T, value: unknown): T {
  if (!isJsonRecord(value)) {
    return { ...base };
  }

  return {
    ...base,
    ...(value as Partial<T>),
  };
}

function normalizeSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) {
    return DEFAULT_CONTACT_INFO.social_links;
  }

  return value
    .filter(isJsonRecord)
    .map((link) => ({
      name: toStringValue(link.name),
      url: toStringValue(link.url),
      bg_color: toStringValue(link.bg_color, "#333333"),
    }))
    .filter((link) => link.name.length > 0 && link.url.length > 0);
}

function findSocialLinkByName(links: SocialLink[], needle: string): string | null {
  const loweredNeedle = needle.toLowerCase();
  const match = links.find((link) => link.name.toLowerCase().includes(loweredNeedle));
  return match?.url ?? null;
}

export async function buildChatbotSystemPrompt(): Promise<string> {
  const db = createAdminClient();

  const [aboutRes, skillsRes, projectsRes, experienceRes, certsRes] =
    await Promise.all([
      db.from("about_sections").select("*").order("display_order"),
      db.from("skills").select("*").eq("visible", true).order("display_order"),
      db.from("projects").select("*").eq("visible", true).order("display_order"),
      db.from("experience").select("*").order("display_order"),
      db.from("certifications").select("*").eq("visible", true).order("display_order"),
    ]);

  // contact_info is not in the typed Database, so use an untyped client
  const raw = getRawAdminClient();
  const contactInfoRes = await raw.from("contact_info").select("key, value");

  const aboutLines = (aboutRes.data ?? [])
    .map((section: Record<string, unknown>) => `${section.title}: ${section.content ?? ""}`)
    .join("\n");

  const skillsByCategory: Record<string, string[]> = {};
  for (const skill of skillsRes.data ?? []) {
    const category = toStringValue((skill as Record<string, unknown>).category, "Other");
    const name = toStringValue((skill as Record<string, unknown>).name);

    if (!skillsByCategory[category]) {
      skillsByCategory[category] = [];
    }

    if (name) {
      skillsByCategory[category].push(name);
    }
  }

  const skillsLines = Object.entries(skillsByCategory)
    .map(([category, names]) => `${category}: ${names.join(", ")}`)
    .join("\n");

  const projectsLines = (projectsRes.data ?? [])
    .map((project: Record<string, unknown>) => {
      const tags = Array.isArray(project.tags)
        ? (project.tags as string[]).join(", ")
        : "";

      return `- ${project.title}: ${project.description ?? ""}${tags ? ` [Tech: ${tags}]` : ""}${project.demo_url ? ` Demo: ${project.demo_url}` : ""}${project.github_url ? ` GitHub: ${project.github_url}` : ""}`;
    })
    .join("\n");

  const experienceLines = (experienceRes.data ?? [])
    .map((experience: Record<string, unknown>) => {
      const bullets = Array.isArray(experience.bullets)
        ? (experience.bullets as string[]).join("; ")
        : "";
      const technologies = Array.isArray(experience.technologies)
        ? (experience.technologies as string[]).join(", ")
        : "";

      return `- ${experience.role} at ${experience.company} (${experience.start_date}${experience.current ? " - Present" : experience.end_date ? ` - ${experience.end_date}` : ""}): ${experience.description ?? ""}${bullets ? ` | Key work: ${bullets}` : ""}${technologies ? ` | Technologies: ${technologies}` : ""}`;
    })
    .join("\n");

  const certsLines = (certsRes.data ?? [])
    .map((cert: Record<string, unknown>) =>
      `- ${cert.title} by ${cert.provider}${cert.date_earned ? ` (${cert.date_earned})` : ""}${cert.verification_url ? ` - Verify: ${cert.verification_url}` : ""}`
    )
    .join("\n");

  const contactRows = (contactInfoRes.data ?? []) as Array<{ key: string; value: unknown }>;
  const contactMap = Object.fromEntries(
    contactRows.map((row) => [row.key, row.value])
  ) as Record<string, unknown>;

  const profileCard = mergeObject(
    DEFAULT_CONTACT_INFO.profile_card,
    contactMap.profile_card
  );
  const contactDetails = mergeObject(
    DEFAULT_CONTACT_INFO.contact_details,
    contactMap.contact_details
  );
  const availability = mergeObject(
    DEFAULT_CONTACT_INFO.availability,
    contactMap.availability
  );
  const notifications = mergeObject(
    DEFAULT_CONTACT_INFO.notifications,
    contactMap.notifications
  );
  const socialLinks = normalizeSocialLinks(contactMap.social_links);

  const displayName = toStringValue(profileCard.name, "Misrilal Sah");
  const roleTitle = toStringValue(profileCard.job_title, "Software Engineer");
  const email = toStringValue(
    contactDetails.email,
    DEFAULT_CONTACT_INFO.contact_details.email
  );
  const phone = toStringValue(contactDetails.phone, "Not configured");
  const location =
    toStringValue(contactDetails.location) ||
    toStringValue(profileCard.location, "Not configured");
  const linkedInUrl =
    toStringValue(profileCard.linkedin_url) ||
    findSocialLinkByName(socialLinks, "linkedin") ||
    DEFAULT_CONTACT_INFO.profile_card.linkedin_url;
  const githubUrl = findSocialLinkByName(socialLinks, "github") ?? "Not configured";

  const socialLinksLines =
    socialLinks.length > 0
      ? socialLinks.map((link) => `- ${link.name}: ${link.url}`).join("\n")
      : "- Not configured";

  const availabilityParts: string[] = [];
  if (toStringValue(availability.status_text)) {
    availabilityParts.push(toStringValue(availability.status_text));
  }
  if (toStringValue(availability.response_time)) {
    availabilityParts.push(toStringValue(availability.response_time));
  }
  if (!availability.is_available) {
    availabilityParts.push("currently unavailable");
  }
  const availabilityLine =
    availabilityParts.length > 0 ? availabilityParts.join(" | ") : "Not configured";

  const notificationsLine = `email ${notifications.email_enabled ? "enabled" : "disabled"}, WhatsApp ${notifications.whatsapp_enabled ? "enabled" : "disabled"}`;

  const profileBioLine = toStringValue(profileCard.bio)
    ? `Bio: ${toStringValue(profileCard.bio)}`
    : "";

  return `You are an AI assistant for ${displayName}'s Netflix-themed portfolio website (misril.dev).
You ONLY answer questions about ${displayName} using the data provided below.
Be friendly, concise (under 150 words), and professional.
Use bullet points and markdown-lite formatting where helpful.
If the visitor asks anything outside the scope of ${displayName}'s portfolio data, respond EXACTLY:
"Sorry, I can only answer questions about ${displayName}. For anything else, visit /contact or email: ${email}"

=== ABOUT ===
Name: ${displayName}
Title: ${roleTitle}
Education: B.E. Computer Engineering, University of Mumbai - 8.8 CGPA
Portfolio: https://misril.dev
Email: ${email}
LinkedIn: ${linkedInUrl}
GitHub: ${githubUrl}
${profileBioLine}
${aboutLines}

=== CONTACT ===
Phone / WhatsApp: ${phone}
Location: ${location}
Availability: ${availabilityLine}
Notifications: ${notificationsLine}
Social Profiles:
${socialLinksLines}

=== SKILLS ===
${skillsLines}

=== PROJECTS ===
${projectsLines}

=== EXPERIENCE ===
${experienceLines}

=== CERTIFICATIONS ===
${certsLines}`;
}
