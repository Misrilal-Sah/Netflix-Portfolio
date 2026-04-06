"use client";

import type { ProfileType } from "@/lib/constants";
import { ContactClient } from "./contact-client";
import type { ContactPageCopy } from "@/lib/data/page-copy";
import type { ContactInfoData } from "@/lib/data/contact-info";

interface RecaptchaWrapperProps {
  profile: ProfileType;
  copy: ContactPageCopy;
  contactInfo: ContactInfoData;
  /** reCAPTCHA v2 site key. When absent, captcha is skipped. */
  siteKey: string | undefined;
}

export function RecaptchaWrapper({ profile, copy, contactInfo, siteKey }: RecaptchaWrapperProps) {
  return (
    <ContactClient
      profile={profile}
      copy={copy}
      contactInfo={contactInfo}
      recaptchaSiteKey={siteKey}
    />
  );
}
