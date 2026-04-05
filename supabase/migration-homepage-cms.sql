-- =============================================================================
-- Homepage CMS Migration — Cards + Project Picks
-- =============================================================================
-- Run this in the Supabase SQL editor.
-- Creates two tables for CMS-managed homepage sections per profile.
-- =============================================================================

-- ─── HOMEPAGE CARDS (Continue Watching + Top Picks) ─────────────────────────
CREATE TABLE IF NOT EXISTS homepage_cards (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_type text NOT NULL CHECK (profile_type IN ('recruiter','developer','stalker','adventurer')),
  section     text NOT NULL CHECK (section IN ('continue_watching','top_picks')),
  title       text NOT NULL,
  subtitle    text,
  image_url   text,
  link_type   text NOT NULL CHECK (link_type IN ('skills','certifications','experience','about','contact','projects','other')),
  link_url    text NOT NULL DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE homepage_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON homepage_cards;
DROP POLICY IF EXISTS "admin_all" ON homepage_cards;
CREATE POLICY "public_read"  ON homepage_cards FOR SELECT USING (true);
CREATE POLICY "admin_all"    ON homepage_cards FOR ALL USING (auth.role() = 'authenticated');

-- ─── HOMEPAGE PROJECT PICKS (Projects section) ─────────────────────────────
CREATE TABLE IF NOT EXISTS homepage_project_picks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_type text NOT NULL CHECK (profile_type IN ('recruiter','developer','stalker','adventurer')),
  project_id   uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  display_order int NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  UNIQUE(profile_type, project_id)
);

ALTER TABLE homepage_project_picks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON homepage_project_picks;
DROP POLICY IF EXISTS "admin_all" ON homepage_project_picks;
CREATE POLICY "public_read"  ON homepage_project_picks FOR SELECT USING (true);
CREATE POLICY "admin_all"    ON homepage_project_picks FOR ALL USING (auth.role() = 'authenticated');

-- ─── SEED DATA (Recruiter profile — sample cards) ──────────────────────────

-- Continue Watching (3 slots for recruiter)
INSERT INTO homepage_cards (profile_type, section, title, subtitle, image_url, link_type, link_url, display_order)
VALUES
  ('recruiter', 'continue_watching', 'Tech Stack',       '60% viewed',  '/images/cards/skills.webp',         'skills',         '', 0),
  ('recruiter', 'continue_watching', 'Project Showcase',  '80% viewed',  '/images/cards/projects.webp',       'projects',       '', 1),
  ('recruiter', 'continue_watching', 'Certifications',    '24% viewed',  '/images/cards/certifications.webp', 'certifications', '', 2)
ON CONFLICT DO NOTHING;

-- Top Picks (4 slots for recruiter)
INSERT INTO homepage_cards (profile_type, section, title, subtitle, image_url, link_type, link_url, display_order)
VALUES
  ('recruiter', 'top_picks', 'Developer Story',       'About Me',    '/images/cards/about.webp',       'about',      '', 0),
  ('recruiter', 'top_picks', 'Developer Background',  'Experience',  '/images/cards/experience.webp',  'experience', '', 1),
  ('recruiter', 'top_picks', 'Skills & Technologies', 'Tech Stack',  '/images/cards/skills.webp',      'skills',     '', 2),
  ('recruiter', 'top_picks', 'Collaboration',         'Open Source', '/images/cards/contact.webp',     'contact',    '', 3)
ON CONFLICT DO NOTHING;

-- Continue Watching (3 slots for developer)
INSERT INTO homepage_cards (profile_type, section, title, subtitle, image_url, link_type, link_url, display_order)
VALUES
  ('developer', 'continue_watching', 'Tech Stack',       '60% viewed',  '/images/cards/skills.webp',         'skills',         '', 0),
  ('developer', 'continue_watching', 'Project Showcase',  '80% viewed',  '/images/cards/projects.webp',       'projects',       '', 1),
  ('developer', 'continue_watching', 'Certifications',    '24% viewed',  '/images/cards/certifications.webp', 'certifications', '', 2)
ON CONFLICT DO NOTHING;

-- Top Picks (4 slots for developer)
INSERT INTO homepage_cards (profile_type, section, title, subtitle, image_url, link_type, link_url, display_order)
VALUES
  ('developer', 'top_picks', 'Developer Story',       'About Me',    '/images/cards/about.webp',       'about',      '', 0),
  ('developer', 'top_picks', 'Developer Background',  'Experience',  '/images/cards/experience.webp',  'experience', '', 1),
  ('developer', 'top_picks', 'Skills & Technologies', 'Tech Stack',  '/images/cards/skills.webp',      'skills',     '', 2),
  ('developer', 'top_picks', 'Collaboration',         'Open Source', '/images/cards/contact.webp',     'contact',    '', 3)
ON CONFLICT DO NOTHING;

