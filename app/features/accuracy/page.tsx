import AddressCapture from "@/components/AddressCapture";
import TrustBar from "@/components/TrustBar";
import Testimonials from "@/components/Testimonials";
import MobileStickyCTA from "@/components/MobileStickyCTA";

export const metadata = {
  title: "Accuracy — ±2% Guarantee on Every Roof Report | Roof Today",
  description:
    "Roof Today guarantees ±2% accuracy on every roof measurement report. If a report is outside tolerance, we refund and re-run at no cost.",
  alternates: { canonical: "/features/accuracy" },
};

export default function Page() {
  return (
    <>
      <section className="py-14 md:py-20 bg-gradient-to-b from-trust-50/60 to-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-display-lg text-ink-900">Accuracy you can stake a job on.</h1>
          <p className="mt-4 text-lg text-stone-600 max-w-3xl">
            Every Roof Today report ships with a ±2% accuracy guarantee. If a measurement is outside that tolerance, we refund and re-run — no questions.
          </p>
          <div className="mt-8 max-w-xl"><AddressCapture /></div>
        </div>
      </section>
      <section className="py-14 bg-white"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><TrustBar /></div></section>
      <section className="py-14 bg-stone-50 border-y border-stone-200"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><Testimonials /></div></section>
      <MobileStickyCTA />
    </>
  );
}
