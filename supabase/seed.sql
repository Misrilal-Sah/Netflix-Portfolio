-- =============================================================================
-- Netflix Portfolio v2 — Seed Data
-- Run this AFTER schema.sql in the Supabase SQL editor.
-- Safe to re-run: uses ON CONFLICT DO NOTHING.
-- =============================================================================

-- ─── PROFILES ────────────────────────────────────────────────────────────────
INSERT INTO profiles (type, display_name, description, avatar_color) VALUES
  ('recruiter',  'Recruiter',  'Professional overview focused on skills and experience', '#0078FF'),
  ('developer',  'Developer',  'Technical deep-dive into projects and architecture',     '#808080'),
  ('stalker',    'Stalker',    'Everything about me — no filter',                        '#E50914'),
  ('adventurer', 'Adventurer', 'The fun side — hobbies, interests, and side quests',     '#F5C518')
ON CONFLICT (type) DO NOTHING;

-- ─── PROJECTS ────────────────────────────────────────────────────────────────
INSERT INTO projects (title, slug, description, category, tags, github_url, demo_url, screenshot_url, featured, visible, display_order) VALUES
(
  'AI Query Master', 'ai-query-master',
  'AI-driven SQL assistant with agentic pipeline — review queries, analyze schemas, generate SQL from plain English, and connect to live databases with self-reflection and RAG-powered intelligence.',
  'Full Stack', ARRAY['Python','FastAPI','React','ChromaDB','Supabase','Gemini AI'],
  'https://github.com/Misrilal-Sah/ai-query-master', null, '/images/Projects/file-manipulation.jpg',
  true, true, 1
),
(
  'Multi-Mode Smart Calculator', 'multi-mode-calculator',
  '7 calculator modes — basic, scientific, currency converter with live rates, unit converter, BMI, date calculator, and bill splitter. PWA-enabled with 7 themes.',
  'React', ARRAY['React','Vite','PWA','CSS3'],
  'https://github.com/Misrilal-Sah/multi-mode-calculator', 'https://Misrilal-Sah.github.io/multi-mode-calculator', '/images/Projects/calculator.jpg',
  true, true, 2
),
(
  'Code Review Agent', 'code-review-agent',
  'AI-powered code review and RAG knowledge agent — autonomous, reflective, multi-LLM, CLI-first. 24 AST rule checks with 3-iteration self-reflection.',
  'Python', ARRAY['Python','Gemini AI','LangChain','ChromaDB','Groq'],
  'https://github.com/Misrilal-Sah/code-review', null, '/images/Projects/file-compressor.jpg',
  true, true, 3
),
(
  'Chess Clock', 'chess-clock',
  'Professional chess clock with sub-millisecond timing, beautiful dual-theme UI, and zero dependencies. Pure vanilla JS — no frameworks, no install.',
  'Vanilla JS', ARRAY['HTML5','CSS3','JavaScript','Web Audio API'],
  'https://github.com/Misrilal-Sah/chess-clock', null, '/images/Projects/chess-clock.jpg',
  false, true, 4
),
(
  'Color Detection Pro', 'color-detection-pro',
  'Offline desktop color intelligence with OpenCV + ML — detect, convert, match, mix, extract, and build color systems from images or live camera feed.',
  'Python', ARRAY['Python','OpenCV','CustomTkinter','Machine Learning'],
  'https://github.com/Misrilal-Sah/color-detection-pro', null, '/images/Projects/color-detection.jpg',
  false, true, 5
),
(
  'CurrencyX', 'currencyx',
  'Premium currency converter with real-time exchange rates, beautiful UI, and offline support.',
  'React', ARRAY['React','API Integration','PWA'],
  'https://github.com/Misrilal-Sah/currencyx', null, '/images/Projects/currency-converter.jpg',
  false, true, 6
),
(
  'Design Inspector Pro', 'design-inspector-pro',
  'Chrome extension for pixel-perfect design inspection — extract colors, decode typography, copy CSS — all without leaving the page.',
  'Chrome Extension', ARRAY['Chrome Extension','JavaScript','CSS'],
  'https://github.com/Misrilal-Sah/design-inspector-pro', null, '/images/Projects/file-manipulation.jpg',
  true, true, 7
),
(
  'PDFease', 'pdfease',
  'The ultimate free PDF and document toolkit — merge, split, compress, convert, and manipulate PDFs with a clean modern interface.',
  'Full Stack', ARRAY['React','Node.js','PDF Processing'],
  'https://github.com/Misrilal-Sah/pdfease', null, '/images/Projects/file-compressor.jpg',
  false, true, 8
),
(
  'Retro Game Arcade', 'retro-game-arcade',
  'A hand-crafted collection of 20 classic games — Tetris, Snake, Pac-Man, Breakout, and more. Pure JavaScript with retro pixel aesthetics.',
  'Vanilla JS', ARRAY['JavaScript','Canvas','Game Development'],
  'https://github.com/Misrilal-Sah/retro-arcade', null, '/images/Projects/tic-tac.jpg',
  false, true, 9
),
(
  'AABHAR Jewellery', 'aabhar-jewellery',
  'Premium jewellery e-commerce platform with product catalog, shopping cart, and payment integration. Built with modern design patterns.',
  'Laravel', ARRAY['Laravel','PHP','MySQL','E-Commerce'],
  'https://github.com/Misrilal-Sah/aabhar', null, '/images/Projects/jwellery.jpg',
  false, true, 10
),
(
  'PharmaDesk', 'pharmadesk',
  'Modern pharmacy management system — inventory tracking, prescription management, billing, and reporting with role-based access.',
  'Full Stack', ARRAY['React','Node.js','MongoDB','Express'],
  'https://github.com/Misrilal-Sah/pharmadesk', null, '/images/Projects/pharmacy.jpg',
  false, true, 11
),
(
  'Screenshot Master', 'screenshot-master',
  'Browser extension for capturing, annotating, and exporting screenshots — full page, visible area, or selected region with annotation tools.',
  'Chrome Extension', ARRAY['Chrome Extension','JavaScript','Canvas'],
  'https://github.com/Misrilal-Sah/screenshot-master', null, '/images/Projects/file-manipulation.jpg',
  false, true, 12
),
(
  'TaskFlow', 'taskflow',
  'AI-powered offline-first todo experience with smart categorization, natural language input, and beautiful animations.',
  'React', ARRAY['React','PWA','AI','IndexedDB'],
  'https://github.com/Misrilal-Sah/taskflow', null, '/images/Projects/file-manipulation.jpg',
  false, true, 13
),
(
  'Typing Practice', 'typing-practice',
  'Speed, accuracy, consistency — a typing trainer with real-time WPM tracking, customizable text sources, and performance analytics.',
  'Vanilla JS', ARRAY['JavaScript','HTML5','CSS3'],
  'https://github.com/Misrilal-Sah/typing-practice', null, '/images/Projects/typing-practice.jpg',
  false, true, 14
),
(
  'Insert Utilities', 'insert-utilities',
  'The all-in-one text generator VS Code extension — lorem ipsum, UUIDs, dates, numbers, colors, and more with smart insertion.',
  'VS Code Extension', ARRAY['TypeScript','VS Code API','Extension'],
  'https://github.com/Misrilal-Sah/insert-utilities', null, '/images/Projects/file-manipulation.jpg',
  false, true, 15
)
ON CONFLICT (slug) DO NOTHING;

