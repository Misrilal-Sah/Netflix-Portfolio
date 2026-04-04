import type { Metadata } from "next";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { getAboutContent } from "@/lib/data";
import { redirect } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://misril.dev";

export function generateMetadata(): Metadata {
  return {
    title: "About — Misril.dev",
    description:
      "Misrilal Sah — Full Stack Developer from Mumbai, India. Building production applications since 2022.",
    alternates: {
      canonical: `${SITE_URL}/recruiter/about`,
    },
    openGraph: {
      title: "About — Misril.dev",
      description: "Misrilal Sah — Full Stack Developer from Mumbai, India. Building production applications since 2022.",
      url: `${SITE_URL}/recruiter/about`,
      images: [{ url: `${SITE_URL}/images/Misril.jpeg`, width: 800, height: 800, alt: "Misrilal Sah" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "About — Misril.dev",
      description: "Misrilal Sah — Full Stack Developer from Mumbai, India.",
      images: [`${SITE_URL}/images/Misril.jpeg`],
    },
  };
}

const PROFILE_COPY: Record<
  ProfileType,
  { title: string; subtitle: string }
> = {
  recruiter: {
    title: "Candidate Summary",
    subtitle:
      "Background, experience, and what I bring to a team.",
  },
  developer: {
    title: "README.md",
    subtitle:
      "The architecture of a developer — design decisions included.",
  },
  stalker: {
    title: "The Real Me",
    subtitle: "You chose Stalker. Here's the unfiltered version.",
  },
  adventurer: {
    title: "The Lore",
    subtitle: "Origins, class traits, side quests, and final boss status.",
  },
};

const STATS: Array<{ value: string; label: string }> = [
  { value: "2+", label: "Years Experience" },
  { value: "25+", label: "GitHub Projects" },
  { value: "8.7", label: "B.E. CGPA" },
  { value: "7", label: "Certifications" },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;

  if (!(PROFILE_TYPES as readonly string[]).includes(profile)) {
    redirect("/");
  }

  const profileType = profile as ProfileType;
  const { sections, bio } = await getAboutContent(profileType);
  const copy = PROFILE_COPY[profileType];

  return (
    <div className="min-h-screen bg-bg pb-3xl">
      {/* Page Header */}
      <div className="pt-12 lg:pt-[68px]">
        <div className="px-[4vw] py-2xl">
          <h1 className="text-[length:var(--font-size-display)] font-bold text-text">
            {copy.title}
          </h1>
          <p className="mt-sm text-[length:var(--font-size-heading)] text-text-muted max-w-2xl">
            {copy.subtitle}
          </p>
          <a
            href="/files/Misrilal_Sah_Resume.pdf"
            download
            className="mt-lg inline-flex items-center gap-sm px-xl py-md bg-accent hover:bg-accent-hover text-text font-bold rounded-sm transition-colors text-[length:var(--font-size-body)]"
          >
            ↓ Download Resume
          </a>
        </div>
      </div>

      <div className="px-[4vw] max-w-4xl space-y-3xl">
        {/* Profile Bio Card */}
        <section>
          <div className="bg-surface border border-border rounded-md p-xl lg:p-2xl">
            <div className="flex items-start gap-xl">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-lg flex-shrink-0 hidden sm:block"
                style={{
                  backgroundColor:
                    profileType === "recruiter"
                      ? "#0078FF"
                      : profileType === "developer"
                        ? "#808080"
                        : profileType === "stalker"
                          ? "#E50914"
                          : "#F5C518",
                }}
                aria-hidden
              />
              <div>
                <p className="text-[length:var(--font-size-body)] text-text leading-loose">
                  {bio}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface border border-border rounded-md p-lg text-center"
              >
                <p className="text-[length:var(--font-size-display)] font-bold text-accent">
                  {stat.value}
                </p>
                <p className="mt-xs text-[length:var(--font-size-body)] text-text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* About Sections */}
        {sections.map((section) => (
          <section key={section.id}>
            <h2 className="text-[length:var(--font-size-heading)] font-bold text-text mb-md">
              {section.title}
            </h2>
            {section.content && (
              <p className="text-[length:var(--font-size-body)] text-text-muted leading-loose">
                {section.content}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
