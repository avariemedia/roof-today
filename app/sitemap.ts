import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.roof-today.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    "", "/pricing", "/sample-report",
    "/vs/eagleview", "/vs/gaf-quickmeasure", "/vs/hover",
    "/for/roofing-contractors", "/for/solar-installers", "/for/insurance-adjusters", "/for/storm-restoration",
    "/features/accuracy", "/features/speed", "/features/insurance-reports",
    "/terms", "/privacy", "/refund", "/contact",
  ];
  return pages.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
}
