import type { Experience } from "@/lib/types/database";
import { getDataClient } from "@/lib/supabase/data-client";

const experiences: Experience[] = [
  {
    id: "e-001",
    company: "Ciklum India",
    role: "Full Stack Developer",
    description:
      "Developing and maintaining full-stack web applications using React, Node.js, Laravel, and PostgreSQL. Building internal tools, API integrations, and contributing to CI/CD pipelines. Implemented Stripe payment integration, AI-powered features, and automated testing workflows.",
    start_date: "2023-01-01",
    end_date: null,
    current: true,
    display_order: 1,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "e-002",
    company: "University of Mumbai",
    role: "B.E. Computer Engineering",
    description:
      "Bachelor of Engineering in Computer Engineering with CGPA 8.7/10. Coursework in data structures, algorithms, database systems, operating systems, and software engineering. Active participant in hackathons and coding competitions.",
    start_date: "2019-07-01",
    end_date: "2023-06-01",
    current: false,
    display_order: 2,
    created_at: "2019-07-01T00:00:00Z",
    updated_at: "2023-06-01T00:00:00Z",
  },
];

export async function getExperiences(): Promise<Experience[]> {
  const db = getDataClient();
  if (db) {
    const { data, error } = await db
      .from("experience")
      .select("*")
      .order("display_order");
    if (!error && data) return data;
  }
  return experiences.sort((a, b) => a.display_order - b.display_order);
}
