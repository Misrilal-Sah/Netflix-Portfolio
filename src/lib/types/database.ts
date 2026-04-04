// ─── Base row types matching Supabase schema ────────────────────────────────

export interface Profile {
  id: string;
  type: "recruiter" | "developer" | "stalker" | "adventurer";
  display_name: string;
  description: string | null;
  avatar_color: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  tags: string[];
  github_url: string | null;
  demo_url: string | null;
  screenshot_url: string | null;
  featured: boolean;
  visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon_url: string | null;
  description: string | null;
  display_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  title: string;
  provider: string;
  logo_url: string | null;
  date_earned: string | null;
  verification_url: string | null;
  display_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface AboutSection {
  id: string;
  section_key: string;
  title: string;
  content: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContentVariant {
  id: string;
  entity_type: string;
  entity_id: string;
  profile_type: string;
  field_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface ImageRecord {
  id: string;
  filename: string;
  url: string;
  storage_path: string | null;
  size_bytes: number | null;
  mime_type: string | null;
  alt_text: string | null;
  created_at: string;
}

// ─── Insert / Update types ──────────────────────────────────────────────────

export type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<ProjectInsert>;

export type SkillInsert = Omit<Skill, "id" | "created_at" | "updated_at">;
export type SkillUpdate = Partial<SkillInsert>;

export type CertificationInsert = Omit<
  Certification,
  "id" | "created_at" | "updated_at"
>;
export type CertificationUpdate = Partial<CertificationInsert>;

export type ExperienceInsert = Omit<
  Experience,
  "id" | "created_at" | "updated_at"
>;
export type ExperienceUpdate = Partial<ExperienceInsert>;

export type AboutSectionInsert = Omit<
  AboutSection,
  "id" | "created_at" | "updated_at"
>;
export type AboutSectionUpdate = Partial<AboutSectionInsert>;

export type ContactSubmissionInsert = Omit<
  ContactSubmission,
  "id" | "created_at" | "is_read"
>;

// ─── Database type (Supabase-compatible structure) ──────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "id" | "created_at">; Update: Partial<Omit<Profile, "id" | "created_at">> };
      projects: { Row: Project; Insert: ProjectInsert; Update: ProjectUpdate };
      skills: { Row: Skill; Insert: SkillInsert; Update: SkillUpdate };
      certifications: { Row: Certification; Insert: CertificationInsert; Update: CertificationUpdate };
      experience: { Row: Experience; Insert: ExperienceInsert; Update: ExperienceUpdate };
      about_sections: { Row: AboutSection; Insert: AboutSectionInsert; Update: AboutSectionUpdate };
      content_variants: { Row: ContentVariant; Insert: Omit<ContentVariant, "id" | "created_at" | "updated_at">; Update: Partial<Omit<ContentVariant, "id" | "created_at" | "updated_at">> };
      contact_submissions: { Row: ContactSubmission; Insert: ContactSubmissionInsert; Update: Partial<ContactSubmission> };
      site_settings: { Row: SiteSetting; Insert: Omit<SiteSetting, "id" | "updated_at">; Update: Partial<Omit<SiteSetting, "id" | "updated_at">> };
      images: { Row: ImageRecord; Insert: Omit<ImageRecord, "id" | "created_at">; Update: Partial<Omit<ImageRecord, "id" | "created_at">> };
    };
  };
}
