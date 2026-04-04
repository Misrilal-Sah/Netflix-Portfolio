import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { redirect } from "next/navigation";
import { ContactClient } from "./contact-client";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;

  if (!(PROFILE_TYPES as readonly string[]).includes(profile)) {
    redirect("/");
  }

  return <ContactClient profile={profile as ProfileType} />;
}