-- ─── SKILLS ──────────────────────────────────────────────────────────────────
INSERT INTO skills (name, category, description, display_order, visible) VALUES
-- Frontend
('JavaScript',    'Frontend', 'ES6+, DOM manipulation, async/await',               1, true),
('TypeScript',    'Frontend', 'Strict typing, generics, type guards',              2, true),
('React',         'Frontend', 'Hooks, Context, Server Components',                 3, true),
('Next.js',       'Frontend', 'App Router, SSR, ISR, API routes',                  4, true),
('Vue.js',        'Frontend', 'Composition API, Vuex, Vue Router',                 5, true),
('Tailwind CSS',  'Frontend', 'Utility-first, v4 @theme, responsive design',       6, true),
('HTML5 / CSS3',  'Frontend', 'Semantic HTML, Flexbox, Grid, animations',          7, true),
('Framer Motion', 'Frontend', 'Page transitions, gestures, layout animations',     8, true),
-- Backend
('Node.js',       'Backend',  'Express, REST APIs, middleware',                    1, true),
('Python',        'Backend',  'FastAPI, Flask, automation, ML pipelines',          2, true),
('PHP / Laravel', 'Backend',  'MVC, Eloquent ORM, queues, events',                 3, true),
('FastAPI',       'Backend',  'Async endpoints, Pydantic, OpenAPI',                4, true),
-- Database
('PostgreSQL',    'Database', 'Complex queries, RLS, triggers, indexes',           1, true),
('MySQL',         'Database', 'Joins, stored procedures, optimization',            2, true),
('MongoDB',       'Database', 'Document model, aggregation, Atlas',                3, true),
('Supabase',      'Database', 'Auth, RLS, real-time, storage',                     4, true),
-- DevOps
('Docker',        'DevOps',   'Containerization, Docker Compose, multi-stage builds', 1, true),
('Git / GitHub',  'DevOps',   'Branching, PRs, CI/CD, Actions',                   2, true),
('Vercel',        'DevOps',   'Deploy, preview, serverless functions',             3, true),
('AWS',           'DevOps',   'EC2, S3, Lambda, CloudFront',                       4, true),
-- Tools
('VS Code',       'Tools',    'Extensions, keybindings, workspace config',         1, true),
('Figma',         'Tools',    'Design, prototyping, dev handoff',                  2, true),
('Postman',       'Tools',    'API testing, collections, environments',            3, true)
ON CONFLICT (name) DO NOTHING;

