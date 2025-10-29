import type { MetadataRoute } from "next";

// Use the canonical with "www" (matches your live domain)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://overlymarketing.com";

/**
 * Because the site is a single-page app (sections like #work, #services),
 * we only list real routes in the sitemap. Hash fragments are ignored by search engines.
 * Add more entries here only when you create real routes like /privacy, /terms, /blog, etc.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod = new Date().toISOString();

  return [
    {
      url: BASE_URL,
      lastModified: lastmod,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: lastmod,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: lastmod,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}