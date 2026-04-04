import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Misril.dev — Developer Portfolio",
  description:
    "Full Stack Developer portfolio — Netflix-style experience showcasing projects, skills, and certifications.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://misril.dev"
  ),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Misrilal Sah",
  url: "https://misril.dev",
  jobTitle: "Full Stack Developer",
  worksFor: {
    "@type": "Organization",
    name: "Ciklum India",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Mumbai",
  },
  knowsAbout: [
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Supabase",
    "Docker",
    "AI/ML",
  ],
  sameAs: [
    "https://github.com/misrilal",
    "https://linkedin.com/in/misrilal",
  ],
  image: "https://misril.dev/images/Misril.jpeg",
  description:
    "Full Stack Developer with 2+ years building production React, Node.js, and AI applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-bg text-text">
      <body className="font-sans min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
