import type { Metadata } from "next";
import Image from "next/image";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { getAboutContent, getAboutPageCopy } from "@/lib/data";
import { getAboutSkillsConfig, getAboutHero } from "@/lib/data/about";
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
  const [{ sections, bio }, aboutSkills, pageCopy, hero] = await Promise.all([
    getAboutContent(profileType),
    getAboutSkillsConfig(),
    getAboutPageCopy(),
    getAboutHero(),
  ]);
  const copy = pageCopy[profileType];
  const { categoryOrder, skillsByCategory } = aboutSkills;

  return (
    <div className="min-h-screen bg-bg pb-3xl">
      <div className="max-w-4xl mx-auto px-[4vw]">
        {/* Page Header */}
        <div className="pt-20 pb-2xl">
          <h1 className="text-[length:var(--font-size-display)] font-bold text-text">
            {copy.title}
          </h1>
          <p className="mt-2 text-base text-text-muted">
            {copy.subtitle}
          </p>
          {/* <a
            href="/files/Misrilal_Sah_Resume.pdf"
            download
            className="mt-lg inline-flex items-center gap-sm px-xl py-md bg-accent hover:bg-accent-hover text-text font-bold rounded-sm transition-colors text-[length:var(--font-size-body)]"
          >
            ↓ Download Resume
          </a> */}
        </div>

        <div className="space-y-3xl">
          {/* Profile Bio Card */}
          <section>
            <div className="bg-surface border border-border rounded-md p-xl lg:p-2xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-xl">
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={hero.image_url}
                      alt="Misrilal Sah"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="text-center sm:text-left">
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
              {hero.stats.map((stat) => (
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

          {/* Skills */}
          {categoryOrder.length > 0 && (
            <section>
              <h2 className="text-[length:var(--font-size-heading)] font-bold text-text mb-2xl">
                My Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2xl">
                {categoryOrder.filter(cat => (skillsByCategory[cat]?.length ?? 0) > 0).map((category) => {
                  const names = skillsByCategory[category];
                  return (
                    <div key={category}>
                      <h3 className="text-[length:var(--font-size-body)] font-bold text-accent uppercase tracking-wide pb-sm border-b-2 border-accent inline-block mb-md">
                        {category}
                      </h3>
                      <ul className="space-y-sm mt-md">
                        {names.map((name) => (
                          <li key={name} className="flex items-center gap-sm text-[length:var(--font-size-body)] text-text-muted">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
