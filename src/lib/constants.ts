export const PROFILE_TYPES = [
  "recruiter",
  "developer",
  "stalker",
  "adventurer",
] as const;

export type ProfileType = (typeof PROFILE_TYPES)[number];

export const PROFILES: Record<
  ProfileType,
  { displayName: string; avatarColor: string; description: string; avatarImage: string }
> = {
  recruiter: {
    displayName: "Recruiter",
    avatarColor: "#0078FF",
    description: "Professional overview focused on skills and experience",
    avatarImage: "/images/profiles/recruiter.png",
  },
  developer: {
    displayName: "Developer",
    avatarColor: "#808080",
    description: "Technical deep-dive into projects and architecture",
    avatarImage: "/images/profiles/developer.png",
  },
  stalker: {
    displayName: "Stalker",
    avatarColor: "#E50914",
    description: "Everything about me — no filter",
    avatarImage: "/images/profiles/stalker.png",
  },
  adventurer: {
    displayName: "Adventurer",
    avatarColor: "#F5C518",
    description: "The fun side — hobbies, interests, and side quests",
    avatarImage: "/images/profiles/adventurer.png",
  },
};

export const ROUTES = {
  home: "/",
  profile: (type: ProfileType) => `/${type}` as const,
  projects: (type: ProfileType) => `/${type}/projects` as const,
  experience: (type: ProfileType) => `/${type}/experience` as const,
  skills: (type: ProfileType) => `/${type}/skills` as const,
  certifications: (type: ProfileType) => `/${type}/certifications` as const,
  about: (type: ProfileType) => `/${type}/about` as const,
  contact: (type: ProfileType) => `/${type}/contact` as const,
} as const;

export const NAV_ITEMS = [
  { label: "Home", path: "" },
  { label: "Projects", path: "projects" },
  { label: "Experience", path: "experience" },
  { label: "Skills", path: "skills" },
  { label: "Certifications", path: "certifications" },
  { label: "About", path: "about" },
  { label: "Contact", path: "contact" },
] as const;