-- ─── CERTIFICATIONS ──────────────────────────────────────────────────────────
INSERT INTO certifications (title, provider, date_earned, verification_url, display_order, visible) VALUES
('Stripe Certified Professional Developer',            'Stripe',             '2025-04-01', null, 1, true),
('AI Academy Level 3',                                 'Ciklum',             '2025-01-01', null, 2, true),
('The Complete Web Developer Course 3.0',              'Udemy',              '2023-06-01', null, 3, true),
('Programming with JavaScript',                        'Coursera (Meta)',    '2023-03-01', null, 4, true),
('Problem Solving (Intermediate)',                     'HackerRank',         '2023-01-01', null, 5, true),
('JavaScript (Intermediate)',                          'HackerRank',         '2022-11-01', null, 6, true),
('Introduction to Web Development with HTML, CSS, JavaScript', 'Codio (Coursera)', '2022-08-01', null, 7, true)
ON CONFLICT (title, provider) DO NOTHING;

-- ─── EXPERIENCE ──────────────────────────────────────────────────────────────
INSERT INTO experience (company, role, description, start_date, end_date, current, display_order) VALUES
(
  'Ciklum India', 'Full Stack Developer',
  'Developing and maintaining full-stack web applications using React, Node.js, Laravel, and PostgreSQL. Building internal tools, API integrations, and contributing to CI/CD pipelines. Implemented Stripe payment integration, AI-powered features, and automated testing workflows.',
  '2023-01-01', null, true, 1
),
(
  'University of Mumbai', 'B.E. Computer Engineering',
  'Bachelor of Engineering in Computer Engineering with CGPA 8.7/10. Coursework in data structures, algorithms, database systems, operating systems, and software engineering. Active participant in hackathons and coding competitions.',
  '2019-07-01', '2023-06-01', false, 2
)
ON CONFLICT (company, role) DO NOTHING;

-- ─── ABOUT SECTIONS ──────────────────────────────────────────────────────────
INSERT INTO about_sections (section_key, title, content, display_order) VALUES
(
  'bio', 'About Me',
  'I''m Misrilal Sah, a Full Stack Developer at Ciklum India with a passion for building clean, performant, and user-friendly web applications. I hold a B.E. in Computer Engineering from the University of Mumbai (CGPA 8.7/10). I work across the entire stack — from crafting pixel-perfect UIs with React and Tailwind to designing robust APIs with Node.js and Laravel. I''m always exploring new technologies, whether it''s AI-powered tools, browser extensions, or desktop applications.',
  1
),
(
  'journey', 'My Journey',
  'Started coding in C during university, moved to web development with PHP/Laravel, then expanded to the modern JavaScript ecosystem with React, Next.js, and TypeScript. Now building full-stack applications at Ciklum India while creating side projects that push the boundaries of what web technology can do.',
  2
),
(
  'hobbies', 'Beyond Code',
  'When I''m not coding, you''ll find me exploring new tools and technologies, contributing to open-source projects, or building creative side projects like game arcades and AI agents. I enjoy chess (hence the chess clock project!) and have a knack for turning everyday problems into software solutions.',
  3
)
ON CONFLICT (section_key) DO NOTHING;

