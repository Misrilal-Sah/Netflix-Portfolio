import { redirect } from "next/navigation";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { ProfileProvider } from "@/lib/contexts/profile-context";
import { PageTransition } from "@/components/shared/page-transition";

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
