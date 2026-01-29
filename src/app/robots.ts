import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://overlymarketing.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/coming-soon"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