-- ─── CONTENT VARIANTS (profile-specific bios) ────────────────────────────────
-- These store profile-specific bio text used on the About page.
-- entity_id uses a fixed UUID per "about/bio" concept.
DO $$
DECLARE
  about_entity_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  INSERT INTO content_variants (entity_type, entity_id, profile_type, field_name, content)
  VALUES
  (
    'about', about_entity_id, 'recruiter', 'bio',
    'Experienced Full Stack Developer with 2+ years at Ciklum India. Proficient in React, Next.js, TypeScript, Node.js, Laravel, and PostgreSQL. Delivered production applications including Stripe integrations, AI-powered tools, and chrome extensions. B.E. Computer Engineering, Mumbai University (CGPA 8.7/10).'
  ),
  (
    'about', about_entity_id, 'developer', 'bio',
    'Full stack with a bias toward clean architecture. Daily driver: TypeScript + React + Next.js on the front, Node.js + PostgreSQL on the back. Comfortable with Python for ML pipelines and FastAPI. 25+ projects on GitHub spanning web apps, browser extensions, VS Code extensions, desktop tools, and CLI agents.'
  ),
  (
    'about', about_entity_id, 'stalker', 'bio',
    'Hey, you chose Stalker — so here''s the unfiltered version. I''m Misrilal, I write code for a living and for fun. I''ve built everything from a chess clock to an AI that reviews code. I think in components and dream in TypeScript. Yes, I made a Netflix-themed portfolio. No, I''m not sorry.'
  ),
  (
    'about', about_entity_id, 'adventurer', 'bio',
    'Welcome, adventurer! I''m Misrilal — a developer who treats every project like a quest. From hacking together a 20-game retro arcade to building AI agents that review code, every build is an expedition. Pull up a seat and explore what I''ve been up to.'
  )
  ON CONFLICT (entity_type, entity_id, profile_type, field_name) DO NOTHING;
END $$;

