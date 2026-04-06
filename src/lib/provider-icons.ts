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
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2300EA64' d='M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.5 16.5h-2v-3.5h-7v3.5h-2v-9h2v3.5h7V7.5h2v9z'/%3E%3C/svg%3E",
    verificationBaseUrl: "https://www.hackerrank.com/certificates/",
  },
  Ciklum: {
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%232E3192'/%3E%3Ctext x='12' y='16' text-anchor='middle' fill='white' font-size='10' font-family='Arial' font-weight='bold'%3EC%3C/text%3E%3C/svg%3E",
  },
  Codio: {
    logo: "/images/certification/codio-svgrepo-com.svg",
    verificationBaseUrl: "https://codio.com/",
  },
  "Codio (Coursera)": {
    logo: "/images/certification/codio-svgrepo-com.svg",
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
