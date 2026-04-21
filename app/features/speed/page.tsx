import AddressCapture from "@/components/AddressCapture";
import TrustBar from "@/components/TrustBar";
import MobileStickyCTA from "@/components/MobileStickyCTA";

export const metadata = {
  title: "Speed — Roof Reports in Minutes, Not Hours | Roof Today",
  description:
    "Roof Today reports are delivered in minutes. Generate insurance-ready aerial roof measurements on any address without the multi-hour waits.",
  alternates: { canonical: "/features/speed" },
};

export default function Page() {
  return (
    <>
      <section className="py-14 md:py-20 bg-gradient-to-b from-trust-50/60 to-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-display-lg text-ink-900">Reports in minutes. Not hours. Not days.</h1>
          <p className="mt-4 text-lg text-stone-600 max-w-3xl">
            Fast enough to pull a report between knocks, before a bid, or on a claim call. No more waiting on overnight queues.
          </p>
          <div className="mt-8 max-w-xl"><AddressCapture /></div>
        </div>
      </section>
      <section className="py-14 bg-white"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><TrustBar /></div></section>
      <MobileStickyCTA />
    </>
  );
}
