"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import type { ProfileType } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface ProfileContextValue {
  profile: ProfileType;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({
  profileType,
  children,
}: {
  profileType: ProfileType;
  children: ReactNode;
}) {
  const [, setStoredProfile] = useLocalStorage<ProfileType>(
    "selected_profile",
    profileType
  );

  // Sync URL profile to localStorage
  useEffect(() => {
    setStoredProfile(profileType);
  }, [profileType, setStoredProfile]);

  return (
    <ProfileContext.Provider value={{ profile: profileType }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
}
