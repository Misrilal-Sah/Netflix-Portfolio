import {
  siJavascript,
  siTypescript,
  siReact,
  siNextdotjs,
  siVuedotjs,
  siTailwindcss,
  siHtml5,
  siCss,
  siNodedotjs,
  siPhp,
  siLaravel,
  siPython,
  siFastapi,
  siPostgresql,
  siMysql,
  siMongodb,
  siSupabase,
  siDocker,
  siGit,
  siGithub,
  siVercel,
  siFramer,
  siRedis,
  siNginx,
  siExpress,
  siPrisma,
} from "simple-icons";

interface SkillIconData {
  path: string;
  hex: string;
}

// Skills with very dark brand colors get a white override for dark-bg visibility
const ICON_MAP: Record<string, SkillIconData> = {
  JavaScript:      { path: siJavascript.path, hex: siJavascript.hex },
  TypeScript:      { path: siTypescript.path, hex: siTypescript.hex },
  React:           { path: siReact.path,      hex: siReact.hex },
  "Next.js":       { path: siNextdotjs.path,  hex: "E2E2E2" },     // black → light
  "Vue.js":        { path: siVuedotjs.path,   hex: siVuedotjs.hex },
  "Tailwind CSS":  { path: siTailwindcss.path, hex: siTailwindcss.hex },
  HTML5:           { path: siHtml5.path,      hex: siHtml5.hex },
  "HTML5 / CSS3":  { path: siHtml5.path,      hex: siHtml5.hex },
  CSS3:            { path: siCss.path,        hex: siCss.hex },
  "Node.js":       { path: siNodedotjs.path,  hex: siNodedotjs.hex },
  PHP:             { path: siPhp.path,        hex: siPhp.hex },
  "PHP / Laravel": { path: siLaravel.path,    hex: siLaravel.hex },
  Laravel:         { path: siLaravel.path,    hex: siLaravel.hex },
  Python:          { path: siPython.path,     hex: siPython.hex },
  FastAPI:         { path: siFastapi.path,    hex: siFastapi.hex },
  PostgreSQL:      { path: siPostgresql.path, hex: siPostgresql.hex },
  MySQL:           { path: siMysql.path,      hex: siMysql.hex },
  MongoDB:         { path: siMongodb.path,    hex: siMongodb.hex },
  Supabase:        { path: siSupabase.path,   hex: siSupabase.hex },
  Docker:          { path: siDocker.path,     hex: siDocker.hex },
  Git:             { path: siGit.path,        hex: siGit.hex },
  "Git / GitHub":  { path: siGit.path,        hex: siGit.hex },
  GitHub:          { path: siGithub.path,     hex: "E2E2E2" },     // very dark → light
  Vercel:          { path: siVercel.path,     hex: "E2E2E2" },     // black → light
  "Framer Motion": { path: siFramer.path,     hex: siFramer.hex },
  Framer:          { path: siFramer.path,     hex: siFramer.hex },
  Redis:           { path: siRedis.path,      hex: siRedis.hex },
  Nginx:           { path: siNginx.path,      hex: siNginx.hex },
  Express:         { path: siExpress.path,    hex: "E2E2E2" },
  "Express.js":    { path: siExpress.path,    hex: "E2E2E2" },
  Prisma:          { path: siPrisma.path,     hex: "E2E2E2" },
};

export function getSkillIcon(name: string): SkillIconData | null {
  return ICON_MAP[name] ?? ICON_MAP[name.trim()] ?? null;
}
