import { getDataClient } from "@/lib/supabase/data-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SocialLink = {
  name: string;
  url: string;
  bg_color: string;
};

export type ContactInfoData = {
  profile_card: {
    name: string;
    job_title: string;
    bio: string;
    location: string;
    photo_url: string;
    linkedin_url: string;
  };
  contact_details: {
    email: string;
    phone: string;
    location: string;
  };
  social_links: SocialLink[];
  availability: {
    is_available: boolean;
    status_text: string;
    response_time: string;
  };
  notifications: {
    email_enabled: boolean;
    whatsapp_enabled: boolean;
  };
};

// ─── Defaults (mirrors seed data) ────────────────────────────────────────────

export const DEFAULT_CONTACT_INFO: ContactInfoData = {
  profile_card: {
    name: "Misrilal Sah",
    job_title: "Software Engineer",
    bio: "With 2+ years of experience as a Full Stack Developer, proficient in PHP and JavaScript technologies and specializing in the edge-technologies.",
    location: "Pune, Maharashtra, India",
    photo_url: "/others/misril.png",
    linkedin_url: "https://www.linkedin.com/in/misrilal-sah/",
  },
  contact_details: {
    email: "misrilalsah09@gmail.com",
    phone: "+91 8237138622",
    location: "Pune, Maharashtra, India",
  },
  social_links: [
    { name: "LinkedIn",  url: "https://www.linkedin.com/in/misrilal-sah/",   bg_color: "#0077B5" },
    { name: "Instagram", url: "https://www.instagram.com/sah._099/",          bg_color: "#E1306C" },
    { name: "Reddit",    url: "https://reddit.com/u/Sad-Expression6099",      bg_color: "#FF4500" },
    { name: "Discord",   url: "https://discord.com/users/misrilalsah",        bg_color: "#5865F2" },
    { name: "WhatsApp",  url: "https://wa.me/918237138622",                   bg_color: "#25D366" },
    { name: "Telegram",  url: "https://t.me/John715",                         bg_color: "#2AABEE" },
  ],
  availability: {
    is_available: true,
    status_text: "Available for freelance work",
    response_time: "Average response time: 24 hours",
  },
  notifications: {
    email_enabled: true,
    whatsapp_enabled: true,
  },
};

// ─── Homepage Hero Types / Defaults ──────────────────────────────────────────

export type HomepageHero = {
  title: string;
  description: string;
  image_url: string;
  resume_url: string;
  linkedin_url: string;
};

export const DEFAULT_HOMEPAGE_HERO: HomepageHero = {
  title: "Misrilal Sah — Software Engineer",
  description:
    "Full Stack Developer with 2+ years building production React, Node.js, and AI applications. Passionate about clean architecture and ship-ready code.",
  image_url: "/images/hero.gif",
  resume_url: "/files/Misrilal_Sah_Resume.pdf",
  linkedin_url: "https://linkedin.com/in/misrilalsah",
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchContactInfoKey<T>(key: string, fallback: T): Promise<T> {
  const db = getDataClient();
  if (!db) return fallback;

  const { data } = await db
    .from("contact_info")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (!data?.value) return fallback;
  return { ...fallback, ...(data.value as Partial<T>) } as T;
}

export async function getContactInfoData(): Promise<ContactInfoData> {
  const db = getDataClient();
  if (!db) return DEFAULT_CONTACT_INFO;

  const { data } = await db
    .from("contact_info")
    .select("key, value");

  if (!data || data.length === 0) return DEFAULT_CONTACT_INFO;

  const map = Object.fromEntries(data.map((row: { key: string; value: unknown }) => [row.key, row.value]));

  return {
    profile_card: {
      ...DEFAULT_CONTACT_INFO.profile_card,
      ...(map["profile_card"] as ContactInfoData["profile_card"] ?? {}),
    },
    contact_details: {
      ...DEFAULT_CONTACT_INFO.contact_details,
      ...(map["contact_details"] as ContactInfoData["contact_details"] ?? {}),
    },
    social_links: Array.isArray(map["social_links"])
      ? (map["social_links"] as SocialLink[])
      : DEFAULT_CONTACT_INFO.social_links,
    availability: {
      ...DEFAULT_CONTACT_INFO.availability,
      ...(map["availability"] as ContactInfoData["availability"] ?? {}),
    },
    notifications: {
      ...DEFAULT_CONTACT_INFO.notifications,
      ...(map["notifications"] as ContactInfoData["notifications"] ?? {}),
    },
  };
}

export async function getHomepageHero(profileType?: string): Promise<HomepageHero> {
  const db = getDataClient();
  if (!db) return DEFAULT_HOMEPAGE_HERO;

  // Try profile-specific hero first, then fall back to shared
  const key = profileType ? `homepage_hero_${profileType}` : "homepage_hero";
  const { data } = await db
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (data?.value && typeof data.value === "object") {
    return { ...DEFAULT_HOMEPAGE_HERO, ...(data.value as Partial<HomepageHero>) };
  }

  // Fallback to shared homepage_hero if profile-specific not found
  if (profileType) {
    const { data: shared } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "homepage_hero")
      .maybeSingle();
    if (shared?.value && typeof shared.value === "object") {
      return { ...DEFAULT_HOMEPAGE_HERO, ...(shared.value as Partial<HomepageHero>) };
    }
  }

  return DEFAULT_HOMEPAGE_HERO;
}
