import AudiencePageTemplate from "@/components/AudiencePageTemplate";

export const metadata = {
  title: "Roof Measurement Reports for Roofing Contractors — From $5 Per Report | Roof Today",
  description:
    "The roof measurement tool built for roofing contractors. As low as $4 per report, delivered in minutes, no subscription. Free preview on any address.",
  alternates: { canonical: "/for/roofing-contractors" },
};

export default function Page() {
  return (
    <AudiencePageTemplate
      h1="Roof reports built for roofing contractors."
      subhead="Bid faster. Close more. Stop paying EagleView rent."
      intro="You don't need a subscription. You need accurate measurements, right now, from your truck, at a fair price. Roof Today is purpose-built for roofing contractors who want to bid faster, close more jobs, and keep more margin."
      useCases={[
        { title: "Same-day estimates", body: "Pull a report in the driveway before you hand over a bid. Your homeowner is sold on your speed before you've even talked price." },
        { title: "Canvassing storm neighborhoods", body: "Pre-measure entire blocks before knocking. Know which houses are worth the door." },
        { title: "Insurance claims", body: "Full measurement reports, insurance-ready PDFs, accepted on claims daily." },
        { title: "Material ordering", body: "Accurate squares + waste factor means no over-ordering and no surprise mid-job trips." },
      ]}
      benefits={[
        "Tiered pricing ($25 for 2, $50 for 10) — budget-friendly for solo ops and crews",
        "No subscription lock-in",
        "Mobile-first — run it from your truck",
        "Insurance-ready PDFs every time",
        "Free preview before you commit",
        "Apple Pay + Google Pay checkout",
      ]}
    />
  );
}
