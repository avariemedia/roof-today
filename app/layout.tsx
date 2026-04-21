import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.roof-today.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Roof Today — Accurate Aerial Roof Measurement Reports. 2 for $25.",
    template: "%s | Roof Today",
  },
  description:
    "Accurate aerial roof measurement reports in minutes — up to 70% cheaper than EagleView. Enter any address, preview your report free, pay only when you need it. No subscription. No contracts.",
  keywords: [
    "roof measurement report",
    "aerial roof measurement",
    "EagleView alternative",
    "GAF QuickMeasure alternative",
    "instant roof report",
    "cheap roof measurements",
    "roof report for contractors",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Roof Today",
    title: "Roof Today — Accurate Aerial Roof Measurement Reports.",
    description:
      "The EagleView alternative contractors actually use. Accurate to ±2%. Reports in minutes. 2 reports $25 · 10 for $50. Free sample on any address.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Roof Today" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roof Today — Roof Reports from $5 each. No Subscription.",
    description:
      "The EagleView alternative contractors actually use. Free sample on any address.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0A1428",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: "Roof Today",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: "Roof Today",
        publisher: { "@id": `${SITE_URL}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Roof Today",
        operatingSystem: "Web",
        applicationCategory: "BusinessApplication",
        offers: { "@type": "Offer", price: "19.00", priceCurrency: "USD" },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "218",
        },
      },
    ],
  };

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
