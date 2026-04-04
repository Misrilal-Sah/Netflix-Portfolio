"use client";

import { useProfileContext } from "@/lib/contexts/profile-context";

export function useProfile() {
  return useProfileContext();
}
