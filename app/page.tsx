import Link from "next/link";
import AddressCapture from "@/components/AddressCapture";
import TrustBar from "@/components/TrustBar";
import ComparisonTable from "@/components/ComparisonTable";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import RoofDiagram from "@/components/RoofDiagram";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import { ArrowRight, Check, Clock, DollarSign, MapPin, Shield, Zap } from "lucide-react";

export const metadata = {
  title: "Roof Today — Accurate Aerial Roof Measurement Reports. 2 for $25.",
  description:
    "Accurate aerial roof measurement reports in minutes — up to 70% cheaper than EagleView. Enter any address, preview your report free, pay only when you need it.",
  alternates: { canonical: "/" },
};

const faqItems = [
  {
    q: "How much does a Roof Today report cost?",
    a: "Tiered: 2 reports for $25 (Starter), 10 for $50 (Pro), 50 for $200 (Volume). That's as low as $4 per report. One-time purchase — no subscription, no contracts, credits never expire.",
  },
  {
    q: "How is Roof Today different from EagleView?",
    a: "EagleView typically costs around $85 per report and requires a subscription or account commitment. Roof Today runs as low as $4 per report with no subscription, delivers in minutes instead of hours, and lets you preview any address for free before paying.",
  },
  {
    q: "How accurate are Roof Today measurements?",
    a: "Reports are accurate within ±2%. If yours isn't, we refund you and re-run the report. Measurements include total squares, predominant pitch, facet-by-facet breakdown, ridges, hips, valleys, eaves, rakes, and waste factor.",
  },
  {
    q: "Will insurance accept a Roof Today report?",
    a: "Yes. Reports include the same measurement categories insurance adjusters require — total squares, pitch, linear feet of ridges/hips/valleys/eaves/rakes, waste factor, and an aerial diagram. Contractors use them for insurance claims daily.",
  },
  {
    q: "How fast are reports delivered?",
    a: "Most reports are delivered within minutes of purchase. Complex or unusual properties may take up to an hour. You'll see an ETA at checkout.",
  },
  {
    q: "Do I need to sign up or create an account?",
    a: "No. You can preview any address for free with zero signup. When you unlock a report, we auto-create your account via magic link — no passwords, no friction.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-trust-50/50 to-white">
        <div className="absolute inset-0 aerial-grid opacity-40 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-16 md:pb-24">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-go-50 text-go-700 border border-go-200 rounded-full px-3 py-1 text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-go-500 rounded-full animate-pulse" />
                10,000+ contractors switched from EagleView
              </div>

              <h1 className="mt-5 font-extrabold tracking-tight text-ink-900 text-display-xl">
                Roof reports in <span className="text-go-600">minutes.</span>
                <br className="hidden sm:block" />
                <span className="text-trust-700">From $5.</span> No subscription.
              </h1>

              <p className="mt-5 text-lg md:text-xl text-stone-600 max-w-xl leading-relaxed">
                The EagleView alternative contractors actually use. Enter any address, preview your
                roof report free, pay only when you need the full data.
              </p>

              <div className="mt-8 max-w-xl">
                <AddressCapture size="lg" />
              </div>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-600">
                <span className="inline-flex items-center gap-1.5"><Check size={16} className="text-go-600" /> Free sample on any address</span>
                <span className="inline-flex items-center gap-1.5"><Check size={16} className="text-go-600" /> ±2% accuracy guarantee</span>
                <span className="inline-flex items-center gap-1.5"><Check size={16} className="text-go-600" /> Insurance-ready PDF</span>
              </div>
            </div>

            {/* Live report preview */}
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-trust-200/40 to-go-200/40 blur-3xl -z-10" />
              <div className="rounded-2xl border border-stone-200 bg-white shadow-trust overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100 bg-stone-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-go-500" />
                  </div>
                  <div className="text-xs font-mono text-stone-500">roof-today.com/report/RT-4821736</div>
                </div>
                <div className="p-5">
                  <RoofDiagram seed="hero" />
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <Stat label="Total Squares" value="28.4" />
                    <Stat label="Pitch" value="6/12" />
                    <Stat label="Facets" value="9" />
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-go-50 border border-go-200 px-4 py-3">
                    <div className="text-sm">
                      <div className="font-semibold text-go-700">Report ready in 2:47</div>
                      <div className="text-xs text-go-700/70">Generated {" "}
                        <span className="font-mono">1,284</span> today
                      </div>
                    </div>
                    <Link href="/#address" className="text-sm font-semibold text-go-700 inline-flex items-center gap-1">
                      Try yours <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <TrustBar />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — Gamified 3-step */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-bold tracking-[0.2em] text-trust-600 uppercase">How it works</div>
            <h2 className="mt-3 text-display-md text-ink-900">Three taps to a full roof report</h2>
            <p className="mt-4 text-stone-600 text-lg">Built for contractors standing in a driveway with one thumb free.</p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[
              { n: "01", icon: MapPin, title: "Enter any address", body: "Google-powered autocomplete. No signup. No credit card. Takes 5 seconds." },
              { n: "02", icon: Zap, title: "Preview instantly", body: "Our system finds your roof, maps every facet, and generates your report in seconds." },
              { n: "03", icon: DollarSign, title: "Unlock a pack", body: "One tap. Starter 2 for $25 or Pro 10 for $50. Apple Pay, Google Pay, or card. Full PDFs emailed instantly." },
            ].map((step) => (
              <div key={step.n} className="relative rounded-2xl border border-stone-200 bg-white p-7 shadow-card">
                <div className="absolute -top-3 left-7 text-xs font-mono font-bold tracking-wider bg-ink-900 text-white px-2.5 py-1 rounded">
                  STEP {step.n}
                </div>
                <step.icon className="text-go-600" size={28} />
                <h3 className="mt-4 font-bold text-lg text-ink-900">{step.title}</h3>
                <p className="mt-2 text-stone-600 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-16 md:py-24 bg-stone-50 border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-xs font-bold tracking-[0.2em] text-trust-600 uppercase">The smarter choice</div>
            <h2 className="mt-3 text-display-md text-ink-900">
              Roof Today vs EagleView, GAF, and Hover
            </h2>
            <p className="mt-4 text-stone-600 text-lg">
              Same accuracy. Same insurance-ready output. Fraction of the price. None of the subscription games.
            </p>
          </div>
          <div className="mt-10">
            <ComparisonTable />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/vs/eagleview"
              className="inline-flex items-center gap-1 text-trust-700 font-semibold hover:text-trust-800"
            >
              Full EagleView comparison <ArrowRight size={16} />
            </Link>
            <span className="text-stone-400">·</span>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-trust-700 font-semibold hover:text-trust-800"
            >
              See all pricing <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* SAVINGS CALCULATOR TEASER */}
      <section className="py-16 md:py-20 bg-ink-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 aerial-grid opacity-20 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-go-500/15 text-go-300 border border-go-500/30 rounded-full px-3 py-1 text-xs font-semibold">
              The math is brutal
            </div>
            <h2 className="mt-4 text-display-md text-white">
              Run 20 reports a month? You're burning{" "}
              <span className="text-go-400">$19,200/year</span> on EagleView.
            </h2>
            <p className="mt-4 text-stone-300 text-lg max-w-lg">
              That's a new truck payment. A bigger ad budget. A hire. Stop renting roof data.
            </p>
            <Link
              href="/pricing"
              className="mt-8 inline-flex items-center gap-2 bg-go-500 hover:bg-go-600 text-white font-semibold px-6 py-3.5 rounded-xl shadow-go"
            >
              See your savings <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SavingsCard count={5} />
            <SavingsCard count={10} />
            <SavingsCard count={20} highlight />
            <SavingsCard count={50} />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-bold tracking-[0.2em] text-trust-600 uppercase">Trusted by contractors</div>
            <h2 className="mt-3 text-display-md text-ink-900">Real contractors. Real savings.</h2>
          </div>
          <div className="mt-12">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-trust-700 via-trust-800 to-ink-900 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="mx-auto text-go-400" size={32} />
          <h2 className="mt-4 text-display-lg text-white">
            2 reports for $25.
            <br />
            Preview any address free.
          </h2>
          <p className="mt-4 text-trust-100 text-lg">
            Enter any U.S. address. See a real report in seconds. Unlock a 2-pack for $25 or a 10-pack for $50.
          </p>
          <div className="mt-8 max-w-xl mx-auto">
            <AddressCapture size="lg" placeholder="123 Main St, Your City, ST" />
          </div>
          <div className="mt-5 text-sm text-trust-200">
            <Clock className="inline mr-1" size={14} /> Avg. preview: 3 seconds · Avg. full report: under 5 minutes
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-stone-50 border-t border-stone-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xs font-bold tracking-[0.2em] text-trust-600 uppercase">FAQ</div>
            <h2 className="mt-3 text-display-md text-ink-900">Questions contractors ask</h2>
          </div>
          <div className="mt-10">
            <FAQ items={faqItems} />
          </div>
        </div>
      </section>

      <MobileStickyCTA label="Get Free Sample" price="From $25" />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-stone-50 border border-stone-200 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider font-bold text-stone-500">{label}</div>
      <div className="font-mono font-bold text-ink-900 text-lg">{value}</div>
    </div>
  );
}

function SavingsCard({ count, highlight }: { count: number; highlight?: boolean }) {
  // Blended Roof Today cost per report based on cheapest tier applicable
  const perReport = count >= 50 ? 4 : count >= 10 ? 5 : 12.5;
  const evCost = count * 85 * 12;
  const rtCost = Math.round(count * perReport * 12);
  const saved = evCost - rtCost;
  return (
    <div
      className={`rounded-2xl p-5 border ${
        highlight
          ? "bg-go-500/10 border-go-500/50 shadow-go"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div className="text-xs font-semibold text-stone-300">{count} reports/mo</div>
      <div className="mt-2 text-2xl font-extrabold text-go-300">
        ${saved.toLocaleString()}
      </div>
      <div className="text-[11px] text-stone-400">saved per year</div>
    </div>
  );
}
