import VsPageTemplate from "@/components/VsPageTemplate";

export const metadata = {
  title: "EagleView Alternative — Roof Today is 70% Cheaper, Delivered in Minutes",
  description:
    "Looking for an EagleView alternative? Roof Today delivers the same roof measurement reports for as low as $4 (vs ~$85), in minutes, with no subscription. Free sample on any address.",
  alternates: { canonical: "/vs/eagleview" },
};

export default function Page() {
  return (
    <VsPageTemplate
      competitor="EagleView"
      tagline="Same measurements. 77% cheaper. No subscription."
      intro="EagleView is the legacy name in aerial roof measurements. It works — but it costs ~$85 per report, locks you into subscriptions or minimums, and turnaround can stretch from hours to a full day. Roof Today was built as the no-BS alternative for contractors who just want accurate measurements, fast, at a fair price. Same measurement categories, ±2% accuracy guarantee, insurance-ready PDFs — for as low as $4."
      rows={[
        { feature: "Price per report", rt: "From $5", them: "~$85" },
        { feature: "Turnaround", rt: "Minutes", them: "2–24 hours" },
        { feature: "Subscription required", rt: false, them: true },
        { feature: "Free sample preview", rt: true, them: false },
        { feature: "Pay-per-report option", rt: true, them: false },
        { feature: "Insurance-ready PDF", rt: true, them: true },
        { feature: "Accuracy guarantee", rt: "±2%", them: "Varies" },
        { feature: "Mobile-first UX", rt: true, them: false },
        { feature: "Cancel anytime", rt: true, them: "With friction" },
      ]}
      pros={[
        "~$72–$81 savings on every single report",
        "No subscription. Pay only when you need a report.",
        "Reports in minutes, not hours",
        "Free preview on any address before you pay",
        "Built mobile-first for contractors in the field",
        "Magic-link login — no passwords, no account hoops",
      ]}
      cons={[
        "Price per report is 4–5x higher than Roof Today",
        "Requires subscription or account commitment",
        "Turnaround often stretches from hours to a full day",
        "No free sample to verify accuracy before buying",
        "Dashboard designed for desktop, not jobsites",
      ]}
      savings={{ reports: 20, annual: 15840 }}
      faqItems={[
        {
          q: "Is Roof Today really a full EagleView alternative?",
          a: "Yes. Roof Today provides the same core measurement categories insurance and contractors need: total squares, predominant pitch, facet-by-facet breakdown, ridge/hip/valley/eave/rake linear feet, and waste factor. Reports are delivered as insurance-ready PDFs with an aerial diagram.",
        },
        {
          q: "How much does an EagleView report cost?",
          a: "EagleView reports typically run $60–$100+ per report depending on complexity and plan tier. Roof Today runs $4–$12.50 per report depending on pack size — 85%–95% less.",
        },
        {
          q: "Can I cancel EagleView and switch?",
          a: "Yes, and you can start using Roof Today the same day. There's no subscription to activate — just enter an address and preview a free sample.",
        },
        {
          q: "Is Roof Today accurate enough for insurance claims?",
          a: "Yes. Roof Today guarantees ±2% accuracy and contractors use our reports for insurance claims daily. If a report is outside tolerance, we refund it and re-run.",
        },
        {
          q: "Does Roof Today have an API like EagleView?",
          a: "Yes — API access is included on the Team plan for high-volume contractors and partners. Contact sales.",
        },
      ]}
    />
  );
}
