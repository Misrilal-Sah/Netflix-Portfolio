import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { ProfileProvider } from "@/lib/contexts/profile-context";
import { PageTransition } from "@/components/shared/page-transition";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profile: string }>;
}): Promise<Metadata> {
  const { profile } = await params;
  const isRecruiter = profile === "recruiter";
  return {
    robots: isRecruiter ? "index, follow" : "noindex, follow",
  };
}

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;

  if (!(PROFILE_TYPES as readonly string[]).includes(profile)) {
    redirect("/");
  }

  return (
    <ProfileProvider profileType={profile as ProfileType}>
      <PageTransition>{children}</PageTransition>
    </ProfileProvider>
  );
}
