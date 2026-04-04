import type { Profile } from "@/lib/types/database";
import type { ProfileType } from "@/lib/constants";

const profiles: Profile[] = [
  {
    id: "prof-001",
    type: "recruiter",
    display_name: "Recruiter",
    description: "Professional overview focused on skills and experience",
    avatar_color: "#0078FF",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "prof-002",
    type: "developer",
    display_name: "Developer",
    description: "Technical deep-dive into projects and architecture",
    avatar_color: "#808080",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "prof-003",
    type: "stalker",
    display_name: "Stalker",
    description: "Everything about me — no filter",
    avatar_color: "#E50914",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "prof-004",
    type: "adventurer",
    display_name: "Adventurer",
    description: "The fun side — hobbies, interests, and side quests",
    avatar_color: "#F5C518",
    created_at: "2024-01-01T00:00:00Z",
  },
];

export async function getProfiles(): Promise<Profile[]> {
  return profiles;
}

export async function getProfileByType(
  type: ProfileType
): Promise<Profile | undefined> {
  return profiles.find((p) => p.type === type);
}
