import type { Certification } from "@/lib/types/database";
import { getDataClient } from "@/lib/supabase/data-client";

const certifications: Certification[] = [
  {
    id: "c-001",
    title: "Stripe Certified Professional Developer",
    provider: "Stripe",
    logo_url: null,
    date_earned: "2025-04-01",
    date_expires: "2027-04-01",
    short_description: "Stripe payment processing, payment methods, and billing APIs in production.",
    verification_url: "https://www.credential.net/25c1f6cb-e79c-4e56-b933-6adfababca4f",
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
    date_expires: null,
    short_description: "Advanced AI/ML concepts, prompt engineering, and agentic systems.",
    verification_url: "https://ciklum.com/certifications/ai-academy",
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
    date_expires: null,
    short_description: "Comprehensive full-stack web development with HTML, CSS, JavaScript, React, and Node.js.",
    verification_url: "https://www.udemy.com/certificate/UC-3d4e8f1b-5a2c-4d3e-9f2a-1b3c5d7e9f2a/",
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
    date_expires: null,
    short_description: "JavaScript fundamentals, DOM manipulation, async/await, and ES6+ concepts.",
    verification_url: "https://coursera.org/verify/UJZN3P5L4K2M",
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
    date_expires: null,
    short_description: "Algorithms, data structures, logic, and competitive programming.",
    verification_url: "https://www.hackerrank.com/certificates/verify/misrilal-sah",
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
    date_expires: null,
    short_description: "Advanced JavaScript concepts including closures, prototypes, and functional programming.",
    verification_url: "https://www.hackerrank.com/certificates/verify/misrilal-sah-js",
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
    date_expires: null,
    short_description: "Fundamentals of web development: responsive design, semantic HTML, CSS layout, and vanilla JavaScript.",
    verification_url: "https://coursera.org/verify/XYZ7K9M2N5P1Q3R",
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
    if (!error && data) {
      // Deduplicate by id (in case of duplicates from database)
      const seen = new Set<string>();
      return data.filter((c) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
    }
  }
  return certifications
    .filter((c) => c.visible)
    .sort((a, b) => a.display_order - b.display_order);
}
