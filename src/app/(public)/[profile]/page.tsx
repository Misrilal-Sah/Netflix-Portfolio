import { PROFILES, type ProfileType } from "@/lib/constants";
import { getFeaturedProjects, getProjects, getSkills } from "@/lib/data";
import { ProfileHomeClient } from "./profile-home-client";

export default async function ProfileHomePage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;
  const profileData = PROFILES[profile as ProfileType];

  const [featuredProjects, allProjects, skills] = await Promise.all([
    getFeaturedProjects(),
    getProjects(),
    getSkills(),
  ]);

  return (
    <ProfileHomeClient
      profile={profile as ProfileType}
      profileName={profileData.displayName}
      featuredProjects={featuredProjects}
      allProjects={allProjects}
      skills={skills}
    />
  );
}
