import type { Skill } from "@/lib/types/database";
import { getDataClient } from "@/lib/supabase/data-client";

const skills: Skill[] = [
  // Frontend
  { id: "s-001", name: "JavaScript", category: "Frontend", icon_url: null, description: "ES6+, DOM manipulation, async/await", display_order: 1, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-002", name: "TypeScript", category: "Frontend", icon_url: null, description: "Strict typing, generics, type guards", display_order: 2, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-003", name: "React", category: "Frontend", icon_url: null, description: "Hooks, Context, Server Components", display_order: 3, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-004", name: "Next.js", category: "Frontend", icon_url: null, description: "App Router, SSR, ISR, API routes", display_order: 4, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-005", name: "Vue.js", category: "Frontend", icon_url: null, description: "Composition API, Vuex, Vue Router", display_order: 5, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-006", name: "Tailwind CSS", category: "Frontend", icon_url: null, description: "Utility-first, v4 @theme, responsive design", display_order: 6, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-007", name: "HTML5 / CSS3", category: "Frontend", icon_url: null, description: "Semantic HTML, Flexbox, Grid, animations", display_order: 7, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-008", name: "Framer Motion", category: "Frontend", icon_url: null, description: "Page transitions, gestures, layout animations", display_order: 8, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },

  // Backend
  { id: "s-009", name: "Node.js", category: "Backend", icon_url: null, description: "Express, REST APIs, middleware", display_order: 1, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-010", name: "Python", category: "Backend", icon_url: null, description: "FastAPI, Flask, automation, ML pipelines", display_order: 2, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-011", name: "PHP / Laravel", category: "Backend", icon_url: null, description: "MVC, Eloquent ORM, queues, events", display_order: 3, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-012", name: "FastAPI", category: "Backend", icon_url: null, description: "Async endpoints, Pydantic, OpenAPI", display_order: 4, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },

  // Database
  { id: "s-013", name: "PostgreSQL", category: "Database", icon_url: null, description: "Complex queries, RLS, triggers, indexes", display_order: 1, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-014", name: "MySQL", category: "Database", icon_url: null, description: "Joins, stored procedures, optimization", display_order: 2, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-015", name: "MongoDB", category: "Database", icon_url: null, description: "Document model, aggregation, Atlas", display_order: 3, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-016", name: "Supabase", category: "Database", icon_url: null, description: "Auth, RLS, real-time, storage", display_order: 4, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },

  // DevOps
  { id: "s-017", name: "Docker", category: "DevOps", icon_url: null, description: "Containerization, Docker Compose, multi-stage builds", display_order: 1, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-018", name: "Git / GitHub", category: "DevOps", icon_url: null, description: "Branching, PRs, CI/CD, Actions", display_order: 2, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-019", name: "Vercel", category: "DevOps", icon_url: null, description: "Deploy, preview, serverless functions", display_order: 3, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-020", name: "AWS", category: "DevOps", icon_url: null, description: "EC2, S3, Lambda, CloudFront", display_order: 4, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },

  // Tools
  { id: "s-021", name: "VS Code", category: "Tools", icon_url: null, description: "Extensions, keybindings, workspace config", display_order: 1, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-022", name: "Figma", category: "Tools", icon_url: null, description: "Design, prototyping, dev handoff", display_order: 2, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "s-023", name: "Postman", category: "Tools", icon_url: null, description: "API testing, collections, environments", display_order: 3, visible: true, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
];

export async function getSkills(): Promise<Skill[]> {
  const db = getDataClient();
  if (db) {
    const { data, error } = await db
      .from("skills")
      .select("*")
      .eq("visible", true)
      .order("display_order");
    if (!error && data) {
      // Deduplicate by id (in case of duplicates from database)
      const seen = new Set<string>();
      return data.filter((s) => {
        if (seen.has(s.id)) return false;
        seen.add(s.id);
        return true;
      });
    }
  }
  return skills.filter((s) => s.visible).sort((a, b) => a.display_order - b.display_order);
}

export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  const db = getDataClient();
  if (db) {
    const { data, error } = await db
      .from("skills")
      .select("*")
      .eq("visible", true)
      .eq("category", category)
      .order("display_order");
    if (!error && data) return data;
  }
  return skills
    .filter((s) => s.visible && s.category === category)
    .sort((a, b) => a.display_order - b.display_order);
}
