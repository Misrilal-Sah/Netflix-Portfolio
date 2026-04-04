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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-bg text-text">
      <body className="font-sans min-h-screen antialiased">{children}</body>
    </html>
  );
}
