/**
 * migrate-assets.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * One-time migration: uploads all local public/ images and files to Supabase
 * Storage (bucket: portfolio-images), then rewrites every local path URL in
 * the database to the new Supabase Storage public URL.
 *
 * What gets migrated:
 *   public/images/**  → storage path:  images/…
 *   public/files/**   → storage path:  files/…
 *   public/others/**  → storage path:  others/…
 *
 * Database columns updated (local path → Supabase URL):
 *   projects.screenshot_url
 *   skills.icon_url
 *   certifications.logo_url
 *   about_sections.image_url
 *   site_settings.value   (JSONB — any nested string matching a local path)
 *   contact_info.value    (JSONB — any nested string matching a local path)
 *
 * Usage:
 *   node scripts/migrate-assets.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFile, readdir, stat } from 'fs/promises';
import { extname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = join(__dir, '..');

// ── Load .env.local ──────────────────────────────────────────────────────────
let envContent;
try {
  envContent = await readFile(join(ROOT, '.env.local'), 'utf8');
} catch {
  console.error('✗ .env.local not found. Create it with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}
const env = Object.fromEntries(
  envContent.split(/\r?\n/)
    .map(l => l.match(/^([^#=\s][^=]*)=(.+)$/))
    .filter(Boolean)
    .map(m => [m[1].trim(), m[2].trim()])
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET       = 'portfolio-images';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── MIME type map ────────────────────────────────────────────────────────────
const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png',  '.gif': 'image/gif',
  '.webp': 'image/webp','.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};
function mimeFor(file) {
  return MIME[extname(file).toLowerCase()] ?? 'application/octet-stream';
}

// ── Scan a directory recursively, return [{localUrlPath, absPath}] ───────────
async function scanDir(dir, baseRelativeToPublic) {
  const results = [];
  let entries;
  try { entries = await readdir(dir); } catch { return results; }
  for (const entry of entries) {
    const full = join(dir, entry);
    const s = await stat(full);
    if (s.isDirectory()) {
      results.push(...await scanDir(full, join(baseRelativeToPublic, entry)));
    } else {
      // localUrlPath e.g. /images/Projects/calculator.jpg
      const localUrlPath = '/' + join(baseRelativeToPublic, entry).replace(/\\/g, '/');
      results.push({ localUrlPath, absPath: full });
    }
  }
  return results;
}

// ── Upload a file to Supabase Storage ────────────────────────────────────────
async function uploadFile(storagePath, absPath) {
  const content = await readFile(absPath);
  const mime    = mimeFor(absPath);
  const { data, error } = await db.storage
    .from(BUCKET)
    .upload(storagePath, content, { contentType: mime, upsert: true });
  if (error) throw new Error(`Upload failed for ${storagePath}: ${error.message}`);
  const { data: { publicUrl } } = db.storage.from(BUCKET).getPublicUrl(data.path);
  return publicUrl;
}

// ── Recursively replace matching local URL strings in a JSON value ───────────
function replaceUrlsInJson(value, urlMap) {
  if (typeof value === 'string') return urlMap.get(value) ?? value;
  if (Array.isArray(value))      return value.map(v => replaceUrlsInJson(v, urlMap));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, replaceUrlsInJson(v, urlMap)])
    );
  }
  return value;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
console.log('\n🚀  Portfolio Asset Migration\n');

// 1. Scan local dirs
const publicDir = join(ROOT, 'public');
const files = [
  ...await scanDir(join(publicDir, 'images'), 'images'),
  ...await scanDir(join(publicDir, 'files'),  'files'),
  ...await scanDir(join(publicDir, 'others'), 'others'),
];
console.log(`[1/3] Found ${files.length} assets to upload\n`);

// 2. Upload each file and build URL map: localUrlPath → supabasePublicUrl
/** @type {Map<string, string>} */
const urlMap = new Map();
let uploaded = 0, skipped = 0;

