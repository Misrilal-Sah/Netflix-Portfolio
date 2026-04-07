import type { Metadata } from "next";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { redirect } from "next/navigation";
import { RecaptchaWrapper } from "./recaptcha-wrapper";
import { getContactPageCopy } from "@/lib/data";
import { getContactInfoData } from "@/lib/data/contact-info";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://misril.dev";

export function generateMetadata(): Metadata {
  return {
    title: { absolute: "Misril - Portfolio" },
    description:
      "Get in touch with Misrilal Sah for freelance, full-time opportunities, or just to say hi.",
    alternates: {
      canonical: `${SITE_URL}/recruiter/contact`,
    },
    openGraph: {
      title: "Misril - Portfolio",
      description: "Get in touch with Misrilal Sah for freelance, full-time opportunities, or just to say hi.",
      url: `${SITE_URL}/recruiter/contact`,
      images: [{ url: `${SITE_URL}/images/Misril.jpeg`, alt: "Misrilal Sah" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Misril - Portfolio",
      description: "Get in touch with Misrilal Sah for freelance, full-time opportunities, or just to say hi.",
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;

  if (!(PROFILE_TYPES as readonly string[]).includes(profile)) {
    redirect("/");
  }

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || undefined;
  const [pageCopy, contactInfo] = await Promise.all([
    getContactPageCopy(),
    getContactInfoData(),
  ]);

  return (
    <RecaptchaWrapper
      profile={profile as ProfileType}
      copy={pageCopy[profile as ProfileType]}
      contactInfo={contactInfo}
      siteKey={siteKey}
    />
  );
}
