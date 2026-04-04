import type { Certification } from "@/lib/types/database";
import { getDataClient } from "@/lib/supabase/data-client";

const certifications: Certification[] = [
  {
    id: "c-001",
    title: "Stripe Certified Professional Developer",
    provider: "Stripe",
    logo_url: null,
    date_earned: "2025-04-01",
    verification_url: null,
    display_order: 1,
    visible: true,
    created_at: "2025-04-01T00:00:00Z",
    updated_at: "2025-04-01T00:00:00Z",
  },
  {
    id: "c-002",
    title: "AI Academy Level 3",
    provider: "Ciklum",
    logo_url: null,
    date_earned: "2025-01-01",
    verification_url: null,
    display_order: 2,
    visible: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "c-003",
    title: "The Complete Web Developer Course 3.0",
    provider: "Udemy",
    logo_url: null,
    date_earned: "2023-06-01",
    verification_url: null,
    display_order: 3,
    visible: true,
    created_at: "2023-06-01T00:00:00Z",
    updated_at: "2023-06-01T00:00:00Z",
  },
  {
    id: "c-004",
    title: "Programming with JavaScript",
    provider: "Coursera (Meta)",
    logo_url: null,
    date_earned: "2023-03-01",
    verification_url: null,
    display_order: 4,
    visible: true,
    created_at: "2023-03-01T00:00:00Z",
    updated_at: "2023-03-01T00:00:00Z",
  },
  {
    id: "c-005",
    title: "Problem Solving (Intermediate)",
    provider: "HackerRank",
    logo_url: null,
    date_earned: "2023-01-01",
    verification_url: null,
    display_order: 5,
    visible: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "c-006",
    title: "JavaScript (Intermediate)",
    provider: "HackerRank",
    logo_url: null,
    date_earned: "2022-11-01",
    verification_url: null,
    display_order: 6,
    visible: true,
    created_at: "2022-11-01T00:00:00Z",
    updated_at: "2022-11-01T00:00:00Z",
  },
  {
    id: "c-007",
    title: "Introduction to Web Development with HTML, CSS, JavaScript",
    provider: "Codio (Coursera)",
    logo_url: null,
    date_earned: "2022-08-01",
    verification_url: null,
    display_order: 7,
    visible: true,
    created_at: "2022-08-01T00:00:00Z",
    updated_at: "2022-08-01T00:00:00Z",
  },
];

export async function getCertifications(): Promise<Certification[]> {
  const db = getDataClient();
  if (db) {
    const { data, error } = await db
      .from("certifications")
      .select("*")
      .eq("visible", true)
      .order("display_order");
    if (!error && data) return data;
  }
  return certifications
    .filter((c) => c.visible)
    .sort((a, b) => a.display_order - b.display_order);
}
