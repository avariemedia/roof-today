import VsPageTemplate from "@/components/VsPageTemplate";

export const metadata = {
  title: "Hover Alternative — Roof Today Delivers Instantly With No App Required",
  description:
    "Hover alternative: Roof Today doesn't require a homeowner to take photos. Enter any address, get an instant aerial roof measurement report for as low as $4. No app, no photos, no wait.",
  alternates: { canonical: "/vs/hover" },
};

export default function Page() {
  return (
    <VsPageTemplate
      competitor="Hover"
      tagline="No app. No photos. No homeowner required."
      intro="Hover requires a homeowner (or someone on-site) to take guided photos with their phone — then waits for processing. Roof Today skips all of that. Enter any U.S. address and get a full aerial roof measurement report in minutes. No app download, no photo shoot, no coordination."
      rows={[
        { feature: "Price per report", rt: "From $5", them: "~$50" },
        { feature: "Homeowner photos required", rt: false, them: true },
        { feature: "Turnaround", rt: "Minutes", them: "Hours" },
        { feature: "Works without site access", rt: true, them: false },
        { feature: "Free sample preview", rt: true, them: false },
        { feature: "Insurance-ready PDF", rt: true, them: true },
        { feature: "Mobile-first UX", rt: true, them: true },
      ]}
      pros={[
        "No on-site photo shoot required",
        "Generate reports on cold leads before any contact",
        "~$31 savings per report vs Hover",
        "Instant delivery — no processing wait",
        "Free preview on any address",
      ]}
      cons={[
        "Requires someone on-site to take photos",
        "Adds friction to the sales cycle",
        "Can't preview a lead's property before outreach",
        "Processing wait before you see data",
      ]}
      savings={{ reports: 20, annual: 7440 }}
      faqItems={[
        {
          q: "Do I have to visit the property to use Roof Today?",
          a: "No. Roof Today uses aerial imagery — you just need the address. This is ideal for cold outreach, canvassing estimates, and insurance claims where on-site access isn't immediate.",
        },
        {
          q: "Is Roof Today as accurate as Hover when there are no site photos?",
          a: "Yes — within our ±2% guarantee. If a property has significant occlusion (heavy tree cover) that affects accuracy, we'll flag it and refund if the report can't be completed to tolerance.",
        },
        {
          q: "Can I use Roof Today for siding or walls like Hover?",
          a: "Roof Today is laser-focused on roofs. If you need wall/siding measurements, pair Roof Today (for the roof) with a separate tool for walls.",
        },
      ]}
    />
  );
}
