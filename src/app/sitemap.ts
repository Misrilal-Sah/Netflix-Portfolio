import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://misril.dev";
  const lastModified = new Date();

  const publicPages = [
    "",
    "/projects",
    "/experience",
    "/skills",
    "/certifications",
    "/about",
    "/contact",
  ];

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Only /recruiter/* in sitemap — canonical profile to avoid duplicate content
    ...publicPages.map((path) => ({
      url: `${baseUrl}/recruiter${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 0.9 : 0.8,
    })),
  ];
}
