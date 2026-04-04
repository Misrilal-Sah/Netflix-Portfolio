/**
 * Portfolio Admin Setup Script
 * Automates all 4 manual setup steps:
 *   1. Seed database (profiles, projects, skills, certs, experience, about, content_variants, site_settings)
 *   2. Create Supabase Storage bucket 'portfolio-images' (public)
 *   3. Create admin user
 *   4. Verify everything is reachable
 *
 * Usage: node scripts/setup.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// ── Read .env.local ──────────────────────────────────────────────────────────
const envContent = readFileSync(join(__dir, '../.env.local'), 'utf8');
const env = Object.fromEntries(
  envContent.split(/\r?\n/)
    .map(l => l.match(/^([^#=]+)=(.+)$/))
    .filter(Boolean)
    .map(m => [m[1].trim(), m[2].trim()])
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL  = 'misrilalsah09@gmail.com';
const ADMIN_PASS   = 'Portfolio@Admin2026';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ok   = (msg)      => console.log(`  ✓ ${msg}`);
const skip = (msg)      => console.log(`  ─ ${msg}`);
const fail = (msg, err) => { console.error(`  ✗ ${msg}: ${err?.message ?? JSON.stringify(err)}`); };

// ─── STEP 1: SEED DATABASE ───────────────────────────────────────────────────
console.log('\n[1/4] Seeding database...');

// Profiles
{
  const { error } = await db.from('profiles').upsert([
    { type: 'recruiter',  display_name: 'Recruiter',  description: 'Professional overview focused on skills and experience', avatar_color: '#0078FF' },
    { type: 'developer',  display_name: 'Developer',  description: 'Technical deep-dive into projects and architecture',     avatar_color: '#808080' },
    { type: 'stalker',    display_name: 'Stalker',    description: 'Everything about me — no filter',                        avatar_color: '#E50914' },
    { type: 'adventurer', display_name: 'Adventurer', description: 'The fun side — hobbies, interests, and side quests',     avatar_color: '#F5C518' },
  ], { onConflict: 'type', ignoreDuplicates: true });
  if (error) fail('profiles', error); else ok('Profiles (4)');
}

// Projects
{
  const projects = [
    { title: 'AI Query Master',             slug: 'ai-query-master',         description: 'AI-driven SQL assistant with agentic pipeline — review queries, analyze schemas, generate SQL from plain English, and connect to live databases with self-reflection and RAG-powered intelligence.',        category: 'Full Stack',        tags: ['Python','FastAPI','React','ChromaDB','Supabase','Gemini AI'],  github_url: 'https://github.com/Misrilal-Sah/ai-query-master',     demo_url: null,                                                    screenshot_url: '/images/Projects/file-manipulation.jpg', featured: true,  visible: true, display_order: 1  },
    { title: 'Multi-Mode Smart Calculator', slug: 'multi-mode-calculator',   description: '7 calculator modes — basic, scientific, currency converter with live rates, unit converter, BMI, date calculator, and bill splitter. PWA-enabled with 7 themes.',                                           category: 'React',             tags: ['React','Vite','PWA','CSS3'],                                   github_url: 'https://github.com/Misrilal-Sah/multi-mode-calculator', demo_url: 'https://Misrilal-Sah.github.io/multi-mode-calculator',  screenshot_url: '/images/Projects/calculator.jpg',        featured: true,  visible: true, display_order: 2  },
    { title: 'Code Review Agent',           slug: 'code-review-agent',       description: 'AI-powered code review and RAG knowledge agent — autonomous, reflective, multi-LLM, CLI-first. 24 AST rule checks with 3-iteration self-reflection.',                                                       category: 'Python',            tags: ['Python','Gemini AI','LangChain','ChromaDB','Groq'],            github_url: 'https://github.com/Misrilal-Sah/code-review',          demo_url: null,                                                    screenshot_url: '/images/Projects/file-compressor.jpg',   featured: true,  visible: true, display_order: 3  },
    { title: 'Chess Clock',                 slug: 'chess-clock',             description: 'Professional chess clock with sub-millisecond timing, beautiful dual-theme UI, and zero dependencies. Pure vanilla JS — no frameworks, no install.',                                                       category: 'Vanilla JS',        tags: ['HTML5','CSS3','JavaScript','Web Audio API'],                   github_url: 'https://github.com/Misrilal-Sah/chess-clock',          demo_url: null,                                                    screenshot_url: '/images/Projects/chess-clock.jpg',       featured: false, visible: true, display_order: 4  },
    { title: 'Color Detection Pro',         slug: 'color-detection-pro',     description: 'Offline desktop color intelligence with OpenCV + ML — detect, convert, match, mix, extract, and build color systems from images or live camera feed.',                                                    category: 'Python',            tags: ['Python','OpenCV','CustomTkinter','Machine Learning'],          github_url: 'https://github.com/Misrilal-Sah/color-detection-pro',  demo_url: null,                                                    screenshot_url: '/images/Projects/color-detection.jpg',   featured: false, visible: true, display_order: 5  },
    { title: 'CurrencyX',                   slug: 'currencyx',               description: 'Premium currency converter with real-time exchange rates, beautiful UI, and offline support.',                                                                                                              category: 'React',             tags: ['React','API Integration','PWA'],                               github_url: 'https://github.com/Misrilal-Sah/currencyx',            demo_url: null,                                                    screenshot_url: '/images/Projects/currency-converter.jpg', featured: false, visible: true, display_order: 6  },
    { title: 'Design Inspector Pro',        slug: 'design-inspector-pro',    description: 'Chrome extension for pixel-perfect design inspection — extract colors, decode typography, copy CSS — all without leaving the page.',                                                                       category: 'Chrome Extension',  tags: ['Chrome Extension','JavaScript','CSS'],                         github_url: 'https://github.com/Misrilal-Sah/design-inspector-pro', demo_url: null,                                                    screenshot_url: '/images/Projects/file-manipulation.jpg', featured: true,  visible: true, display_order: 7  },
    { title: 'PDFease',                     slug: 'pdfease',                 description: 'The ultimate free PDF and document toolkit — merge, split, compress, convert, and manipulate PDFs with a clean modern interface.',                                                                          category: 'Full Stack',        tags: ['React','Node.js','PDF Processing'],                            github_url: 'https://github.com/Misrilal-Sah/pdfease',              demo_url: null,                                                    screenshot_url: '/images/Projects/file-compressor.jpg',   featured: false, visible: true, display_order: 8  },
    { title: 'Retro Game Arcade',           slug: 'retro-game-arcade',       description: 'A hand-crafted collection of 20 classic games — Tetris, Snake, Pac-Man, Breakout, and more. Pure JavaScript with retro pixel aesthetics.',                                                               category: 'Vanilla JS',        tags: ['JavaScript','Canvas','Game Development'],                     github_url: 'https://github.com/Misrilal-Sah/retro-arcade',         demo_url: null,                                                    screenshot_url: '/images/Projects/tic-tac.jpg',           featured: false, visible: true, display_order: 9  },
    { title: 'AABHAR Jewellery',            slug: 'aabhar-jewellery',        description: 'Premium jewellery e-commerce platform with product catalog, shopping cart, and payment integration. Built with modern design patterns.',                                                                    category: 'Laravel',           tags: ['Laravel','PHP','MySQL','E-Commerce'],                          github_url: 'https://github.com/Misrilal-Sah/aabhar',               demo_url: null,                                                    screenshot_url: '/images/Projects/jwellery.jpg',          featured: false, visible: true, display_order: 10 },
    { title: 'PharmaDesk',                  slug: 'pharmadesk',              description: 'Modern pharmacy management system — inventory tracking, prescription management, billing, and reporting with role-based access.',                                                                           category: 'Full Stack',        tags: ['React','Node.js','MongoDB','Express'],                         github_url: 'https://github.com/Misrilal-Sah/pharmadesk',           demo_url: null,                                                    screenshot_url: '/images/Projects/pharmacy.jpg',          featured: false, visible: true, display_order: 11 },
    { title: 'Screenshot Master',           slug: 'screenshot-master',       description: 'Browser extension for capturing, annotating, and exporting screenshots — full page, visible area, or selected region with annotation tools.',                                                             category: 'Chrome Extension',  tags: ['Chrome Extension','JavaScript','Canvas'],                      github_url: 'https://github.com/Misrilal-Sah/screenshot-master',    demo_url: null,                                                    screenshot_url: '/images/Projects/file-manipulation.jpg', featured: false, visible: true, display_order: 12 },
    { title: 'TaskFlow',                    slug: 'taskflow',                description: 'AI-powered offline-first todo experience with smart categorization, natural language input, and beautiful animations.',                                                                                     category: 'React',             tags: ['React','PWA','AI','IndexedDB'],                                github_url: 'https://github.com/Misrilal-Sah/taskflow',             demo_url: null,                                                    screenshot_url: '/images/Projects/file-manipulation.jpg', featured: false, visible: true, display_order: 13 },
    { title: 'Typing Practice',             slug: 'typing-practice',         description: 'Speed, accuracy, consistency — a typing trainer with real-time WPM tracking, customizable text sources, and performance analytics.',                                                                       category: 'Vanilla JS',        tags: ['JavaScript','HTML5','CSS3'],                                   github_url: 'https://github.com/Misrilal-Sah/typing-practice',      demo_url: null,                                                    screenshot_url: '/images/Projects/typing-practice.jpg',   featured: false, visible: true, display_order: 14 },
    { title: 'Insert Utilities',            slug: 'insert-utilities',        description: 'The all-in-one text generator VS Code extension — lorem ipsum, UUIDs, dates, numbers, colors, and more with smart insertion.',                                                                             category: 'VS Code Extension', tags: ['TypeScript','VS Code API','Extension'],                        github_url: 'https://github.com/Misrilal-Sah/insert-utilities',     demo_url: null,                                                    screenshot_url: '/images/Projects/file-manipulation.jpg', featured: false, visible: true, display_order: 15 },
  ];
  const { error } = await db.from('projects').upsert(projects, { onConflict: 'slug', ignoreDuplicates: true });
  if (error) fail('projects', error); else ok('Projects (15)');
}

// Skills — check first to avoid duplicates (no unique constraint besides PK)
{
  const { count } = await db.from('skills').select('*', { count: 'exact', head: true });
  if (count > 0) {
    skip(`Skills (${count} already exist, skipped)`);
  } else {
    const skills = [
      // Frontend
      { name: 'JavaScript',    category: 'Frontend', description: 'ES6+, DOM manipulation, async/await',               display_order: 1, visible: true },
      { name: 'TypeScript',    category: 'Frontend', description: 'Strict typing, generics, type guards',              display_order: 2, visible: true },
      { name: 'React',         category: 'Frontend', description: 'Hooks, Context, Server Components',                 display_order: 3, visible: true },
      { name: 'Next.js',       category: 'Frontend', description: 'App Router, SSR, ISR, API routes',                  display_order: 4, visible: true },
      { name: 'Vue.js',        category: 'Frontend', description: 'Composition API, Vuex, Vue Router',                 display_order: 5, visible: true },
      { name: 'Tailwind CSS',  category: 'Frontend', description: 'Utility-first, v4 @theme, responsive design',       display_order: 6, visible: true },
      { name: 'HTML5 / CSS3',  category: 'Frontend', description: 'Semantic HTML, Flexbox, Grid, animations',          display_order: 7, visible: true },
      { name: 'Framer Motion', category: 'Frontend', description: 'Page transitions, gestures, layout animations',     display_order: 8, visible: true },
      // Backend
      { name: 'Node.js',       category: 'Backend',  description: 'Express, REST APIs, middleware',                    display_order: 1, visible: true },
      { name: 'Python',        category: 'Backend',  description: 'FastAPI, Flask, automation, ML pipelines',          display_order: 2, visible: true },
      { name: 'PHP / Laravel', category: 'Backend',  description: 'MVC, Eloquent ORM, queues, events',                 display_order: 3, visible: true },
      { name: 'FastAPI',       category: 'Backend',  description: 'Async endpoints, Pydantic, OpenAPI',                display_order: 4, visible: true },
      // Database
      { name: 'PostgreSQL',    category: 'Database', description: 'Complex queries, RLS, triggers, indexes',           display_order: 1, visible: true },
      { name: 'MySQL',         category: 'Database', description: 'Joins, stored procedures, optimization',            display_order: 2, visible: true },
      { name: 'MongoDB',       category: 'Database', description: 'Document model, aggregation, Atlas',                display_order: 3, visible: true },
      { name: 'Supabase',      category: 'Database', description: 'Auth, RLS, real-time, storage',                     display_order: 4, visible: true },
      // DevOps
      { name: 'Docker',        category: 'DevOps',   description: 'Containerization, Docker Compose, multi-stage builds', display_order: 1, visible: true },
      { name: 'Git / GitHub',  category: 'DevOps',   description: 'Branching, PRs, CI/CD, Actions',                   display_order: 2, visible: true },
      { name: 'Vercel',        category: 'DevOps',   description: 'Deploy, preview, serverless functions',             display_order: 3, visible: true },
      { name: 'AWS',           category: 'DevOps',   description: 'EC2, S3, Lambda, CloudFront',                       display_order: 4, visible: true },
      // Tools
      { name: 'VS Code',       category: 'Tools',    description: 'Extensions, keybindings, workspace config',         display_order: 1, visible: true },
      { name: 'Figma',         category: 'Tools',    description: 'Design, prototyping, dev handoff',                  display_order: 2, visible: true },
      { name: 'Postman',       category: 'Tools',    description: 'API testing, collections, environments',            display_order: 3, visible: true },
    ];
    const { error } = await db.from('skills').insert(skills);
    if (error) fail('skills', error); else ok('Skills (23)');
  }
}

// Certifications
{
  const { count } = await db.from('certifications').select('*', { count: 'exact', head: true });
  if (count > 0) {
    skip(`Certifications (${count} already exist, skipped)`);
  } else {
    const certs = [
      { title: 'Stripe Certified Professional Developer',                        provider: 'Stripe',             date_earned: '2025-04-01', verification_url: null, display_order: 1, visible: true },
      { title: 'AI Academy Level 3',                                             provider: 'Ciklum',             date_earned: '2025-01-01', verification_url: null, display_order: 2, visible: true },
      { title: 'The Complete Web Developer Course 3.0',                          provider: 'Udemy',              date_earned: '2023-06-01', verification_url: null, display_order: 3, visible: true },
      { title: 'Programming with JavaScript',                                    provider: 'Coursera (Meta)',    date_earned: '2023-03-01', verification_url: null, display_order: 4, visible: true },
      { title: 'Problem Solving (Intermediate)',                                 provider: 'HackerRank',         date_earned: '2023-01-01', verification_url: null, display_order: 5, visible: true },
      { title: 'JavaScript (Intermediate)',                                      provider: 'HackerRank',         date_earned: '2022-11-01', verification_url: null, display_order: 6, visible: true },
      { title: 'Introduction to Web Development with HTML, CSS, JavaScript',    provider: 'Codio (Coursera)',   date_earned: '2022-08-01', verification_url: null, display_order: 7, visible: true },
    ];
    const { error } = await db.from('certifications').insert(certs);
    if (error) fail('certifications', error); else ok('Certifications (7)');
  }
}

// Experience
{
  const { count } = await db.from('experience').select('*', { count: 'exact', head: true });
  if (count > 0) {
    skip(`Experience (${count} already exist, skipped)`);
  } else {
    const { error } = await db.from('experience').insert([
      {
        company: 'Ciklum India', role: 'Full Stack Developer',
        description: 'Developing and maintaining full-stack web applications using React, Node.js, Laravel, and PostgreSQL. Building internal tools, API integrations, and contributing to CI/CD pipelines. Implemented Stripe payment integration, AI-powered features, and automated testing workflows.',
        start_date: '2023-01-01', end_date: null, current: true, display_order: 1,
      },
      {
        company: 'University of Mumbai', role: 'B.E. Computer Engineering',
        description: 'Bachelor of Engineering in Computer Engineering with CGPA 8.7/10. Coursework in data structures, algorithms, database systems, operating systems, and software engineering. Active participant in hackathons and coding competitions.',
        start_date: '2019-07-01', end_date: '2023-06-01', current: false, display_order: 2,
      },
    ]);
    if (error) fail('experience', error); else ok('Experience (2)');
  }
}

// About sections
{
  const { error } = await db.from('about_sections').upsert([
    {
      section_key: 'bio', title: 'About Me',
      content: "I'm Misrilal Sah, a Full Stack Developer at Ciklum India with a passion for building clean, performant, and user-friendly web applications. I hold a B.E. in Computer Engineering from the University of Mumbai (CGPA 8.7/10). I work across the entire stack — from crafting pixel-perfect UIs with React and Tailwind to designing robust APIs with Node.js and Laravel. I'm always exploring new technologies, whether it's AI-powered tools, browser extensions, or desktop applications.",
      display_order: 1,
    },
    {
      section_key: 'journey', title: 'My Journey',
      content: 'Started coding in C during university, moved to web development with PHP/Laravel, then expanded to the modern JavaScript ecosystem with React, Next.js, and TypeScript. Now building full-stack applications at Ciklum India while creating side projects that push the boundaries of what web technology can do.',
      display_order: 2,
    },
    {
      section_key: 'hobbies', title: 'Beyond Code',
      content: "When I'm not coding, you'll find me exploring new tools and technologies, contributing to open-source projects, or building creative side projects like game arcades and AI agents. I enjoy chess (hence the chess clock project!) and have a knack for turning everyday problems into software solutions.",
      display_order: 3,
    },
  ], { onConflict: 'section_key', ignoreDuplicates: true });
  if (error) fail('about_sections', error); else ok('About sections (3)');
}

// Content variants (profile bios)
{
  const ABOUT_ID = '00000000-0000-0000-0000-000000000001';
  const { error } = await db.from('content_variants').upsert([
    {
      entity_type: 'about', entity_id: ABOUT_ID, profile_type: 'recruiter', field_name: 'bio',
      content: 'Experienced Full Stack Developer with 2+ years at Ciklum India. Proficient in React, Next.js, TypeScript, Node.js, Laravel, and PostgreSQL. Delivered production applications including Stripe integrations, AI-powered tools, and chrome extensions. B.E. Computer Engineering, Mumbai University (CGPA 8.7/10).',
    },
    {
      entity_type: 'about', entity_id: ABOUT_ID, profile_type: 'developer', field_name: 'bio',
      content: 'Full stack with a bias toward clean architecture. Daily driver: TypeScript + React + Next.js on the front, Node.js + PostgreSQL on the back. Comfortable with Python for ML pipelines and FastAPI. 25+ projects on GitHub spanning web apps, browser extensions, VS Code extensions, desktop tools, and CLI agents.',
    },
    {
      entity_type: 'about', entity_id: ABOUT_ID, profile_type: 'stalker', field_name: 'bio',
      content: "Hey, you chose Stalker — so here's the unfiltered version. I'm Misrilal, I write code for a living and for fun. I've built everything from a chess clock to an AI that reviews code. I think in components and dream in TypeScript. Yes, I made a Netflix-themed portfolio. No, I'm not sorry.",
    },
    {
      entity_type: 'about', entity_id: ABOUT_ID, profile_type: 'adventurer', field_name: 'bio',
      content: "Welcome, adventurer! I'm Misrilal — a developer who treats every project like a quest. From hacking together a 20-game retro arcade to building AI agents that review code, every build is an expedition. Pull up a seat and explore what I've been up to.",
    },
  ], { onConflict: 'entity_type,entity_id,profile_type,field_name', ignoreDuplicates: true });
  if (error) fail('content_variants', error); else ok('Content variants (4)');
}

// Site settings
{
  const { error } = await db.from('site_settings').upsert([
    { key: 'footer_tagline',        value: { text: 'Building the web, one component at a time.' } },
    { key: 'hero_recruiter_title',  value: { text: 'Full Stack Developer' } },
    { key: 'hero_developer_title',  value: { text: 'I build things for the web' } },
    { key: 'hero_stalker_title',    value: { text: 'You found me. Impressive.' } },
    { key: 'hero_adventurer_title', value: { text: "Quest accepted — let's build something." } },
  ], { onConflict: 'key', ignoreDuplicates: true });
  if (error) fail('site_settings', error); else ok('Site settings (5)');
}

// ─── STEP 2: STORAGE BUCKET ──────────────────────────────────────────────────
console.log('\n[2/4] Creating storage bucket...');
{
  const { error } = await db.storage.createBucket('portfolio-images', {
    public: true,
    allowedMimeTypes: ['image/*'],
    fileSizeLimit: 10485760, // 10MB
  });
  if (!error)                                        ok('Bucket "portfolio-images" created (public)');
  else if (error.message?.includes('already exists')) skip('Bucket "portfolio-images" already exists');
  else                                               fail('create bucket', error);
}

// ─── STEP 3: ADMIN USER ──────────────────────────────────────────────────────
console.log('\n[3/4] Creating admin user...');
{
  // Check if user already exists by listing users
  const { data: { users }, error: listError } = await db.auth.admin.listUsers();
  if (listError) {
    fail('list users', listError);
  } else {
    const existing = users.find(u => u.email === ADMIN_EMAIL);
    if (existing) {
      skip(`Admin user ${ADMIN_EMAIL} already exists (id: ${existing.id})`);
    } else {
      const { data, error } = await db.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASS,
        email_confirm: true,
      });
      if (error) fail('create admin user', error);
      else       ok(`Admin user created: ${ADMIN_EMAIL} (id: ${data.user.id})`);
    }
  }
}

// ─── STEP 4: VERIFY ──────────────────────────────────────────────────────────
console.log('\n[4/4] Verifying...');
{
  const checks = await Promise.all([
    db.from('profiles').select('*', { count: 'exact', head: true }),
    db.from('projects').select('*', { count: 'exact', head: true }),
    db.from('skills').select('*', { count: 'exact', head: true }),
    db.from('certifications').select('*', { count: 'exact', head: true }),
    db.from('experience').select('*', { count: 'exact', head: true }),
    db.from('about_sections').select('*', { count: 'exact', head: true }),
    db.from('content_variants').select('*', { count: 'exact', head: true }),
    db.from('site_settings').select('*', { count: 'exact', head: true }),
    db.storage.getBucket('portfolio-images'),
  ]);

  const tables = ['profiles','projects','skills','certifications','experience','about_sections','content_variants','site_settings'];
  for (let i = 0; i < tables.length; i++) {
    const { count, error } = checks[i];
    if (error) fail(tables[i], error);
    else       ok(`${tables[i]}: ${count} row${count !== 1 ? 's' : ''}`);
  }

  const { data: bucket, error: bucketErr } = checks[8];
  if (bucketErr) fail('portfolio-images bucket', bucketErr);
  else           ok(`storage bucket: "${bucket.name}" (public: ${bucket.public})`);

  const { data: { users }, error: usersErr } = await db.auth.admin.listUsers();
  if (usersErr) fail('auth users', usersErr);
  else          ok(`auth users: ${users.length} (${users.map(u => u.email).join(', ')})`);
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  Setup complete!');
console.log(`  Admin login → https://misril.dev/admin`);
console.log(`  Email    : ${ADMIN_EMAIL}`);
console.log(`  Password : ${ADMIN_PASS}`);
console.log('  ⚠ Change your password after first login!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
