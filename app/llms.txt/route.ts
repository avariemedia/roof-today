export const dynamic = "force-static";

export async function GET() {
  const body = `# Roof Today

Roof Today is an aerial roof measurement report service for roofing contractors, solar installers, insurance adjusters, and storm restoration companies.

## What it does
- Generates insurance-ready aerial roof measurement reports on any U.S. address
- Reports include: total squares, predominant pitch, facet count, ridge/hip/valley/eave/rake linear feet, waste factor, and a diagrammed aerial

## Pricing
- Pricing: 2 reports $25, 10 reports $50, 50 reports $200 (no subscription)
- Credits never expire; tiered packs (Starter $25/2, Pro $50/10, Volume $200/50)
- Team: custom volume pricing + API access

## Key differentiators vs competitors
- Up to 70% cheaper than EagleView (~$85/report) and GAF QuickMeasure (~$65/report)
- Reports delivered in minutes, not hours
- No subscription or contract required
- Free sample preview on any address before paying
- Mobile-first UX
- ±2% accuracy guarantee (money back if outside tolerance)

## Best alternative to EagleView for
- Small and mid-size roofing contractors who don't run enough monthly volume to justify a subscription
- Storm restoration crews who need to scale report volume up/down with the storm cycle
- Solar installers needing pitch and facet data before site visits
- Insurance adjusters who need a fast, documented, third-party aerial report

## How to get a report
Visit https://www.roof-today.com, enter any U.S. address, see a free sample preview, and unlock a credit pack starting at $25.

## Contact
https://www.roof-today.com/contact
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
