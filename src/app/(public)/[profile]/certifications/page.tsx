import type { Metadata } from "next";
import Image from "next/image";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { getCertifications, getCertificationsPageCopy } from "@/lib/data";
import { getProviderInfo } from "@/lib/provider-icons";
import { redirect } from "next/navigation";
import type { Certification } from "@/lib/types/database";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://misril.dev";

export function generateMetadata(): Metadata {
  return {
    title: { absolute: "Misril - Portfolio" },
    description:
      "7 professional certifications including Stripe, Ciklum AI Academy, Meta Frontend, and HackerRank.",
    alternates: {
      canonical: `${SITE_URL}/recruiter/certifications`,
    },
    openGraph: {
      title: "Misril - Portfolio",
      description: "7 professional certifications including Stripe, Ciklum AI Academy, Meta Frontend, and HackerRank.",
      url: `${SITE_URL}/recruiter/certifications`,
      images: [{ url: `${SITE_URL}/images/Misril.jpeg`, alt: "Misrilal Sah" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Misril - Portfolio",
      description: "7 professional certifications including Stripe, Ciklum AI Academy, Meta Frontend, and HackerRank.",
    },
  };
}
import { ExternalLink, Award } from "lucide-react";



function ProviderLogo({ logo, provider }: { logo: string; provider: string }) {
  if (logo.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logo} alt={provider} className="w-9 h-9 object-contain" />
    );
  }
  return (
    <Image
      src={logo}
      alt={provider}
      width={36}
      height={36}
      className="w-9 h-9 object-contain"
    />
  );
}

function CertCard({ cert }: { cert: Certification }) {
  const issuedStr = cert.date_earned
    ? new Date(cert.date_earned).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  const expiresStr = cert.date_expires
    ? new Date(cert.date_expires).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  const dateRangeStr = expiresStr ? `${issuedStr} – ${expiresStr}` : issuedStr;

  const providerInfo = getProviderInfo(cert.provider);

  const cardContent = (
    <div className="group relative bg-surface border border-border rounded-md p-xl flex flex-col gap-sm h-full hover:border-accent hover:shadow-[0_0_24px_rgba(229,9,20,0.35)] hover:scale-[1.05] hover:-translate-y-2 hover:z-10 transition-all duration-500 ease-out cursor-pointer">
      {/* External link icon — top right */}
      <ExternalLink
        size={14}
        className="absolute top-3 right-3 text-text-muted group-hover:text-accent transition-colors"
      />

      {/* Provider logo */}
      <div className="w-14 h-14 rounded-md bg-surface-hover flex items-center justify-center flex-shrink-0 overflow-hidden">
        {providerInfo?.logo ? (
          <ProviderLogo logo={providerInfo.logo} provider={cert.provider} />
        ) : (
          <Award size={28} className="text-accent" />
        )}
      </div>

      <div className="flex-1 pr-4">
        <h3 className="text-[length:var(--font-size-body)] font-bold text-text leading-snug">
          {cert.title}
        </h3>
        <p className="mt-xs text-[length:var(--font-size-body)] text-accent font-medium">
          {cert.provider}
        </p>
        {cert.short_description && (
          <p className="mt-xs text-xs text-text-muted leading-snug">
            {cert.short_description}
          </p>
        )}
        {dateRangeStr && (
          <p className="mt-xs text-[length:var(--font-size-body)] text-text-muted">
            Issued {dateRangeStr}
          </p>
        )}
      </div>
    </div>
  );

  if (cert.verification_url) {
    return (
      <a
        href={cert.verification_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
      >
        {cardContent}
      </a>
    );
  }

  return <div className="h-full">{cardContent}</div>;
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

  const [certs, pageCopy] = await Promise.all([getCertifications(), getCertificationsPageCopy()]);
  const copy = pageCopy[profile as ProfileType];

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

      {/* Certs Grid */}
      <div className="px-[4vw] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md auto-rows-fr">
        {certs.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </div>
    </div>
  );
}
