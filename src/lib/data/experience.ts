import type { Experience } from "@/lib/types/database";
import { getDataClient } from "@/lib/supabase/data-client";

const experiences: Experience[] = [
  {
    id: "e-001",
    company: "Ciklum India",
    role: "Software Engineer",
    description: null,
    bullets: [
      "Enhanced platform usability with new features.",
      "Built site reporting to analyze subscribers and customers.",
      "Created dynamic, auto-generated movie pages for promotions.",
      "Added tracking for clicks, downloads, and interactions with visualized insights.",
    ],
    technologies: ["Node.js", "Vue.js", "PHP", "Laravel", "MySQL", "AWS", "Git"],
    card_color: "#b7f3b7",
    start_date: "2024-01-01",
    end_date: null,
    current: true,
    display_order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "e-002",
    company: "Infogen Labs Pvt Limited",
    role: "Software Engineer",
    description: null,
    bullets: [
      "Optimized data processing, resolving timeout errors.",
      "Integrated third-party services to enhance platform.",
      "Fixed Stripe billing issues.",
      "Automated post management via Facebook Graph API.",
      "Implemented cron jobs for live engagement metrics.",
    ],
    technologies: ["PHP", "Laravel", "Node.js", "Vue.js", "MySQL", "AWS", "Git"],
    card_color: "#b7f3b7",
    start_date: "2023-01-01",
    end_date: "2024-12-31",
    current: false,
    display_order: 2,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2024-12-31T00:00:00Z",
  },
  {
    id: "e-003",
    company: "Gadre Infotech Pvt Limited",
    role: "Web Designer (Intern)",
    description: null,
    bullets: [
      "Built a school website",
      "The website is responsive on all devices",
    ],
    technologies: ["HTML", "CSS", "Bootstrap", "JavaScript", "Git"],
    card_color: "#b7f3b7",
    start_date: "2022-01-01",
    end_date: "2022-12-31",
    current: false,
    display_order: 3,
    created_at: "2022-01-01T00:00:00Z",
    updated_at: "2022-12-31T00:00:00Z",
  },
  {
    id: "e-004",
    company: "University of Mumbai",
    role: "Bachelor of Computer Engineering",
    description: null,
    bullets: [
      "Studied Computer Engineering",
      "Graduated with an 8.8 CGPA",
      "Created vFurnature eCommerce website",
    ],
    card_color: "#FFE5B4",
    start_date: "2019-07-01",
    end_date: "2023-06-01",
    current: false,
    display_order: 4,
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
    if (!error && data) {
      // Deduplicate by id (in case of duplicates from database)
      const seen = new Set<string>();
      return data.filter((e) => {
        if (seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      });
    }
  }
  return experiences.sort((a, b) => a.display_order - b.display_order);
}
