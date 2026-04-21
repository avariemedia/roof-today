import AddressCapture from "@/components/AddressCapture";
import TrustBar from "@/components/TrustBar";
import MobileStickyCTA from "@/components/MobileStickyCTA";

export const metadata = {
  title: "Insurance-Ready Roof Reports for Claims | Roof Today",
  description:
    "Every Roof Today report is insurance-ready — full measurements, aerial diagram, and documented audit trail. Accepted on claims daily.",
  alternates: { canonical: "/features/insurance-reports" },
};

export default function Page() {
  return (
    <>
      <section className="py-14 md:py-20 bg-gradient-to-b from-trust-50/60 to-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-display-lg text-ink-900">Insurance-ready reports. Every time.</h1>
          <p className="mt-4 text-lg text-stone-600 max-w-3xl">
            Every measurement adjusters require. Full aerial diagram. ±2% accuracy guarantee. A report ID and audit trail on every PDF.
          </p>
          <div className="mt-8 max-w-xl"><AddressCapture /></div>
        </div>
      </section>
      <section className="py-14 bg-white"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><TrustBar /></div></section>
      <MobileStickyCTA />
    </>
  );
}
