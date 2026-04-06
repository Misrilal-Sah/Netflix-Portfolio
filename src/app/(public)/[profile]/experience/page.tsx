import type { Metadata } from "next";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { getExperiences, getExperiencePageCopy } from "@/lib/data";
import { redirect } from "next/navigation";
import type { Experience } from "@/lib/types/database";
import { Briefcase, GraduationCap } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://misril.dev";

export function generateMetadata(): Metadata {
  return {
    title: "Experience — Misril.dev",
    description:
      "Full Stack Developer at Ciklum India. B.E. Computer Engineering (CGPA 8.8) from University of Mumbai.",
    alternates: { canonical: `${SITE_URL}/recruiter/experience` },
    openGraph: {
      title: "Experience — Misril.dev",
      description: "Full Stack Developer at Ciklum India. B.E. CE (CGPA 8.8) from University of Mumbai.",
      url: `${SITE_URL}/recruiter/experience`,
      images: [{ url: `${SITE_URL}/images/Misril.jpeg`, alt: "Misrilal Sah" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Experience — Misril.dev",
      description: "Full Stack Developer at Ciklum India. B.E. CE (CGPA 8.8) from University of Mumbai.",
    },
  };
}

function formatPeriod(start: string, end: string | null, current: boolean): string {
  const startYear = new Date(start).getFullYear();
  if (current) return `${startYear} - Present`;
  const endYear = new Date(end!).getFullYear();
  return `${startYear} - ${endYear}`;
}

function isEducationEntry(exp: Experience): boolean {
  const lower = `${exp.company} ${exp.role}`.toLowerCase();
  return (
    lower.includes("university") ||
    lower.includes("college") ||
    lower.includes("institute") ||
    lower.includes("bachelor") ||
    lower.includes("b.e") ||
    lower.includes("master")
  );
}

function TimelineItem({ exp, index }: { exp: Experience; index: number }) {
  const isRight = index % 2 !== 0;
  const isEdu = isEducationEntry(exp);

  const defaultCardColor = isEdu ? "#FFE5B4" : "#b7f3b7";
  const cardBg = exp.card_color || defaultCardColor;
  const markerBg = isEdu ? "#4479b1" : "#68b612";
  const markerShadow = isEdu
    ? "0 0 0 4px #141414, 0 0 0 8px rgba(0, 123, 255, 0.5)"
    : "0 0 0 4px #141414, 0 0 0 8px rgba(229, 9, 20, 0.5)";
  const period = formatPeriod(exp.start_date, exp.end_date, exp.current);

  return (
    <div className={`exp-item${isRight ? " exp-right" : ""}`}>
      {/* Circle marker — contains the desktop date badge */}
      <div className="exp-marker" style={{ backgroundColor: markerBg, boxShadow: markerShadow }}>
        {isEdu ? <GraduationCap size={22} color="white" /> : <Briefcase size={22} color="white" />}
        <div className="exp-date-desktop">{period}</div>
      </div>

      {/* Card */}
      <div className="exp-card" style={{ backgroundColor: cardBg }}>
        {/* Arrow notch pointing toward timeline (desktop only via CSS) */}
        <div className="exp-arrow" style={{ backgroundColor: cardBg }} />

        {/* Date badge — visible on mobile inside the card */}
        <div className="exp-date-mobile">{period}</div>

        <h3 style={{ fontSize: "1.5rem", color: "black", margin: "0 0 5px 0", fontWeight: "bold" }}>
          {exp.role}
        </h3>
        <h4 style={{ fontSize: "1.1rem", color: "black", margin: "0 0 15px 0", fontWeight: "normal" }}>
          {exp.company}
        </h4>

        {exp.bullets && exp.bullets.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {exp.bullets.map((point, pi) => (
              <li key={pi} style={{ color: "black", marginBottom: "10px", lineHeight: 1.5 }}>
                {point}
              </li>
            ))}
          </ul>
        )}

        {(!exp.bullets || exp.bullets.length === 0) && exp.description && (
          <p style={{ color: "black", lineHeight: 1.5, margin: 0 }}>{exp.description}</p>
        )}

        {exp.technologies && exp.technologies.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <span style={{ display: "block", color: "black", marginBottom: "8px" }}>Technologies:</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {exp.technologies.map((tech, ti) => (
                <span
                  key={ti}
                  style={{
                    backgroundColor: "rgba(229, 9, 20, 0.2)",
                    border: "1px solid #E50914",
                    color: "#E50914",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    fontSize: "0.8rem",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
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

  const [experiences, pageCopy] = await Promise.all([
    getExperiences(),
    getExperiencePageCopy(),
  ]);

  const copy = pageCopy[profile as ProfileType];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", marginBottom: "30px" }}>
      {/* Page title */}
      <div style={{ paddingTop: "60px" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#ffffff",
            marginBottom: copy.subtitle ? "20px" : "50px",
            position: "relative",
            display: "block",
            textAlign: "center",
            width: "100%",
            fontWeight: "bold",
          }}
        >
          {copy.title}
          <span
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "-10px",
              width: "60px",
              height: "4px",
              backgroundColor: "#E50914",
              display: "block",
            }}
          />
        </h1>
        {copy.subtitle && (
          <p
            style={{
              textAlign: "center",
              color: "#808080",
              fontSize: "1rem",
              marginTop: "24px",
              marginBottom: "30px",
            }}
          >
            {copy.subtitle}
          </p>
        )}
      </div>

      {/* Timeline */}
      <div className="exp-timeline">
        {experiences.map((exp, i) => (
          <TimelineItem key={exp.id} exp={exp} index={i} />
        ))}

        {/* Star end marker */}
        <div className="exp-end-marker">
          <div className="exp-star">⭐</div>
        </div>
      </div>
    </div>
  );
}

