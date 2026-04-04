import type { Project } from "@/lib/types/database";
import { getDataClient } from "@/lib/supabase/data-client";

const projects: Project[] = [
  {
    id: "p-001",
    title: "AI Query Master",
    slug: "ai-query-master",
    description:
      "AI-driven SQL assistant with agentic pipeline — review queries, analyze schemas, generate SQL from plain English, and connect to live databases with self-reflection and RAG-powered intelligence.",
    category: "Full Stack",
    tags: ["Python", "FastAPI", "React", "ChromaDB", "Supabase", "Gemini AI"],
    github_url: "https://github.com/Misrilal-Sah/ai-query-master",
    demo_url: null,
    screenshot_url: "/images/Projects/file-manipulation.jpg",
    featured: true,
    visible: true,
    display_order: 1,
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-03-01T00:00:00Z",
  },
  {
    id: "p-002",
    title: "Multi-Mode Smart Calculator",
    slug: "multi-mode-calculator",
    description:
      "7 calculator modes — basic, scientific, currency converter with live rates, unit converter, BMI, date calculator, and bill splitter. PWA-enabled with 7 themes.",
    category: "React",
    tags: ["React", "Vite", "PWA", "CSS3"],
    github_url: "https://github.com/Misrilal-Sah/multi-mode-calculator",
    demo_url: "https://Misrilal-Sah.github.io/multi-mode-calculator",
    screenshot_url: "/images/Projects/calculator.jpg",
    featured: true,
    visible: true,
    display_order: 2,
    created_at: "2025-02-01T00:00:00Z",
    updated_at: "2025-02-01T00:00:00Z",
  },
  {
    id: "p-003",
    title: "Code Review Agent",
    slug: "code-review-agent",
    description:
      "AI-powered code review and RAG knowledge agent — autonomous, reflective, multi-LLM, CLI-first. 24 AST rule checks with 3-iteration self-reflection.",
    category: "Python",
    tags: ["Python", "Gemini AI", "LangChain", "ChromaDB", "Groq"],
    github_url: "https://github.com/Misrilal-Sah/code-review",
    demo_url: null,
    screenshot_url: "/images/Projects/file-compressor.jpg",
    featured: true,
    visible: true,
    display_order: 3,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "p-004",
    title: "Chess Clock",
    slug: "chess-clock",
    description:
      "Professional chess clock with sub-millisecond timing, beautiful dual-theme UI, and zero dependencies. Pure vanilla JS — no frameworks, no install.",
    category: "Vanilla JS",
    tags: ["HTML5", "CSS3", "JavaScript", "Web Audio API"],
    github_url: "https://github.com/Misrilal-Sah/chess-clock",
    demo_url: null,
    screenshot_url: "/images/Projects/chess-clock.jpg",
    featured: false,
    visible: true,
    display_order: 4,
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "p-005",
    title: "Color Detection Pro",
    slug: "color-detection-pro",
    description:
      "Offline desktop color intelligence with OpenCV + ML — detect, convert, match, mix, extract, and build color systems from images or live camera feed.",
    category: "Python",
    tags: ["Python", "OpenCV", "CustomTkinter", "Machine Learning"],
    github_url: "https://github.com/Misrilal-Sah/color-detection-pro",
    demo_url: null,
    screenshot_url: "/images/Projects/color-detection.jpg",
    featured: false,
    visible: true,
    display_order: 5,
    created_at: "2024-11-01T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
  },
  {
    id: "p-006",
    title: "CurrencyX",
    slug: "currencyx",
    description:
      "Premium currency converter with real-time exchange rates, beautiful UI, and offline support.",
    category: "React",
    tags: ["React", "API Integration", "PWA"],
    github_url: "https://github.com/Misrilal-Sah/currencyx",
    demo_url: null,
    screenshot_url: "/images/Projects/currency-converter.jpg",
    featured: false,
    visible: true,
    display_order: 6,
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-01T00:00:00Z",
  },
  {
    id: "p-007",
    title: "Design Inspector Pro",
    slug: "design-inspector-pro",
    description:
      "Chrome extension for pixel-perfect design inspection — extract colors, decode typography, copy CSS — all without leaving the page.",
    category: "Chrome Extension",
    tags: ["Chrome Extension", "JavaScript", "CSS"],
    github_url: "https://github.com/Misrilal-Sah/design-inspector-pro",
    demo_url: null,
    screenshot_url: "/images/Projects/file-manipulation.jpg",
    featured: true,
    visible: true,
    display_order: 7,
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2024-09-01T00:00:00Z",
  },
  {
    id: "p-008",
    title: "PDFease",
    slug: "pdfease",
    description:
      "The ultimate free PDF and document toolkit — merge, split, compress, convert, and manipulate PDFs with a clean modern interface.",
    category: "Full Stack",
    tags: ["React", "Node.js", "PDF Processing"],
    github_url: "https://github.com/Misrilal-Sah/pdfease",
    demo_url: null,
    screenshot_url: "/images/Projects/file-compressor.jpg",
    featured: false,
    visible: true,
    display_order: 8,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "p-009",
    title: "Retro Game Arcade",
    slug: "retro-game-arcade",
    description:
      "A hand-crafted collection of 20 classic games — Tetris, Snake, Pac-Man, Breakout, and more. Pure JavaScript with retro pixel aesthetics.",
    category: "Vanilla JS",
    tags: ["JavaScript", "Canvas", "Game Development"],
    github_url: "https://github.com/Misrilal-Sah/retro-arcade",
    demo_url: null,
    screenshot_url: "/images/Projects/tic-tac.jpg",
    featured: false,
    visible: true,
    display_order: 9,
    created_at: "2024-07-01T00:00:00Z",
    updated_at: "2024-07-01T00:00:00Z",
  },
  {
    id: "p-010",
    title: "AABHAR Jewellery",
    slug: "aabhar-jewellery",
    description:
      "Premium jewellery e-commerce platform with product catalog, shopping cart, and payment integration. Built with modern design patterns.",
    category: "Laravel",
    tags: ["Laravel", "PHP", "MySQL", "E-Commerce"],
    github_url: "https://github.com/Misrilal-Sah/aabhar",
    demo_url: null,
    screenshot_url: "/images/Projects/jwellery.jpg",
    featured: false,
    visible: true,
    display_order: 10,
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "p-011",
    title: "PharmaDesk",
    slug: "pharmadesk",
    description:
      "Modern pharmacy management system — inventory tracking, prescription management, billing, and reporting with role-based access.",
    category: "Full Stack",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    github_url: "https://github.com/Misrilal-Sah/pharmadesk",
    demo_url: null,
    screenshot_url: "/images/Projects/pharmacy.jpg",
    featured: false,
    visible: true,
    display_order: 11,
    created_at: "2024-05-01T00:00:00Z",
    updated_at: "2024-05-01T00:00:00Z",
  },
  {
    id: "p-012",
    title: "Screenshot Master",
    slug: "screenshot-master",
    description:
      "Browser extension for capturing, annotating, and exporting screenshots — full page, visible area, or selected region with annotation tools.",
    category: "Chrome Extension",
    tags: ["Chrome Extension", "JavaScript", "Canvas"],
    github_url: "https://github.com/Misrilal-Sah/screenshot-master",
    demo_url: null,
    screenshot_url: "/images/Projects/file-manipulation.jpg",
    featured: false,
    visible: true,
    display_order: 12,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "p-013",
    title: "TaskFlow",
    slug: "taskflow",
    description:
      "AI-powered offline-first todo experience with smart categorization, natural language input, and beautiful animations.",
    category: "React",
    tags: ["React", "PWA", "AI", "IndexedDB"],
    github_url: "https://github.com/Misrilal-Sah/taskflow",
    demo_url: null,
    screenshot_url: "/images/Projects/file-manipulation.jpg",
    featured: false,
    visible: true,
    display_order: 13,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "p-014",
    title: "Typing Practice",
    slug: "typing-practice",
    description:
      "Speed, accuracy, consistency — a typing trainer with real-time WPM tracking, customizable text sources, and performance analytics.",
    category: "Vanilla JS",
    tags: ["JavaScript", "HTML5", "CSS3"],
    github_url: "https://github.com/Misrilal-Sah/typing-practice",
    demo_url: null,
    screenshot_url: "/images/Projects/typing-practice.jpg",
    featured: false,
    visible: true,
    display_order: 14,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "p-015",
    title: "Insert Utilities",
    slug: "insert-utilities",
    description:
      "The all-in-one text generator VS Code extension — lorem ipsum, UUIDs, dates, numbers, colors, and more with smart insertion.",
    category: "VS Code Extension",
    tags: ["TypeScript", "VS Code API", "Extension"],
    github_url: "https://github.com/Misrilal-Sah/insert-utilities",
    demo_url: null,
    screenshot_url: "/images/Projects/file-manipulation.jpg",
    featured: false,
    visible: true,
    display_order: 15,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

export async function getProjects(): Promise<Project[]> {
  const db = getDataClient();
  if (db) {
    const { data, error } = await db
      .from("projects")
      .select("*")
      .eq("visible", true)
      .order("display_order");
    if (!error && data) return data;
  }
  return projects.filter((p) => p.visible).sort((a, b) => a.display_order - b.display_order);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const db = getDataClient();
  if (db) {
    const { data, error } = await db
      .from("projects")
      .select("*")
      .eq("visible", true)
      .eq("featured", true)
      .order("display_order");
    if (!error && data) return data;
  }
  return projects.filter((p) => p.visible && p.featured).sort((a, b) => a.display_order - b.display_order);
}

export async function getProjectsByCategory(
  category: string
): Promise<Project[]> {
  const db = getDataClient();
  if (db) {
    const { data, error } = await db
      .from("projects")
      .select("*")
      .eq("visible", true)
      .eq("category", category)
      .order("display_order");
    if (!error && data) return data;
  }
  return projects
    .filter((p) => p.visible && p.category === category)
    .sort((a, b) => a.display_order - b.display_order);
}

export async function getProjectById(
  id: string
): Promise<Project | undefined> {
  const db = getDataClient();
  if (db) {
    const { data, error } = await db
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) return data;
  }
  return projects.find((p) => p.id === id);
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const db = getDataClient();
  if (db) {
    const { data, error } = await db
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!error && data) return data;
  }
  return projects.find((p) => p.slug === slug);
}
