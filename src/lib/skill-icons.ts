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
  siFlask,
  siFigma,
  siPostman,
  siVscodium,
  siStripe,
  siRazorpay,
  siRender,
  siRailway,
  siYii,
  siGooglegemini,
  siOpencv,
  siLangchain,
} from "simple-icons";

interface SkillIconData {
  path: string;
  hex: string;
}

// Skills with very dark brand colors get a light override for dark-bg visibility
const ICON_MAP: Record<string, SkillIconData> = {
  // Frontend
  JavaScript:        { path: siJavascript.path,  hex: siJavascript.hex },
  TypeScript:        { path: siTypescript.path,  hex: siTypescript.hex },
  React:             { path: siReact.path,       hex: siReact.hex },
  "React JS":        { path: siReact.path,       hex: siReact.hex },
  "Next.js":         { path: siNextdotjs.path,   hex: "E2E2E2" },      // black → light
  NextJS:            { path: siNextdotjs.path,   hex: "E2E2E2" },
  "Vue.js":          { path: siVuedotjs.path,    hex: siVuedotjs.hex },
  VueJS:             { path: siVuedotjs.path,    hex: siVuedotjs.hex },
  "Tailwind CSS":    { path: siTailwindcss.path, hex: siTailwindcss.hex },
  HTML5:             { path: siHtml5.path,       hex: siHtml5.hex },
  "HTML5 / CSS3":    { path: siHtml5.path,       hex: siHtml5.hex },
  "HTML/CSS":        { path: siHtml5.path,       hex: siHtml5.hex },
  CSS3:              { path: siCss.path,         hex: siCss.hex },
  "Framer Motion":   { path: siFramer.path,      hex: siFramer.hex },
  Framer:            { path: siFramer.path,      hex: siFramer.hex },

  // Backend
  "Node.js":         { path: siNodedotjs.path,   hex: siNodedotjs.hex },  // green hexagon
  "Node JS":         { path: siNodedotjs.path,   hex: siNodedotjs.hex },
  NodeJS:            { path: siNodedotjs.path,   hex: siNodedotjs.hex },
  nodejs:            { path: siNodedotjs.path,   hex: siNodedotjs.hex },
  Node:              { path: siNodedotjs.path,   hex: siNodedotjs.hex },
  PHP:               { path: siPhp.path,         hex: siPhp.hex },
  "PHP / Laravel":   { path: siLaravel.path,     hex: siLaravel.hex },
  Laravel:           { path: siLaravel.path,     hex: siLaravel.hex },
  Python:            { path: siPython.path,      hex: siPython.hex },
  FastAPI:           { path: siFastapi.path,     hex: siFastapi.hex },
  Express:           { path: siExpress.path,     hex: "E2E2E2" },      // black → light
  "Express.js":      { path: siExpress.path,     hex: "E2E2E2" },
  Flask:             { path: siFlask.path,       hex: siFlask.hex },

  // Database
  PostgreSQL:        { path: siPostgresql.path,  hex: siPostgresql.hex },
  MySQL:             { path: siMysql.path,       hex: siMysql.hex },
  MongoDB:           { path: siMongodb.path,     hex: siMongodb.hex },
  Supabase:          { path: siSupabase.path,    hex: siSupabase.hex },
  Prisma:            { path: siPrisma.path,      hex: "E2E2E2" },      // black → light
  Redis:             { path: siRedis.path,       hex: siRedis.hex },

  // DevOps / Cloud
  Docker:            { path: siDocker.path,      hex: siDocker.hex },
  Git:               { path: siGit.path,         hex: siGit.hex },
  "Git / GitHub":    { path: siGit.path,         hex: siGit.hex },
  GitHub:            { path: siGithub.path,      hex: "E2E2E2" },      // very dark → light
  Vercel:            { path: siVercel.path,      hex: "E2E2E2" },      // black → light
  // AWS uses a custom inline path (official AWS smile/arrow wordmark, 24×24 viewBox)
  AWS:               { path: "M6.578 11.578c-.36.181-.563.55-.422.906l.328.781c.14.344.531.516.906.406l.266-.093c.422-.141.859-.297 1.297-.47.594 1.204 1.484 2.298 2.578 3.095-.985.234-2.047.343-3.125.25-.406-.032-.719.25-.734.656-.016.531.453.719.39 1.032-.047.25.095.578.376.671C8 18.813 8 18.813 8 18.813s2.266 1.594 5.625 1.484c3.485-.11 6.063-2.188 6.063-2.188.156-.125.14-.218.078-.296-.063-.079-.188-.11-.313-.079-.39.094-1.641.313-2.875.282-1.75-.047-3.344-.532-4.453-1.532A9.3 9.3 0 0 0 14.016 15c.578-.14 1.14-.313 1.671-.516l.25-.125c.375-.172.547-.563.406-.922l-.313-.781c-.14-.344-.531-.516-.906-.406l-.234.078a14.7 14.7 0 0 1-1.593.438 9.1 9.1 0 0 1-.407-2.61c0-.905.141-1.78.407-2.608.53.14 1.062.281 1.593.437l.234.079c.375.11.766-.063.906-.407l.313-.78c.14-.36-.031-.75-.406-.923l-.25-.125a14.3 14.3 0 0 0-1.671-.516 9.3 9.3 0 0 0 1.89-1.483c1.11-1 2.704-1.485 4.454-1.532 1.234-.031 2.484.188 2.875.281.125.032.25 0 .313-.078.062-.078.078-.172-.078-.297 0 0-2.578-2.078-6.063-2.188C12.562 3.594 10.297 5.188 10.297 5.188l-.016.015c.031.203-.14.453-.375.5-.063.016-.235.016-.282.016-1.093.797-1.984 1.89-2.578 3.093-.437-.171-.875-.328-1.297-.468l-.266-.094c-.375-.11-.765.063-.906.406l-.328.782c-.14.359.063.724.422.906l.36.172c.36.172.72.328 1.094.469a9.8 9.8 0 0 0 0 2.437 18 18 0 0 0-1.094.47zm0 0", hex: "FF9900" },
  Render:            { path: siRender.path,      hex: siRender.hex },
  Railway:           { path: siRailway.path,     hex: "E2E2E2" },      // black → light
  Nginx:             { path: siNginx.path,       hex: siNginx.hex },

  // AI / ML
  LangChain:         { path: siLangchain.path,   hex: siLangchain.hex },
  "Gemini AI":       { path: siGooglegemini.path, hex: siGooglegemini.hex },
  Gemini:            { path: siGooglegemini.path, hex: siGooglegemini.hex },
  "Google Gemini":   { path: siGooglegemini.path, hex: siGooglegemini.hex },
  OpenCV:            { path: siOpencv.path,      hex: siOpencv.hex },

  // Frameworks
  YII2:              { path: siYii.path,         hex: siYii.hex },
  Yii2:              { path: siYii.path,         hex: siYii.hex },
  YII:               { path: siYii.path,         hex: siYii.hex },

  // Payments
  Stripe:            { path: siStripe.path,      hex: siStripe.hex },
  Razorpay:          { path: siRazorpay.path,    hex: "3395FF" },      // brand navy → visible bright blue

  // Tools
  Figma:             { path: siFigma.path,       hex: siFigma.hex },
  Postman:           { path: siPostman.path,     hex: siPostman.hex },
  "VS Code":         { path: siVscodium.path,    hex: "25B7F5" },      // VSCodium shape, blue

  // Custom / not in simple-icons (ChromaDB — orange brand color with custom path)
  ChromaDB:          { path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z", hex: "E8461E" },

  // RAG, GenAI, Machine Learning — no official icon exists; they will show the Code2 placeholder
};

// Case-insensitive fallback map
const ICON_MAP_LOWER = Object.fromEntries(
  Object.entries(ICON_MAP).map(([k, v]) => [k.toLowerCase(), v])
);

export function getSkillIcon(name: string): SkillIconData | null {
  // Exact match first, then trimmed, then case-insensitive
  return (
    ICON_MAP[name] ??
    ICON_MAP[name.trim()] ??
    ICON_MAP_LOWER[name.toLowerCase()] ??
    ICON_MAP_LOWER[name.trim().toLowerCase()] ??
    null
  );
}
