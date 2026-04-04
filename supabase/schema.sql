-- =============================================================================
-- Netflix Portfolio v2 — Supabase Database Schema
-- =============================================================================
-- Run this in the Supabase SQL editor to create all tables and RLS policies.
-- All tables use UUID primary keys with gen_random_uuid().
-- =============================================================================

-- ─── PROFILES ────────────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text UNIQUE NOT NULL CHECK (type IN ('recruiter', 'developer', 'stalker', 'adventurer')),
  display_name text NOT NULL,
  description text,
  avatar_color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "admin_all" ON profiles FOR ALL USING (auth.role() = 'authenticated');

-- ─── PROJECTS ────────────────────────────────────────────────────────────────
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category text,
  tags text[] DEFAULT '{}',
  github_url text,
  demo_url text,
  screenshot_url text,
  featured boolean DEFAULT false,
  visible boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON projects FOR SELECT USING (visible = true);
CREATE POLICY "admin_all" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- ─── SKILLS ──────────────────────────────────────────────────────────────────
CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  icon_url text,
  description text,
  display_order integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON skills FOR SELECT USING (visible = true);
CREATE POLICY "admin_all" ON skills FOR ALL USING (auth.role() = 'authenticated');

-- ─── CERTIFICATIONS ──────────────────────────────────────────────────────────
CREATE TABLE certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  provider text NOT NULL,
  logo_url text,
  date_earned date,
  verification_url text,
  display_order integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON certifications FOR SELECT USING (visible = true);
CREATE POLICY "admin_all" ON certifications FOR ALL USING (auth.role() = 'authenticated');

-- ─── EXPERIENCE ──────────────────────────────────────────────────────────────
CREATE TABLE experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date,
  current boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON experience FOR SELECT USING (true);
CREATE POLICY "admin_all" ON experience FOR ALL USING (auth.role() = 'authenticated');

-- ─── ABOUT SECTIONS ──────────────────────────────────────────────────────────
CREATE TABLE about_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text NOT NULL,
  content text,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON about_sections FOR SELECT USING (true);
CREATE POLICY "admin_all" ON about_sections FOR ALL USING (auth.role() = 'authenticated');

-- ─── CONTENT VARIANTS (profile-specific text) ───────────────────────────────
CREATE TABLE content_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  profile_type text NOT NULL REFERENCES profiles(type),
  field_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (entity_type, entity_id, profile_type, field_name)
);

ALTER TABLE content_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON content_variants FOR SELECT USING (true);
CREATE POLICY "admin_all" ON content_variants FOR ALL USING (auth.role() = 'authenticated');

-- ─── CONTACT SUBMISSIONS ────────────────────────────────────────────────────
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_insert" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');

-- ─── SITE SETTINGS ──────────────────────────────────────────────────────────
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "admin_all" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ─── IMAGES ─────────────────────────────────────────────────────────────────
CREATE TABLE images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  storage_path text,
  size_bytes integer,
  mime_type text,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON images FOR SELECT USING (true);
CREATE POLICY "admin_all" ON images FOR ALL USING (auth.role() = 'authenticated');

-- ─── INDEXES ────────────────────────────────────────────────────────────────
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = true;
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_content_variants_lookup ON content_variants(entity_type, entity_id, profile_type);
CREATE INDEX idx_contact_submissions_unread ON contact_submissions(is_read) WHERE is_read = false;

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER about_sections_updated_at BEFORE UPDATE ON about_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER content_variants_updated_at BEFORE UPDATE ON content_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
