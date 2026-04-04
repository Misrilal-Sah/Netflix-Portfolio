import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { redirect } from "next/navigation";
import { RecaptchaWrapper } from "./recaptcha-wrapper";

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

  return <RecaptchaWrapper profile={profile as ProfileType} siteKey={siteKey} />;
}