-- ─── SITE SETTINGS ──────────────────────────────────────────────────────────
INSERT INTO site_settings (key, value) VALUES
('footer_tagline',        '{"text": "Building the web, one component at a time."}'),
('hero_recruiter_title',  '{"text": "Full Stack Developer"}'),
('hero_developer_title',  '{"text": "I build things for the web"}'),
('hero_stalker_title',    '{"text": "You found me. Impressive."}'),
('hero_adventurer_title', '{"text": "Quest accepted — let''s build something."}'),
-- ─── Homepage Hero ─────────────────────────────────────────────────────────
('homepage_hero', '{
  "title": "Misrilal Sah — Software Engineer",
  "description": "Full Stack Developer with 2+ years building production React, Node.js, and AI applications. Passionate about clean architecture and ship-ready code.",
  "image_url": "/images/hero.gif",
  "resume_url": "/files/Misrilal_Sah_Resume.pdf",
  "linkedin_url": "https://linkedin.com/in/misrilalsah"
}'),
-- ─── Page Copy — per-persona titles & subtitles ───────────────────────────
('page_copy_experience', '{
  "recruiter":  {"title": "Work Experience",  "subtitle": "My professional journey and educational background."},
  "developer":  {"title": "Career Timeline",  "subtitle": "Where I shipped code and what I built."},
  "stalker":    {"title": "The Resume",        "subtitle": "Yes, this is basically my CV. You''re welcome."},
  "adventurer": {"title": "Guild History",     "subtitle": "Every guild I''ve joined and the raids I''ve completed."}
}'),
('page_copy_about', '{
  "recruiter":  {"title": "Candidate Summary", "subtitle": "Background, experience, and what I bring to a team."},
  "developer":  {"title": "README.md",          "subtitle": "The architecture of a developer — design decisions included."},
  "stalker":    {"title": "The Real Me",         "subtitle": "You chose Stalker. Here''s the unfiltered version."},
  "adventurer": {"title": "The Lore",            "subtitle": "Origins, class traits, side quests, and final boss status."}
}'),
('page_copy_skills', '{
  "recruiter":  {"title": "Core Competencies",   "subtitle": "Technologies in active production use — no padding."},
  "developer":  {"title": "Tech Inventory",       "subtitle": "The full stack, honestly rated. Click any to know how deep."},
  "stalker":    {"title": "What I Actually Know", "subtitle": "No fluff. No ''familiar with''. This is real."},
  "adventurer": {"title": "Unlocked Abilities",   "subtitle": "Skills forged through quests, side projects, and late nights."}
}'),
('page_copy_certifications', '{
  "recruiter":  {"title": "Credentials & Training", "subtitle": "Validated skills with official recognition."},
  "developer":  {"title": "Certs & Courses",         "subtitle": "Formal training alongside the self-taught grind — because both matter."},
  "stalker":    {"title": "Paper Trail",              "subtitle": "The receipts. Every single one."},
  "adventurer": {"title": "Achievement Unlocked",     "subtitle": "Rare drops from the learning dungeon."}
}'),
('page_copy_projects', '{
  "recruiter":  {"title": "Shipped Work",       "subtitle": "Production applications delivered across frontend, backend, and AI.", "allLabel": "All Projects"},
  "developer":  {"title": "GitHub Timeline",    "subtitle": "Repositories, architectures, and build decisions.",                 "allLabel": "All Repos"},
  "stalker":    {"title": "The Build Log",       "subtitle": "Everything I''ve made — warts and all.",                           "allLabel": "All Builds"},
  "adventurer": {"title": "Completed Quests",   "subtitle": "Every project: an adventure with a final boss.",                   "allLabel": "All Quests"}
}'),
('page_copy_contact', '{
  "recruiter":  {"title": "Get In Touch",           "subtitle": "Interested in working together? I respond promptly to professional inquiries.", "namePlaceholder": "Your Name / Company",           "msgPlaceholder": "Tell me about the role or project..."},
  "developer":  {"title": "Open An Issue",          "subtitle": "Bug reports, feature requests, collab proposals, or just a good tech discussion.", "namePlaceholder": "Your handle or name",           "msgPlaceholder": "What''s on your mind? Code, ideas, anything..."},
  "stalker":    {"title": "Slide Into My Inbox",    "subtitle": "Go ahead. I''m literally right here.",                                           "namePlaceholder": "Name (or alias, I''m not judging)", "msgPlaceholder": "Say whatever you were going to say..."},
  "adventurer": {"title": "Send A Raven",           "subtitle": "Got a quest to propose? A dungeon to raid? I''m listening.",                      "namePlaceholder": "Adventurer name",               "msgPlaceholder": "Describe the quest..."}
}')
ON CONFLICT (key) DO NOTHING;

-- ─── CONTACT INFO ────────────────────────────────────────────────────────────
INSERT INTO contact_info (key, value) VALUES
(
  'profile_card',
  '{
    "name": "Misrilal Sah",
    "job_title": "Software Engineer",
    "bio": "With 2+ years of experience as a Full Stack Developer, proficient in PHP and JavaScript technologies and specializing in the edge-technologies.",
    "location": "Pune, Maharashtra, India",
    "photo_url": "/others/misril.png",
    "linkedin_url": "https://www.linkedin.com/in/misrilal-sah/"
  }'
),
(
  'contact_details',
  '{
    "email": "misrilalsah09@gmail.com",
    "phone": "+91 8237138622",
    "location": "Pune, Maharashtra, India"
  }'
),
(
  'social_links',
  '[
    {"name": "LinkedIn",   "url": "https://www.linkedin.com/in/misrilal-sah/",         "bg_color": "#0077B5"},
    {"name": "Instagram",  "url": "https://www.instagram.com/sah._099/",               "bg_color": "#E1306C"},
    {"name": "Reddit",     "url": "https://reddit.com/u/Sad-Expression6099",           "bg_color": "#FF4500"},
    {"name": "Discord",    "url": "https://discord.com/users/misrilalsah",             "bg_color": "#5865F2"},
    {"name": "WhatsApp",   "url": "https://wa.me/918237138622",                        "bg_color": "#25D366"},
    {"name": "Telegram",   "url": "https://t.me/John715",                              "bg_color": "#2AABEE"}
  ]'
),
(
  'availability',
  '{
    "is_available": true,
    "status_text": "Available for freelance work",
    "response_time": "Average response time: 24 hours"
  }'
)
ON CONFLICT (key) DO NOTHING;
