/**
 * upload-tudum.mjs
 * One-time script: uploads public/sounds/tudum.mp3 to Supabase Storage.
 * Prints the public URL when done.
 *
 * Usage:
 *   node scripts/upload-tudum.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = join(__dir, '..');

// Load .env.local
let envContent;
try {
  envContent = await readFile(join(ROOT, '.env.local'), 'utf8');
} catch {
  console.error('✗ .env.local not found.');
  process.exit(1);
}
const env = Object.fromEntries(
  envContent.split(/\r?\n/)
    .map(l => l.match(/^([^#=\s][^=]*)=(.+)$/))
    .filter(Boolean)
    .map(m => [m[1].trim(), m[2].trim()])
);

const SUPABASE_URL  = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY   = env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET        = 'portfolio-assets';
const STORAGE_PATH  = 'sounds/tudum.mp3';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// Ensure the bucket exists (public bucket)
const { data: buckets } = await db.storage.listBuckets();
const exists = buckets?.some(b => b.name === BUCKET);
if (!exists) {
  const { error } = await db.storage.createBucket(BUCKET, { public: true });
  if (error) {
    console.error('✗ Failed to create bucket:', error.message);
    process.exit(1);
  }
  console.log(`✓ Created bucket: ${BUCKET}`);
}

// Read and upload the file
const fileBuffer = await readFile(join(ROOT, 'public', 'sounds', 'tudum.mp3'));

const { error: uploadError } = await db.storage
  .from(BUCKET)
  .upload(STORAGE_PATH, fileBuffer, {
    contentType: 'audio/mpeg',
    upsert: true,
  });

if (uploadError) {
  console.error('✗ Upload failed:', uploadError.message);
  process.exit(1);
}

const { data: { publicUrl } } = db.storage.from(BUCKET).getPublicUrl(STORAGE_PATH);

console.log('\n✓ Upload successful!');
console.log(`\nPublic URL:\n  ${publicUrl}`);
console.log(`\nAdd this to .env.local and .env.example:`);
console.log(`  NEXT_PUBLIC_TUDUM_URL=${publicUrl}`);
