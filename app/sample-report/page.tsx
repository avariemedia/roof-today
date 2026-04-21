import AddressCapture from "@/components/AddressCapture";
import FAQ from "@/components/FAQ";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import TrustBar from "@/components/TrustBar";
import RoofDiagram from "@/components/RoofDiagram";

export const metadata = {
  title: "Free Roof Measurement Sample Report — Any U.S. Address",
  description:
    "Generate a free roof measurement sample report on any U.S. address. See total squares, pitch, and facet diagram instantly. Unlock full detail for $19.",
  alternates: { canonical: "/sample-report" },
};

const faqItems = [
  { q: "Is the sample report really free?", a: "Yes. You can preview any U.S. address — total squares, predominant pitch, and aerial facet diagram — for free, no signup required. Full facet-by-facet measurements and the downloadable PDF unlock for $19." },
  { q: "How accurate is the preview?", a: "The preview uses the same measurement engine as paid reports. The numbers you see are the numbers you'll get — we just lock the deeper detail behind checkout." },
  { q: "Do I need an account?", a: "No. Enter an address and go. If you unlock, we create your account automatically via magic link." },
];

export default function SampleReportPage() {
  return (
    <>
      <section className="py-14 md:py-20 bg-gradient-to-b from-trust-50/60 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-go-50 text-go-700 border border-go-200 rounded-full px-3 py-1 text-xs font-semibold">
            Free · No signup · Instant
          </div>
          <h1 className="mt-5 text-display-lg text-ink-900">
            See a roof report on <span className="text-trust-700">any address.</span> Free.
          </h1>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
            Test Roof Today on a property you already know — your house, a current job, or a storm-damaged claim. If the numbers match, unlock the full report for $19.
          </p>
          <div className="mt-8 max-w-xl mx-auto"><AddressCapture size="lg" autoFocus /></div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-display-md text-ink-900">What you get — for free</h2>
            <ul className="mt-6 space-y-3 text-stone-700">
              <li className="flex gap-2"><span className="text-go-600">✓</span> Property aerial with roof outlined</li>
              <li className="flex gap-2"><span className="text-go-600">✓</span> Facets automatically detected and visualized</li>
              <li className="flex gap-2"><span className="text-go-600">✓</span> Total squares (whole-number)</li>
              <li className="flex gap-2"><span className="text-go-600">✓</span> Predominant pitch</li>
              <li className="flex gap-2"><span className="text-go-600">✓</span> Facet count</li>
            </ul>
            <h3 className="mt-8 font-semibold text-ink-900">Unlock for $19:</h3>
            <ul className="mt-3 space-y-2 text-stone-600 text-sm">
              <li>• Ridge, hip, valley, eave, rake linear feet</li>
              <li>• Waste factor calculation</li>
              <li>• Facet-by-facet square breakdown</li>
              <li>• Downloadable insurance-ready PDF</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-stone-200 shadow-card p-5 bg-white">
            <RoofDiagram seed="sample-demo" />
          </div>
        </div>
      </section>

      <section className="py-14 bg-stone-50 border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><TrustBar /></div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-md text-ink-900 text-center">Common questions</h2>
          <div className="mt-8"><FAQ items={faqItems} /></div>
        </div>
      </section>

      <MobileStickyCTA label="Try any address" />
    </>
  );
}
