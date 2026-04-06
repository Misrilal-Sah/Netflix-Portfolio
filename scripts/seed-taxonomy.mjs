/**
 * Seed project_categories and project_tags tables with default values.
 * Safe to re-run — uses upsert ON CONFLICT (name).
 *
 * Usage: node scripts/seed-taxonomy.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(join(__dir, '../.env.local'), 'utf8');
const env = Object.fromEntries(
  envContent.split(/\r?\n/)
    .map(l => l.match(/^([^#=]+)=(.+)$/))
    .filter(Boolean)
    .map(m => [m[1].trim(), m[2].trim()])
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── DATA ────────────────────────────────────────────────────────────────────

const categories = [
  'Full Stack', 'Python', 'React', 'Vanilla JS',
  'Vue.js', 'Laravel', 'Chrome Extension', 'VS Code Extension',
].map((name, i) => ({ name, display_order: i, visible: true }));

const tags = [
  'React', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'FastAPI',
  'MySQL', 'Express', 'Vue.js', 'Chrome Extension', 'VS Code API', 'PWA',
  'LangChain', 'RAG', 'OpenCV', 'CSS3', 'HTML5', 'Vite', 'Supabase',
  'Multi-AI', 'ChromaDB', 'Groq', 'Flask', 'Laravel', 'PHP', 'Canvas',
  'Machine Learning', 'Extension', 'Razorpay', 'Multi-LLM', 'Prisma',
  'GenAI', 'Gemini', 'MongoDB', 'PDF.js', 'API',
].map((name, i) => ({ name, display_order: i, visible: true }));

// ─── UPSERT ──────────────────────────────────────────────────────────────────

console.log('Seeding project_categories…');
const { error: catErr } = await db
  .from('project_categories')
  .upsert(categories, { onConflict: 'name' });

if (catErr) {
  console.error('✗ Categories failed:', catErr.message);
  process.exit(1);
}
console.log(`  ✓ ${categories.length} categories upserted`);

console.log('Seeding project_tags…');
const { error: tagErr } = await db
  .from('project_tags')
  .upsert(tags, { onConflict: 'name' });

if (tagErr) {
  console.error('✗ Tags failed:', tagErr.message);
  process.exit(1);
}
console.log(`  ✓ ${tags.length} tags upserted`);

console.log('\n✓ Done! Refresh the admin projects page to see your categories and tags.');
