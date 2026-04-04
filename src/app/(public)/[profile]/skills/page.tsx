import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { getSkills } from "@/lib/data";
import { redirect } from "next/navigation";
import type { Skill } from "@/lib/types/database";

const PROFILE_COPY: Record<ProfileType, { title: string; subtitle: string }> =
  {
    recruiter: {
      title: "Core Competencies",
      subtitle: "Technologies in active production use — no padding.",
    },
    developer: {
      title: "Tech Inventory",
      subtitle: "The full stack, honestly rated. Click any to know how deep.",
    },
    stalker: {
      title: "What I Actually Know",
      subtitle: "No fluff. No \"familiar with\". This is real.",
    },
    adventurer: {
      title: "Unlocked Abilities",
      subtitle:
        "Skills forged through quests, side projects, and late nights.",
    },
  };

const CATEGORY_ORDER = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Tools",
] as const;

function SkillBadge({ skill }: { skill: Skill }) {
  return (
    <div className="group relative bg-surface border border-border rounded-md px-md py-sm hover:border-text-dim hover:bg-surface-hover transition-colors cursor-default">
      <p className="text-[length:var(--font-size-body)] font-bold text-text">
        {skill.name}
      </p>
      {skill.description && (
        <p className="mt-xs text-[10px] text-text-muted leading-snug">
          {skill.description}
        </p>
      )}
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

  const skills = await getSkills();
  const copy = PROFILE_COPY[profile as ProfileType];

  // Group by category
  const grouped = CATEGORY_ORDER.reduce(
    (acc, cat) => {
      const group = skills.filter((s) => s.category === cat);
      if (group.length > 0) acc[cat] = group;
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  // Any categories not in CATEGORY_ORDER
  const extra = skills
    .filter((s) => !(CATEGORY_ORDER as readonly string[]).includes(s.category))
    .reduce(
      (acc, s) => {
        acc[s.category] = [...(acc[s.category] ?? []), s];
        return acc;
      },
      {} as Record<string, Skill[]>
    );

  const allGroups = { ...grouped, ...extra };

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
        </div>
      </div>

      {/* Skill Groups */}
      <div className="px-[4vw] space-y-3xl">
        {Object.entries(allGroups).map(([category, catSkills]) => (
          <section key={category}>
            <h2 className="text-[length:var(--font-size-body)] font-bold tracking-[0.1em] uppercase text-text-muted mb-lg border-b border-border pb-sm">
              {category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-sm">
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
