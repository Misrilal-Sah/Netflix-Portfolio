import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { getExperiences } from "@/lib/data";
import { redirect } from "next/navigation";
import type { Experience } from "@/lib/types/database";
import { Briefcase, GraduationCap } from "lucide-react";

const PROFILE_COPY: Record<ProfileType, { title: string; subtitle: string }> =
  {
    recruiter: {
      title: "Career History",
      subtitle:
        "2+ years professional experience. B.E. Computer Engineering, University of Mumbai — CGPA 8.7/10.",
    },
    developer: {
      title: "Work & Stack",
      subtitle:
        "What I built, the tech I used, and what I learned doing it.",
    },
    stalker: {
      title: "How I Got Here",
      subtitle: "The actual story — not the LinkedIn version.",
    },
    adventurer: {
      title: "The Journey",
      subtitle: "From level 1 to level architect. XP accumulated along the way.",
    },
  };

function formatDateRange(start: string, end: string | null, current: boolean) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  return current ? `${fmt(start)} — Present` : `${fmt(start)} — ${fmt(end!)}`;
}

function ExperienceCard({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  const isEven = index % 2 === 0;
  const isWork = !experience.role.toLowerCase().includes("engineer");

  return (
    <div className="relative flex gap-xl">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0 w-8">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            experience.current ? "bg-accent" : "bg-surface-hover"
          }`}
        >
          {isWork ? (
            <Briefcase size={14} className="text-text" />
          ) : (
            <GraduationCap size={14} className="text-text" />
          )}
        </div>
        {/* vertical connector */}
        <div className="w-px flex-1 bg-border mt-sm" />
      </div>

      {/* Card */}
      <div
        className={`flex-1 pb-3xl ${isEven ? "" : ""}`}
      >
        <div className="bg-surface rounded-md p-xl border border-border hover:border-text-dim transition-colors">
          <div className="flex items-start justify-between gap-md flex-wrap">
            <div>
              <h3 className="text-[length:var(--font-size-heading)] font-bold text-text">
                {experience.role}
              </h3>
              <p className="text-[length:var(--font-size-body)] font-bold text-accent mt-xs">
                {experience.company}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span
                className={`inline-block px-sm py-xs rounded-sm text-[length:var(--font-size-body)] font-bold ${
                  experience.current
                    ? "bg-accent text-text"
                    : "bg-surface-hover text-text-muted"
                }`}
              >
                {experience.current ? "Current" : "Completed"}
              </span>
              <p className="mt-xs text-[length:var(--font-size-body)] text-text-muted">
                {formatDateRange(
                  experience.start_date,
                  experience.end_date,
                  experience.current
                )}
              </p>
            </div>
          </div>
          {experience.description && (
            <p className="mt-md text-[length:var(--font-size-body)] text-text-muted leading-relaxed">
              {experience.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;

  if (!(PROFILE_TYPES as readonly string[]).includes(profile)) {
    redirect("/");
  }

  const experiences = await getExperiences();
  const copy = PROFILE_COPY[profile as ProfileType];

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

      {/* Timeline */}
      <div className="px-[4vw] max-w-3xl">
        {experiences.map((exp, i) => (
          <ExperienceCard key={exp.id} experience={exp} index={i} />
        ))}
      </div>
    </div>
  );
}