for (const { localUrlPath, absPath } of files) {
  // storagePath strips leading slash: "images/Projects/calculator.jpg"
  const storagePath = localUrlPath.replace(/^\//, '');
  try {
    const publicUrl = await uploadFile(storagePath, absPath);
    urlMap.set(localUrlPath, publicUrl);
    console.log(`  ✓ ${localUrlPath}`);
    uploaded++;
  } catch (err) {
    console.warn(`  ✗ ${localUrlPath}: ${err.message}`);
    skipped++;
  }
}
console.log(`\n  Uploaded: ${uploaded}  Skipped/failed: ${skipped}\n`);

if (urlMap.size === 0) {
  console.log('No URLs to update in database — done.');
  process.exit(0);
}

// 3. Update database records
console.log('[3/3] Updating database records…\n');
let totalUpdated = 0;

// Helper: update a simple URL column in a table
async function updateColumn(table, idCol, idVal, col, newUrl) {
  const { error } = await db.from(table).update({ [col]: newUrl }).eq(idCol, idVal);
  if (error) console.warn(`  ✗ ${table}[${idVal}].${col}: ${error.message}`);
  else { console.log(`  ✓ ${table} → ${col}: ${newUrl.slice(0, 80)}…`); totalUpdated++; }
}

// projects.screenshot_url
{
  const { data: rows } = await db.from('projects').select('id, screenshot_url');
  for (const row of rows ?? []) {
    if (row.screenshot_url && urlMap.has(row.screenshot_url))
      await updateColumn('projects', 'id', row.id, 'screenshot_url', urlMap.get(row.screenshot_url));
  }
}

// skills.icon_url
{
  const { data: rows } = await db.from('skills').select('id, icon_url');
  for (const row of rows ?? []) {
    if (row.icon_url && urlMap.has(row.icon_url))
      await updateColumn('skills', 'id', row.id, 'icon_url', urlMap.get(row.icon_url));
  }
}

// certifications.logo_url
{
  const { data: rows } = await db.from('certifications').select('id, logo_url');
  for (const row of rows ?? []) {
    if (row.logo_url && urlMap.has(row.logo_url))
      await updateColumn('certifications', 'id', row.id, 'logo_url', urlMap.get(row.logo_url));
  }
}

// about_sections.image_url
{
  const { data: rows } = await db.from('about_sections').select('id, image_url');
  for (const row of rows ?? []) {
    if (row.image_url && urlMap.has(row.image_url))
      await updateColumn('about_sections', 'id', row.id, 'image_url', urlMap.get(row.image_url));
  }
}

// site_settings.value  (JSONB — scan all string values recursively)
{
  const { data: rows } = await db.from('site_settings').select('key, value');
  for (const row of rows ?? []) {
    const newValue = replaceUrlsInJson(row.value, urlMap);
    if (JSON.stringify(newValue) !== JSON.stringify(row.value)) {
      const { error } = await db.from('site_settings').update({ value: newValue }).eq('key', row.key);
      if (error) console.warn(`  ✗ site_settings[${row.key}]: ${error.message}`);
      else { console.log(`  ✓ site_settings → key: ${row.key}`); totalUpdated++; }
    }
  }
}

// contact_info.value  (JSONB — scan all string values recursively)
{
  const { data: rows } = await db.from('contact_info').select('key, value');
  for (const row of rows ?? []) {
    const newValue = replaceUrlsInJson(row.value, urlMap);
    if (JSON.stringify(newValue) !== JSON.stringify(row.value)) {
      const { error } = await db.from('contact_info').update({ value: newValue }).eq('key', row.key);
      if (error) console.warn(`  ✗ contact_info[${row.key}]: ${error.message}`);
      else { console.log(`  ✓ contact_info → key: ${row.key}`); totalUpdated++; }
    }
  }
}

console.log(`\n✅  Migration complete — ${totalUpdated} database record(s) updated.`);
console.log('\nNote: The original files in public/ are still there.');
console.log('Once you verify everything works, you can delete the migrated folders');
console.log('(public/images, public/files, public/others) from your repo.\n');
