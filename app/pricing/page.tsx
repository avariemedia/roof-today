import Link from "next/link";
import { Check, ArrowRight, Shield, Zap, Crown } from "lucide-react";
import ComparisonTable from "@/components/ComparisonTable";
import FAQ from "@/components/FAQ";
import MobileStickyCTA from "@/components/MobileStickyCTA";

export const metadata = {
  title: "Roof Today Pricing — $19 Per Report. No Subscription.",
  description:
    "Pay $19 per roof measurement report. No subscription, no contracts, no minimums. Volume plans available. Up to 70% less than EagleView.",
  alternates: { canonical: "/pricing" },
};

const tiers = [
  {
    name: "Pay Per Report",
    price: "$19",
    sub: "per report",
    best: true,
    features: [
      "Reports in minutes",
      "Insurance-ready PDF",
      "Interactive diagram",
      "±2% accuracy guarantee",
      "No subscription. Ever.",
    ],
    cta: "Start with 1 Report",
    href: "/#address",
  },
  {
    name: "Pro",
    price: "$99",
    sub: "/month",
    features: [
      "10 reports included",
      "$12 per report after",
      "Priority rendering",
      "Dashboard + report history",
      "Cancel anytime",
    ],
    cta: "Go Pro",
    href: "/signup?plan=pro",
  },
  {
    name: "Team",
    price: "Custom",
    sub: "volume pricing",
    features: [
      "Unlimited reports",
      "API access",
      "Multi-user dashboard",
      "Priority support",
      "Volume discounts",
    ],
    cta: "Talk to Sales",
    href: "/contact?topic=team",
  },
];

const faqItems = [
  {
    q: "Is there really no subscription?",
    a: "Correct. The default plan is pay-per-report at $19. Buy one. Buy none. No credit card on file, no auto-renew.",
  },
  {
    q: "What if I need more than 10 reports a month?",
    a: "The Pro plan includes 10 reports/month for $99 and each additional report is $12. Teams running 50+ reports monthly get custom volume pricing — contact us.",
  },
  {
    q: "What if my report is wrong?",
    a: "We guarantee ±2% accuracy. If your report is outside that tolerance, we refund your money and re-run the report at no cost.",
  },
  {
    q: "How fast are reports?",
    a: "Most are delivered within minutes. Complex properties can take up to an hour. You'll always see an ETA at checkout.",
  },
  {
    q: "Do insurance companies accept Roof Today reports?",
    a: "Yes. Our reports include every measurement category insurance adjusters require (squares, pitch, ridge/hip/valley/eave/rake LF, waste factor) and are accepted daily for storm and restoration claims.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="py-14 md:py-20 bg-gradient-to-b from-trust-50/50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-go-50 text-go-700 border border-go-200 rounded-full px-3 py-1 text-xs font-semibold">
            No subscription. No contracts. No nonsense.
          </div>
          <h1 className="mt-5 text-display-lg text-ink-900">Simple pricing. Massive savings.</h1>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
            $19 per report. That's it. Need more? Grab a Pro plan. Running a team? Get volume pricing.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-5 md:gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-7 shadow-card ${
                t.best
                  ? "bg-ink-950 text-white border-ink-900 ring-4 ring-go-500/30"
                  : "bg-white border-stone-200"
              }`}
            >
              {t.best && (
                <div className="absolute -top-3 left-6 inline-flex items-center gap-1 text-xs font-bold tracking-wider bg-go-500 text-white px-2.5 py-1 rounded">
                  <Zap size={12} /> MOST POPULAR
                </div>
              )}
              <h3 className={`font-bold text-lg ${t.best ? "text-white" : "text-ink-900"}`}>{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className={`text-5xl font-extrabold ${t.best ? "text-white" : "text-ink-900"}`}>{t.price}</span>
                <span className={`text-sm ${t.best ? "text-stone-300" : "text-stone-500"}`}>{t.sub}</span>
              </div>
              <ul className={`mt-6 space-y-3 text-sm ${t.best ? "text-stone-200" : "text-stone-700"}`}>
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className={`shrink-0 mt-0.5 ${t.best ? "text-go-400" : "text-go-600"}`} size={18} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={t.href}
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 font-semibold rounded-xl py-3.5 transition ${
                  t.best
                    ? "bg-go-500 hover:bg-go-600 text-white shadow-go"
                    : "bg-ink-900 hover:bg-ink-800 text-white"
                }`}
              >
                {t.cta} <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 flex flex-wrap justify-center gap-6 text-sm text-stone-500">
          <span className="inline-flex items-center gap-1.5"><Shield size={14} className="text-go-600" /> Money-back guarantee</span>
          <span className="inline-flex items-center gap-1.5"><Shield size={14} className="text-go-600" /> Stripe-secured checkout</span>
          <span className="inline-flex items-center gap-1.5"><Crown size={14} className="text-go-600" /> 10,000+ reports delivered</span>
        </div>
      </section>

      <section className="py-16 bg-stone-50 border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-md text-ink-900 max-w-2xl">
            The real cost of EagleView vs Roof Today
          </h2>
          <div className="mt-10">
            <ComparisonTable />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-md text-ink-900 text-center">Pricing questions</h2>
          <div className="mt-10"><FAQ items={faqItems} /></div>
        </div>
      </section>

      <MobileStickyCTA label="Buy 1 Report" price="$19" />
    </>
  );
}
