import type { Metadata } from "next";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { getCertifications } from "@/lib/data";
import { redirect } from "next/navigation";
import type { Certification } from "@/lib/types/database";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://misril.dev";

export function generateMetadata(): Metadata {
  return {
    title: "Certifications — Misril.dev",
    description:
      "7 professional certifications including Stripe, Ciklum AI Academy, Meta Frontend, and HackerRank.",
    alternates: {
      canonical: `${SITE_URL}/recruiter/certifications`,
    },
    openGraph: {
      title: "Certifications — Misril.dev",
      description: "7 professional certifications including Stripe, Ciklum AI Academy, Meta Frontend, and HackerRank.",
      url: `${SITE_URL}/recruiter/certifications`,
      images: [{ url: `${SITE_URL}/images/Misril.jpeg`, alt: "Misrilal Sah" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Certifications — Misril.dev",
      description: "7 professional certifications including Stripe, Ciklum AI Academy, Meta Frontend, and HackerRank.",
    },
  };
}
import { ExternalLink, Award } from "lucide-react";

const PROFILE_COPY: Record<ProfileType, { title: string; subtitle: string }> =
  {
    recruiter: {
      title: "Credentials & Training",
      subtitle: "Validated skills with official recognition.",
    },
    developer: {
      title: "Certs & Courses",
      subtitle:
        "Formal training alongside the self-taught grind — because both matter.",
    },
    stalker: {
      title: "Paper Trail",
      subtitle: "The receipts. Every single one.",
    },
    adventurer: {
      title: "Achievement Unlocked",
      subtitle: "Rare drops from the learning dungeon.",
    },
  };

function CertCard({ cert }: { cert: Certification }) {
  const dateStr = cert.date_earned
    ? new Date(cert.date_earned).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-surface border border-border rounded-md p-xl flex flex-col gap-sm hover:border-text-dim transition-colors">
      <div className="w-10 h-10 rounded-md bg-surface-hover flex items-center justify-center flex-shrink-0">
        <Award size={20} className="text-accent" />
      </div>
      <div className="flex-1">
        <h3 className="text-[length:var(--font-size-body)] font-bold text-text leading-snug">
          {cert.title}
        </h3>
        <p className="mt-xs text-[length:var(--font-size-body)] text-accent font-bold">
          {cert.provider}
        </p>
        {dateStr && (
          <p className="mt-xs text-[length:var(--font-size-body)] text-text-muted">
            {dateStr}
          </p>
        )}
      </div>
      {cert.verification_url && (
        <a
          href={cert.verification_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-xs text-[length:var(--font-size-body)] text-text-muted hover:text-text transition-colors mt-auto"
        >
          <ExternalLink size={12} />
          Verify
        </a>
      )}
    </div>
  );
}

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;

  if (!(PROFILE_TYPES as readonly string[]).includes(profile)) {
    redirect("/");
  }

  const certs = await getCertifications();
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

      {/* Certs Grid */}
      <div className="px-[4vw] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
        {certs.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </div>
    </div>
  );
}
