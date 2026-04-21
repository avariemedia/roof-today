import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roof Today — Instant roof measurement reports",
  description:
    "EagleView-grade roof measurement reports in seconds. Photogrammetry + AI from public aerial imagery. Squares, pitch, facets, ridge/hip/valley/eave/rake — delivered as a PDF.",
  openGraph: {
    title: "Roof Today",
    description: "Instant, accurate roof measurement reports.",
    type: "website",
  },
};

const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased">
        {GMAPS_KEY ? (
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&libraries=places&v=weekly`}
            strategy="afterInteractive"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
