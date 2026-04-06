import type { Metadata } from "next";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { getSkills, getSkillsPageCopy } from "@/lib/data";
import { redirect } from "next/navigation";
import type { Skill } from "@/lib/types/database";
import { getSkillIcon } from "@/lib/skill-icons";
import { Code2 } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://misril.dev";

export function generateMetadata(): Metadata {
  return {
    title: "Skills — Misril.dev",
    description:
      "Production skills across React, TypeScript, Next.js, Node.js, PostgreSQL, Supabase, Docker, and more.",
    alternates: {
      canonical: `${SITE_URL}/recruiter/skills`,
    },
    openGraph: {
      title: "Skills — Misril.dev",
      description: "Production skills across React, TypeScript, Next.js, Node.js, PostgreSQL, Supabase, Docker, and more.",
      url: `${SITE_URL}/recruiter/skills`,
      images: [{ url: `${SITE_URL}/images/Misril.jpeg`, alt: "Misrilal Sah" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Skills — Misril.dev",
      description: "Production skills across React, TypeScript, Next.js, Node.js, PostgreSQL, Supabase, Docker, and more.",
    },
  };
}




function SkillBadge({ skill }: { skill: Skill }) {
  const icon = getSkillIcon(skill.name);

  return (
    <div className="group relative bg-surface border border-border rounded-xl p-4 cursor-default flex flex-col items-center text-center gap-3 hover:border-accent hover:shadow-[0_0_20px_rgba(229,9,20,0.25)] hover:scale-[1.12] hover:-translate-y-3 hover:z-10 transition-all duration-500 ease-out">
      <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center flex-shrink-0">
        {skill.icon_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={skill.icon_url} alt={skill.name} className="w-7 h-7 object-contain" />
        ) : icon ? (
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7"
            style={{ fill: `#${icon.hex}` }}
            aria-hidden="true"
          >
            <path d={icon.path} />
          </svg>
        ) : (
          <Code2 size={26} className="text-accent" aria-hidden="true" />
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-text leading-tight">{skill.name}</p>
        {skill.description && (
          <p className="mt-1 text-[10px] text-text-muted leading-snug">
            {skill.description}
          </p>
        )}
      </div>
    </div>
  );
}


export default async function SkillsPage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;

  if (!(PROFILE_TYPES as readonly string[]).includes(profile)) {
    redirect("/");
  }

  const [skills, pageCopy] = await Promise.all([getSkills(), getSkillsPageCopy()]);
  const copy = pageCopy[profile as ProfileType];

  // Derive category order dynamically from display_order (set by admin drag-and-drop)
  // The reorderSkillsGrouped action encodes: display_order = catIdx * 1000 + skillIdx
  // So the minimum display_order within a category determines category position.
  const categoryOrder = [
    ...new Set(
      [...skills]
        .sort((a, b) => a.display_order - b.display_order)
        .map((s) => s.category)
    ),
  ];

  // Group skills by category, preserving per-category display_order sort
  const allGroups = categoryOrder.reduce((acc, cat) => {
    const group = skills
      .filter((s) => s.category === cat)
      .sort((a, b) => a.display_order - b.display_order);
    if (group.length > 0) acc[cat] = group;
    return acc;
  }, {} as Record<string, Skill[]>);


  return (
    <div className="min-h-screen bg-bg pb-2xl">
      {/* Page Header */}
      <div className="pt-12 lg:pt-[68px]">
        <div className="px-[4vw] py-lg">
          <h1 className="text-[length:var(--font-size-display)] font-bold text-text">
            {copy.title}
          </h1>
          <p className="mt-2 text-base text-text-muted w-full">
            {copy.subtitle}
          </p>
        </div>
      </div>

      {/* Skill Groups */}
      <div className="px-[4vw] space-y-3xl">
        {Object.entries(allGroups).map(([category, catSkills]) => (
          <section key={category}>
            <h2 className="text-[length:var(--font-size-body)] font-bold tracking-[0.1em] uppercase text-text-muted mb-lg border-b border-border pb-sm">
              {category}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {catSkills.map((skill) => (
                <SkillBadge key={skill.id} skill={skill} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
