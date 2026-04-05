import type { ProjectCategory, ProjectTag } from "@/lib/types/database";
import { getDataClient } from "@/lib/supabase/data-client";

const defaultCategories: ProjectCategory[] = [
  { id: "cat-01", name: "Full Stack", display_order: 0, visible: true, created_at: "" },
  { id: "cat-02", name: "Python", display_order: 1, visible: true, created_at: "" },
  { id: "cat-03", name: "React", display_order: 2, visible: true, created_at: "" },
  { id: "cat-04", name: "Vanilla JS", display_order: 3, visible: true, created_at: "" },
  { id: "cat-05", name: "Vue.js", display_order: 4, visible: true, created_at: "" },
  { id: "cat-06", name: "Laravel", display_order: 5, visible: true, created_at: "" },
  { id: "cat-07", name: "Chrome Extension", display_order: 6, visible: true, created_at: "" },
  { id: "cat-08", name: "VS Code Extension", display_order: 7, visible: true, created_at: "" },
];

const defaultTags: ProjectTag[] = [
  { id: "tag-01", name: "React", display_order: 0, visible: true, created_at: "" },
  { id: "tag-02", name: "Node.js", display_order: 1, visible: true, created_at: "" },
  { id: "tag-03", name: "Python", display_order: 2, visible: true, created_at: "" },
  { id: "tag-04", name: "TypeScript", display_order: 3, visible: true, created_at: "" },
  { id: "tag-05", name: "JavaScript", display_order: 4, visible: true, created_at: "" },
  { id: "tag-06", name: "FastAPI", display_order: 5, visible: true, created_at: "" },
  { id: "tag-07", name: "MySQL", display_order: 6, visible: true, created_at: "" },
  { id: "tag-08", name: "Express", display_order: 7, visible: true, created_at: "" },
  { id: "tag-09", name: "Vue.js", display_order: 8, visible: true, created_at: "" },
  { id: "tag-10", name: "Chrome Extension", display_order: 9, visible: true, created_at: "" },
  { id: "tag-11", name: "VS Code API", display_order: 10, visible: true, created_at: "" },
  { id: "tag-12", name: "PWA", display_order: 11, visible: true, created_at: "" },
  { id: "tag-13", name: "LangChain", display_order: 12, visible: true, created_at: "" },
  { id: "tag-14", name: "RAG", display_order: 13, visible: true, created_at: "" },
  { id: "tag-15", name: "OpenCV", display_order: 14, visible: true, created_at: "" },
  { id: "tag-16", name: "CSS3", display_order: 15, visible: true, created_at: "" },
  { id: "tag-17", name: "HTML5", display_order: 16, visible: true, created_at: "" },
  { id: "tag-18", name: "Vite", display_order: 17, visible: true, created_at: "" },
  { id: "tag-19", name: "Supabase", display_order: 18, visible: true, created_at: "" },
  { id: "tag-20", name: "Multi-AI", display_order: 19, visible: true, created_at: "" },
  { id: "tag-21", name: "ChromaDB", display_order: 20, visible: true, created_at: "" },
  { id: "tag-22", name: "Groq", display_order: 21, visible: true, created_at: "" },
  { id: "tag-23", name: "Flask", display_order: 22, visible: true, created_at: "" },
  { id: "tag-24", name: "Laravel", display_order: 23, visible: true, created_at: "" },
  { id: "tag-25", name: "PHP", display_order: 24, visible: true, created_at: "" },
  { id: "tag-26", name: "Canvas", display_order: 25, visible: true, created_at: "" },
  { id: "tag-27", name: "Machine Learning", display_order: 26, visible: true, created_at: "" },
  { id: "tag-28", name: "Extension", display_order: 27, visible: true, created_at: "" },
  { id: "tag-29", name: "Razorpay", display_order: 28, visible: true, created_at: "" },
  { id: "tag-30", name: "Multi-LLM", display_order: 29, visible: true, created_at: "" },
  { id: "tag-31", name: "Prisma", display_order: 30, visible: true, created_at: "" },
  { id: "tag-32", name: "GenAI", display_order: 31, visible: true, created_at: "" },
  { id: "tag-33", name: "Gemini", display_order: 32, visible: true, created_at: "" },
  { id: "tag-34", name: "MongoDB", display_order: 33, visible: true, created_at: "" },
  { id: "tag-35", name: "PDF.js", display_order: 34, visible: true, created_at: "" },
  { id: "tag-36", name: "API", display_order: 35, visible: true, created_at: "" },
];

export async function getProjectCategories(): Promise<ProjectCategory[]> {
  const db = getDataClient();
  if (db) {
    const { data, error } = await db
      .from("project_categories")
      .select("*")
      .eq("visible", true)
      .order("display_order");
    if (!error && data) return data;
  }
  return defaultCategories.filter((c) => c.visible).sort((a, b) => a.display_order - b.display_order);
}

export async function getProjectTags(): Promise<ProjectTag[]> {
  const db = getDataClient();
  if (db) {
    const { data, error } = await db
      .from("project_tags")
      .select("*")
      .eq("visible", true)
      .order("display_order");
    if (!error && data) return data;
  }
  return defaultTags.filter((t) => t.visible).sort((a, b) => a.display_order - b.display_order);
}
