"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import type { ProfileType } from "@/lib/constants";
import { ContactClient } from "./contact-client";

interface RecaptchaWrapperProps {
  profile: ProfileType;
  siteKey: string | undefined;
}

export function RecaptchaWrapper({ profile, siteKey }: RecaptchaWrapperProps) {
  if (!siteKey) {
    return <ContactClient profile={profile} />;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <ContactClient profile={profile} useRecaptcha />
    </GoogleReCaptchaProvider>
  );
}
