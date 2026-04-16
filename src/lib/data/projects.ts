import type { Project } from "@/lib/types/database";
import { getDataClient } from "@/lib/supabase/data-client";

const projects: Project[] = [
  // ─── Featured Full-Stack / AI ─────────────────────────────────
  {
    id: "p-001",
    title: "AI Query Master",
    slug: "ai-query-master",
    description:
      "AI database assistant using RAG, reasoning & agentic workflows — review queries, analyze schemas, generate SQL from plain English, and connect to live databases with self-reflection.",
    category: "Full Stack",
    sub_category: "AI Applications",
    tags: ["Python", "FastAPI", "React", "ChromaDB", "Multi-LLM", "Supabase"],
    github_url: "https://github.com/Misrilal-Sah/ai-query-master",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/hero.gif",
    readme_content: null,
    date_label: "March 2025",
    button_config: {},
    featured: true,
    visible: true,
    display_order: 1,
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-03-01T00:00:00Z",
  },
  {
    id: "p-002",
    title: "MirraSync",
    slug: "mirrasync",
    description:
      "Run 20 AI models simultaneously — one prompt, all minds. Compare responses side-by-side with unified interface.",
    category: "Full Stack",
    sub_category: "AI Applications",
    tags: ["React", "Node.js", "MySQL", "Prisma", "Multi-AI"],
    github_url: "https://github.com/Misrilal-Sah/mirrasync",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/mirrasync.jpg",
    readme_content: null,
    date_label: "February 2025",
    button_config: {},
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
      "AI agent that reviews code via RAG pipeline & suggests improvements — autonomous, reflective, multi-LLM, CLI-first. 24 AST rule checks with 3-iteration self-reflection.",
    category: "Python",
    sub_category: "AI Applications",
    tags: ["Python", "FastAPI", "RAG", "LangChain", "ChromaDB", "Groq"],
    github_url: "https://github.com/Misrilal-Sah/code-review",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/file-compressor.jpg",
    readme_content: null,
    date_label: "January 2025",
    button_config: {},
    featured: true,
    visible: true,
    display_order: 3,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "p-004",
    title: "RAG Chatbot GenAI",
    slug: "rag-chatbot-genai",
    description:
      "Retrieval-Augmented Generation chatbot with document-based knowledge — upload docs and chat with your data using state-of-the-art AI.",
    category: "Python",
    sub_category: "AI Applications",
    tags: ["Python", "GenAI", "RAG", "LangChain"],
    github_url: "https://github.com/Misrilal-Sah/rag-chatbot",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/rag-chatbot.jpg",
    readme_content: null,
    date_label: "December 2024",
    button_config: {},
    featured: true,
    visible: true,
    display_order: 4,
    created_at: "2024-12-15T00:00:00Z",
    updated_at: "2024-12-15T00:00:00Z",
  },
  {
    id: "p-005",
    title: "Aabhar Ecom",
    slug: "aabhar-ecom",
    description:
      "Premium jewelry e-commerce with elegant UI, product galleries, secure checkout & Razorpay payment integration.",
    category: "Full Stack",
    sub_category: "Web Applications",
    tags: ["React", "Node.js", "Express", "MySQL", "Razorpay"],
    github_url: "https://github.com/Misrilal-Sah/aabhar",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/jwellery.jpg",
    readme_content: null,
    date_label: "November 2024",
    button_config: {},
    featured: true,
    visible: true,
    display_order: 5,
    created_at: "2024-11-01T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
  },
  {
    id: "p-006",
    title: "PharmaDesk",
    slug: "pharmadesk",
    description:
      "Pharmacy Management System for clinics — prescriptions, inventory tracking, billing & reporting with role-based access.",
    category: "Full Stack",
    sub_category: "Web Applications",
    tags: ["React", "Node.js", "Express", "MySQL"],
    github_url: "https://github.com/Misrilal-Sah/pharmadesk",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/pharmacy.jpg",
    readme_content: null,
    date_label: "October 2024",
    button_config: {},
    featured: true,
    visible: true,
    display_order: 6,
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-01T00:00:00Z",
  },
  {
    id: "p-007",
    title: "MediFlow",
    slug: "mediflow",
    description:
      "Hospital management system — patients, appointments, billing & workflows with comprehensive dashboard.",
    category: "Full Stack",
    sub_category: "Web Applications",
    tags: ["Python", "Flask", "MySQL", "Jinja2"],
    github_url: "https://github.com/Misrilal-Sah/mediflow",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/mediflow.jpg",
    readme_content: null,
    date_label: "September 2024",
    button_config: {},
    featured: true,
    visible: true,
    display_order: 7,
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2024-09-01T00:00:00Z",
  },
  {
    id: "p-008",
    title: "TaskFlow V2",
    slug: "taskflow-v2",
    description:
      "AI-powered task manager with offline-first architecture, smart categorization, natural language input & analytics.",
    category: "Vanilla JS",
    sub_category: "Web Applications",
    tags: ["Vanilla JS", "Supabase", "PostgreSQL", "Groq AI", "PWA"],
    github_url: "https://github.com/Misrilal-Sah/taskflow",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/taskflow.jpg",
    readme_content: null,
    date_label: "August 2024",
    button_config: {},
    featured: true,
    visible: true,
    display_order: 8,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "p-009",
    title: "SkyCast",
    slug: "skycast",
    description:
      "Modern weather app — real-time conditions, hourly & 7-day forecasts with beautiful responsive UI.",
    category: "Vue.js",
    sub_category: "Web Applications",
    tags: ["Vue.js", "Vite", "OpenWeather API"],
    github_url: "https://github.com/Misrilal-Sah/skycast",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/skycast.jpg",
    readme_content: null,
    date_label: "July 2024",
    button_config: {},
    featured: true,
    visible: true,
    display_order: 9,
    created_at: "2024-07-01T00:00:00Z",
    updated_at: "2024-07-01T00:00:00Z",
  },
  {
    id: "p-010",
    title: "Netflix Clone",
    slug: "netflix-clone",
    description:
      "Full-featured Netflix UI clone with authentication, movie browsing, and responsive design.",
    category: "Full Stack",
    sub_category: "Web Applications",
    tags: ["Vue.js", "Node.js", "SQLite"],
    github_url: "https://github.com/Misrilal-Sah/netflix-clone",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/netflix-clone.jpg",
    readme_content: null,
    date_label: "June 2024",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 10,
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "p-011",
    title: "File Manipulation Tool",
    slug: "file-manipulation-tool",
    description:
      "PDF merging, splitting, organizing & converting with intuitive UI — the ultimate free document toolkit.",
    category: "Full Stack",
    sub_category: "Web Applications",
    tags: ["TypeScript", "PDF.js", "React"],
    github_url: "https://github.com/Misrilal-Sah/pdfease",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/file-compressor.jpg",
    readme_content: null,
    date_label: "May 2024",
    button_config: {},
    featured: true,
    visible: true,
    display_order: 11,
    created_at: "2024-05-01T00:00:00Z",
    updated_at: "2024-05-01T00:00:00Z",
  },
  {
    id: "p-012",
    title: "Color Detection Pro",
    slug: "color-detection-pro",
    description:
      "Desktop app for intelligent color detection via image upload & live camera — detect, convert, match, mix, extract color systems.",
    category: "Python",
    sub_category: "Desktop Applications",
    tags: ["Python", "OpenCV", "CustomTkinter", "Machine Learning"],
    github_url: "https://github.com/Misrilal-Sah/color-detection-pro",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/color-detection.jpg",
    readme_content: null,
    date_label: "April 2024",
    button_config: {},
    featured: true,
    visible: true,
    display_order: 12,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "p-013",
    title: "Portfolio",
    slug: "portfolio-laravel",
    description:
      "Personal developer portfolio — showcasing projects, skills & experience with elegant Laravel-powered backend.",
    category: "Full Stack",
    sub_category: "Web Applications",
    tags: ["PHP", "Laravel", "Vue.js", "MySQL"],
    github_url: "https://github.com/Misrilal-Sah/portfolio",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/portfolio.jpg",
    readme_content: null,
    date_label: "March 2024",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 13,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  // ─── Other Web Apps ───────────────────────────────────────────
  {
    id: "p-014",
    title: "Multi-Mode Smart Calculator",
    slug: "multi-mode-calculator",
    description:
      "7 calculator modes — basic, scientific, currency converter with live rates, unit converter, BMI, date calculator, and bill splitter. PWA-enabled with 7 themes.",
    category: "React",
    sub_category: "Web Applications",
    tags: ["React", "Vite", "PWA", "CSS3"],
    github_url: "https://github.com/Misrilal-Sah/multi-mode-calculator",
    demo_url: "https://Misrilal-Sah.github.io/multi-mode-calculator",
    download_url: null,
    screenshot_url: "/images/Projects/calculator.jpg",
    readme_content: null,
    date_label: "February 2024",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 14,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "p-015",
    title: "CurrencyX",
    slug: "currencyx",
    description:
      "A simple currency converter that allows users to convert between different currencies using real-time exchange rates.",
    category: "React",
    sub_category: "Web Applications",
    tags: ["JavaScript", "API"],
    github_url: "https://github.com/Misrilal-Sah/currencyx",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/currency-converter.jpg",
    readme_content: null,
    date_label: "August 2024",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 15,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "p-016",
    title: "Chess Clock",
    slug: "chess-clock",
    description:
      "Professional chess clock with sub-millisecond timing, beautiful dual-theme UI, and zero dependencies. Pure vanilla JS.",
    category: "Vanilla JS",
    sub_category: "Web Applications",
    tags: ["HTML5", "CSS3", "JavaScript", "Web Audio API"],
    github_url: "https://github.com/Misrilal-Sah/chess-clock",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/chess-clock.jpg",
    readme_content: null,
    date_label: "January 2024",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 16,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "p-017",
    title: "Retro Game Arcade",
    slug: "retro-game-arcade",
    description:
      "A hand-crafted collection of 20 classic games — Tetris, Snake, Pac-Man, Breakout, and more. Pure JavaScript with retro pixel aesthetics.",
    category: "Vanilla JS",
    sub_category: "Web Applications",
    tags: ["JavaScript", "Canvas", "Game Development"],
    github_url: "https://github.com/Misrilal-Sah/retro-arcade",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/tic-tac.jpg",
    readme_content: null,
    date_label: "December 2023",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 17,
    created_at: "2023-12-01T00:00:00Z",
    updated_at: "2023-12-01T00:00:00Z",
  },
  {
    id: "p-018",
    title: "Typing Practice",
    slug: "typing-practice",
    description:
      "A web application designed to help users improve their typing speed and accuracy with various exercises and timed challenges.",
    category: "Vanilla JS",
    sub_category: "Web Applications",
    tags: ["HTML", "CSS", "Bootstrap", "JavaScript"],
    github_url: "https://github.com/Misrilal-Sah/typing-practice",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/typing-practice.jpg",
    readme_content: null,
    date_label: "April 2021",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 18,
    created_at: "2021-04-01T00:00:00Z",
    updated_at: "2021-04-01T00:00:00Z",
  },
  // ─── VS Code Extensions ──────────────────────────────────────
  {
    id: "p-019",
    title: "Insert Utilities",
    slug: "insert-utilities",
    description:
      "The all-in-one text generator for developers — generate UUID, Lorem Ipsum & more instantly inside VS Code.",
    category: "VS Code Extension",
    sub_category: "Extensions",
    tags: ["TypeScript", "VS Code API", "Extension"],
    github_url: "https://github.com/Misrilal-Sah/insert-utilities",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/insert-utilities.jpg",
    readme_content: null,
    date_label: "Published",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 19,
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "p-020",
    title: "Path Master",
    slug: "path-master",
    description:
      "Stop hunting for file paths. Copy file paths instantly from anywhere in your project — published on VS Code marketplace.",
    category: "VS Code Extension",
    sub_category: "Extensions",
    tags: ["TypeScript", "VS Code API", "Extension"],
    github_url: "https://github.com/Misrilal-Sah/path-master",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/path-master.jpg",
    readme_content: null,
    date_label: "Published",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 20,
    created_at: "2024-05-01T00:00:00Z",
    updated_at: "2024-05-01T00:00:00Z",
  },
  {
    id: "p-021",
    title: "Trailing Spaces Pro",
    slug: "trailing-spaces-pro",
    description:
      "The prettiest way to keep your code clean — automated trailing space detection & removal for VS Code.",
    category: "VS Code Extension",
    sub_category: "Extensions",
    tags: ["TypeScript", "VS Code API", "Extension"],
    github_url: "https://github.com/Misrilal-Sah/trailing-spaces-pro",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/trailing-spaces.jpg",
    readme_content: null,
    date_label: "Published",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 21,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "p-022",
    title: "Cursor Voice Assistant",
    slug: "cursor-voice-assistant",
    description:
      "Capture microphone input directly inside VS Code using Windows built-in speech recognition — transcribed text lands on your clipboard, ready to paste into Cursor AI chat.",
    category: "VS Code Extension",
    sub_category: "Extensions",
    tags: ["TypeScript", "VS Code API", "Speech Recognition"],
    github_url: "https://github.com/Misrilal-Sah/cursor-voice-assistant",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/cursor-voice.jpg",
    readme_content: null,
    date_label: "Unpublished",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 22,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  // ─── Chrome Extensions ────────────────────────────────────────
  {
    id: "p-023",
    title: "Design Inspector Pro",
    slug: "design-inspector-pro",
    description:
      "Webpage visual analyzer for colors, typography & layout — extract colors, decode typography, copy CSS without leaving the page.",
    category: "Chrome Extension",
    sub_category: "Extensions",
    tags: ["Chrome Extension", "JavaScript", "CSS"],
    github_url: "https://github.com/Misrilal-Sah/design-inspector-pro",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/design-inspector.jpg",
    readme_content: null,
    date_label: "Published",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 23,
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2024-09-01T00:00:00Z",
  },
  {
    id: "p-024",
    title: "GlobeSync",
    slug: "globesync",
    description:
      "Instant timezone & currency converter for professionals — published on Chrome Web Store.",
    category: "Chrome Extension",
    sub_category: "Extensions",
    tags: ["Chrome Extension", "JavaScript", "API"],
    github_url: "https://github.com/Misrilal-Sah/globesync",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/globesync.jpg",
    readme_content: null,
    date_label: "Published",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 24,
    created_at: "2024-08-01T00:00:00Z",
    updated_at: "2024-08-01T00:00:00Z",
  },
  {
    id: "p-025",
    title: "Screenshot Master",
    slug: "screenshot-master",
    description:
      "Full-page & region screenshots with annotation tools — capture, annotate, and export directly from the browser.",
    category: "Chrome Extension",
    sub_category: "Extensions",
    tags: ["Chrome Extension", "JavaScript", "Canvas"],
    github_url: "https://github.com/Misrilal-Sah/screenshot-master",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/screenshot-master.jpg",
    readme_content: null,
    date_label: "Published",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 25,
    created_at: "2024-07-01T00:00:00Z",
    updated_at: "2024-07-01T00:00:00Z",
  },
  {
    id: "p-026",
    title: "GrammarGenius Pro",
    slug: "grammargenius-pro",
    description:
      "AI grammar & email fixer powered by Groq, Gemini & GitHub Models — published on Chrome Web Store.",
    category: "Chrome Extension",
    sub_category: "Extensions",
    tags: ["Chrome Extension", "JavaScript", "Multi-AI", "Groq", "Gemini"],
    github_url: "https://github.com/Misrilal-Sah/grammargenius-pro",
    demo_url: null,
    download_url: null,
    screenshot_url: "/images/Projects/grammargenius.jpg",
    readme_content: null,
    date_label: "Published",
    button_config: {},
    featured: false,
    visible: true,
    display_order: 26,
    created_at: "2024-06-15T00:00:00Z",
    updated_at: "2024-06-15T00:00:00Z",
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
