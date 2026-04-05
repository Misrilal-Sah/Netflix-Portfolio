import type { Metadata } from "next";
import { PROFILES, type ProfileType } from "@/lib/constants";
import { getHomepageHero, getHomepageCards, getHomepageProjectPicks } from "@/lib/data";
import { ProfileHomeClient } from "./profile-home-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://misril.dev";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Misril.dev — Misrilal Sah, Full Stack Developer",
    description:
      "Full Stack Developer with 2+ years building production React, Node.js, and AI applications. Netflix-style interactive portfolio.",
    alternates: {
      canonical: `${SITE_URL}/recruiter`,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/recruiter`,
      title: "Misril.dev — Misrilal Sah, Full Stack Developer",
      description:
        "Full Stack Developer with 2+ years building production React, Node.js, and AI applications. Netflix-style interactive portfolio.",
      images: [
        {
          url: `${SITE_URL}/images/Misril.jpeg`,
          width: 800,
          height: 800,
          alt: "Misrilal Sah",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Misril.dev — Misrilal Sah, Full Stack Developer",
      description:
        "Full Stack Developer with 2+ years building production React, Node.js, and AI applications.",
      images: [`${SITE_URL}/images/Misril.jpeg`],
    },
  };
}

export default async function ProfileHomePage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;
  const profileData = PROFILES[profile as ProfileType];
  const profileType = profile as ProfileType;

  const [hero, continueWatchingCards, topPicksCards, projectPicks] = await Promise.all([
    getHomepageHero(profileType),
    getHomepageCards(profileType, "continue_watching"),
    getHomepageCards(profileType, "top_picks"),
    getHomepageProjectPicks(profileType),
  ]);

  return (
    <ProfileHomeClient
      profile={profileType}
      profileName={profileData.displayName}
      hero={hero}
      continueWatchingCards={continueWatchingCards}
      topPicksCards={topPicksCards}
      projectPicks={projectPicks}
    />
  );
}
