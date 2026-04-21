import AudiencePageTemplate from "@/components/AudiencePageTemplate";

export const metadata = {
  title: "Roof Measurements for Storm Restoration — Canvass Faster, Close More Claims",
  description:
    "Storm restoration contractors: pre-measure entire neighborhoods before knocking. $19 per report. Insurance-ready. No subscription.",
  alternates: { canonical: "/for/storm-restoration" },
};

export default function Page() {
  return (
    <AudiencePageTemplate
      h1="Storm restoration. Canvass smarter. Close faster."
      subhead="Know every roof on the block — before you knock."
      intro="When a storm hits, speed decides who gets the contract. Roof Today lets storm restoration crews pre-measure entire blocks, qualify leads before the knock, and close insurance claims with documented reports."
      useCases={[
        { title: "Pre-knock canvassing", body: "Batch-preview whole neighborhoods. Prioritize the roofs with the most damage potential." },
        { title: "Insurance claim submission", body: "Ship a documented, insurance-ready report with every claim." },
        { title: "Crew scheduling", body: "Accurate squares means accurate material + labor scheduling — no wasted trips." },
      ]}
      benefits={[
        "Pre-measure any address in minutes",
        "$19 per report keeps canvass economics healthy",
        "Insurance-ready PDFs",
        "No subscription — scale up or down with the storm cycle",
        "Mobile-first for field crews",
      ]}
    />
  );
}
