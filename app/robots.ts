import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.roof-today.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/checkout", "/report/preview", "/dashboard", "/api/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
