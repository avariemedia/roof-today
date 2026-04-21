import AudiencePageTemplate from "@/components/AudiencePageTemplate";

export const metadata = {
  title: "Roof Reports for Insurance Adjusters — $19 Per Report, Fully Documented",
  description:
    "Insurance adjusters: get fully documented aerial roof measurement reports with squares, pitch, and linear footage for claims. $19 per report.",
  alternates: { canonical: "/for/insurance-adjusters" },
};

export default function Page() {
  return (
    <AudiencePageTemplate
      h1="Roof reports for claims. Documented and fast."
      subhead="Every measurement adjusters need. None of the bloat."
      intro="Insurance adjusters need documented, tolerance-bound roof measurements — delivered fast. Roof Today reports include every category required for claim documentation, are accepted on claims daily, and ship with our ±2% accuracy guarantee."
      useCases={[
        { title: "First-look estimates", body: "Pull a report before scheduling a site inspection." },
        { title: "Supplemental documentation", body: "Back up field measurements with a third-party aerial report." },
        { title: "Claim verification", body: "Cross-check contractor-supplied measurements independently." },
      ]}
      benefits={[
        "Full measurement categories: squares, pitch, ridge, hip, valley, eave, rake, waste factor",
        "Aerial diagram included on every report",
        "±2% accuracy guarantee",
        "Report ID and audit trail",
        "Fast, repeatable, low cost",
      ]}
    />
  );
}
