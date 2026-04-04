"use client";

import { useRouter } from "next/navigation";
import { PROFILE_TYPES, type ProfileType } from "@/lib/constants";
import { ProfileAvatar } from "./profile-avatar";

export function ProfileSelector() {
  const router = useRouter();

  const handleSelect = (profile: ProfileType) => {
    router.push(`/${profile}`);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center">
      <h1 className="text-[length:var(--font-size-display)] font-bold text-text mb-xl">
        Who&apos;s Watching?
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-lg">
        {PROFILE_TYPES.map((profileType) => (
          <ProfileAvatar
            key={profileType}
            profile={profileType}
            onClick={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