-- Continue Watching (3 slots for stalker)
INSERT INTO homepage_cards (profile_type, section, title, subtitle, image_url, link_type, link_url, display_order)
VALUES
  ('stalker', 'continue_watching', 'Tech Stack',       '60% viewed',  '/images/cards/skills.webp',         'skills',         '', 0),
  ('stalker', 'continue_watching', 'Project Showcase',  '80% viewed',  '/images/cards/projects.webp',       'projects',       '', 1),
  ('stalker', 'continue_watching', 'Certifications',    '24% viewed',  '/images/cards/certifications.webp', 'certifications', '', 2)
ON CONFLICT DO NOTHING;

-- Top Picks (4 slots for stalker)
INSERT INTO homepage_cards (profile_type, section, title, subtitle, image_url, link_type, link_url, display_order)
VALUES
  ('stalker', 'top_picks', 'Developer Story',       'About Me',    '/images/cards/about.webp',       'about',      '', 0),
  ('stalker', 'top_picks', 'Developer Background',  'Experience',  '/images/cards/experience.webp',  'experience', '', 1),
  ('stalker', 'top_picks', 'Skills & Technologies', 'Tech Stack',  '/images/cards/skills.webp',      'skills',     '', 2),
  ('stalker', 'top_picks', 'Collaboration',         'Open Source', '/images/cards/contact.webp',     'contact',    '', 3)
ON CONFLICT DO NOTHING;

-- Continue Watching (3 slots for adventurer)
INSERT INTO homepage_cards (profile_type, section, title, subtitle, image_url, link_type, link_url, display_order)
VALUES
  ('adventurer', 'continue_watching', 'Tech Stack',       '60% viewed',  '/images/cards/skills.webp',         'skills',         '', 0),
  ('adventurer', 'continue_watching', 'Project Showcase',  '80% viewed',  '/images/cards/projects.webp',       'projects',       '', 1),
  ('adventurer', 'continue_watching', 'Certifications',    '24% viewed',  '/images/cards/certifications.webp', 'certifications', '', 2)
ON CONFLICT DO NOTHING;

-- Top Picks (4 slots for adventurer)
INSERT INTO homepage_cards (profile_type, section, title, subtitle, image_url, link_type, link_url, display_order)
VALUES
  ('adventurer', 'top_picks', 'Developer Story',       'About Me',    '/images/cards/about.webp',       'about',      '', 0),
  ('adventurer', 'top_picks', 'Developer Background',  'Experience',  '/images/cards/experience.webp',  'experience', '', 1),
  ('adventurer', 'top_picks', 'Skills & Technologies', 'Tech Stack',  '/images/cards/skills.webp',      'skills',     '', 2),
  ('adventurer', 'top_picks', 'Collaboration',         'Open Source', '/images/cards/contact.webp',     'contact',    '', 3)
ON CONFLICT DO NOTHING;

-- Project Picks — insert first 4 projects for each profile (will need real IDs)
-- Run after projects exist:
-- INSERT INTO homepage_project_picks (profile_type, project_id, display_order)
-- SELECT 'recruiter', id, ROW_NUMBER() OVER (ORDER BY display_order) - 1
-- FROM projects WHERE visible = true ORDER BY display_order LIMIT 4
-- ON CONFLICT (profile_type, project_id) DO NOTHING;

-- ─── PER-PROFILE HOMEPAGE HERO (site_settings) ─────────────────────────────
-- Each profile gets its own hero. Falls back to shared "homepage_hero" if missing.
INSERT INTO site_settings (key, value)
VALUES
  ('homepage_hero_recruiter', '{
    "title": "Misrilal Sah — Software Engineer",
    "description": "Full Stack Developer with 2+ years building production React, Node.js, and AI applications. Passionate about clean architecture and ship-ready code.",
    "image_url": "/images/hero.gif",
    "resume_url": "/files/Misrilal_Sah_Resume.pdf",
    "linkedin_url": "https://linkedin.com/in/misrilalsah"
  }'::jsonb),
  ('homepage_hero_developer', '{
    "title": "Misrilal Sah — Software Engineer",
    "description": "Full Stack Developer with 2+ years building production React, Node.js, and AI applications. Passionate about clean architecture and ship-ready code.",
    "image_url": "/images/hero.gif",
    "resume_url": "/files/Misrilal_Sah_Resume.pdf",
    "linkedin_url": "https://linkedin.com/in/misrilalsah"
  }'::jsonb),
  ('homepage_hero_stalker', '{
    "title": "Misrilal Sah — Software Engineer",
    "description": "Full Stack Developer with 2+ years building production React, Node.js, and AI applications. Passionate about clean architecture and ship-ready code.",
    "image_url": "/images/hero.gif",
    "resume_url": "/files/Misrilal_Sah_Resume.pdf",
    "linkedin_url": "https://linkedin.com/in/misrilalsah"
  }'::jsonb),
  ('homepage_hero_adventurer', '{
    "title": "Misrilal Sah — Software Engineer",
    "description": "Full Stack Developer with 2+ years building production React, Node.js, and AI applications. Passionate about clean architecture and ship-ready code.",
    "image_url": "/images/hero.gif",
    "resume_url": "/files/Misrilal_Sah_Resume.pdf",
    "linkedin_url": "https://linkedin.com/in/misrilalsah"
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;
