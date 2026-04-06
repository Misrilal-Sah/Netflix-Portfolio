/**
 * Maps certification providers to their logos and verification URLs
 */

interface ProviderInfo {
  logo: string;
  verificationBaseUrl?: string;
}

const PROVIDER_MAP: Record<string, ProviderInfo> = {
  Stripe: {
    logo: "/images/certification/stripe-svgrepo-com.svg",
    verificationBaseUrl: "https://www.credential.net/",
  },
  Udemy: {
    logo: "/images/certification/udemy-svgrepo-com.svg",
    verificationBaseUrl: "https://www.udemy.com/certificate/",
  },
  Coursera: {
    logo: "/images/certification/coursera-svgrepo-com.svg",
    verificationBaseUrl: "https://www.coursera.org/verify/",
  },
  "Coursera (Meta)": {
    logo: "/images/certification/coursera-svgrepo-com.svg",
    verificationBaseUrl: "https://www.coursera.org/verify/",
  },
  HackerRank: {
    logo: "/images/certification/hackerrank.svg",
    verificationBaseUrl: "https://www.hackerrank.com/certificates/",
  },
  Ciklum: {
    logo: "/images/certification/ciklum.svg",
  },
  Codio: {
    logo: "/images/certification/codio-svgrepo-com.svg",
    verificationBaseUrl: "https://codio.com/",
  },
  "Codio (Coursera)": {
    logo: "/images/certification/coursera-svgrepo-com.svg",
    verificationBaseUrl: "https://www.coursera.org/verify/",
  },
  LinkedIn: {
    logo: "/images/certification/linkedin.svg",
    verificationBaseUrl: "https://www.linkedin.com/learning/",
  },
  "LinkedIn Learning": {
    logo: "/images/certification/linkedin.svg",
    verificationBaseUrl: "https://www.linkedin.com/learning/",
  },
  "University of Michigan": {
    logo: "/images/certification/coursera-svgrepo-com.svg",
    verificationBaseUrl: "https://www.coursera.org/verify/",
  },
  Meta: {
    logo: "/images/certification/coursera-svgrepo-com.svg",
    verificationBaseUrl: "https://www.coursera.org/verify/",
  },
};

export function getProviderInfo(provider: string): ProviderInfo | null {
  // Try exact match first
  if (PROVIDER_MAP[provider]) {
    return PROVIDER_MAP[provider];
  }

  // Try partial match — handles "Provider (Platform)" patterns
  const parenIdx = provider.indexOf("(");
  if (parenIdx !== -1) {
    const base = provider.slice(0, parenIdx).trim();
    if (PROVIDER_MAP[base]) return PROVIDER_MAP[base];
  }

  // Try substring match for compound names like "LinkedIn Learning"
  for (const key of Object.keys(PROVIDER_MAP)) {
    if (provider.toLowerCase().includes(key.toLowerCase())) {
      return PROVIDER_MAP[key];
    }
  }

  return null;
}

