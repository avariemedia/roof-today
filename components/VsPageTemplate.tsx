import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import AddressCapture from "@/components/AddressCapture";
import FAQ, { type FAQItem } from "@/components/FAQ";
import ComparisonTable from "@/components/ComparisonTable";
import MobileStickyCTA from "@/components/MobileStickyCTA";

export type VsRow = { feature: string; rt: string | boolean; them: string | boolean };

export default function VsPageTemplate({
  competitor,
  tagline,
  intro,
  rows,
  pros,
  cons,
  faqItems,
  savings,
}: {
  competitor: string;
  tagline: string;
  intro: string;
  rows: VsRow[];
  pros: string[];
  cons: string[];
  faqItems: FAQItem[];
  savings: { reports: number; annual: number };
}) {
  return (
    <>
      <section className="py-14 md:py-20 bg-gradient-to-b from-trust-50/60 to-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-go-50 text-go-700 border border-go-200 rounded-full px-3 py-1 text-xs font-semibold">
            The better alternative
          </div>
          <h1 className="mt-5 text-display-lg text-ink-900">
            Roof Today vs {competitor}
          </h1>
          <p className="mt-3 text-lg text-trust-700 font-semibold">{tagline}</p>
          <p className="mt-4 text-stone-600 text-lg max-w-3xl leading-relaxed">{intro}</p>
          <div className="mt-8 max-w-xl"><AddressCapture size="lg" /></div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-md text-ink-900">Head-to-head comparison</h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="px-5 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Feature</th>
                  <th className="px-5 py-4 text-ink-900 font-bold">Roof Today</th>
                  <th className="px-5 py-4 text-stone-600 font-semibold">{competitor}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.feature} className={i % 2 ? "bg-stone-50/50" : "bg-white"}>
                    <td className="px-5 py-3.5 text-sm font-medium text-ink-900">{r.feature}</td>
                    <td className="px-5 py-3.5">
                      {typeof r.rt === "boolean"
                        ? r.rt ? <Check className="text-go-600" size={20} /> : <X className="text-stone-300" size={20} />
                        : <span className="text-sm font-semibold text-ink-900">{r.rt}</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      {typeof r.them === "boolean"
                        ? r.them ? <Check className="text-stone-500" size={20} /> : <X className="text-stone-300" size={20} />
                        : <span className="text-sm text-stone-700">{r.them}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-14 bg-stone-50 border-y border-stone-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white border border-go-200 p-6">
            <h3 className="font-bold text-ink-900 text-lg">Why contractors pick Roof Today over {competitor}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-700">
              {pros.map((p) => (
                <li key={p} className="flex gap-2"><Check size={18} className="text-go-600 shrink-0 mt-0.5" />{p}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white border border-stone-200 p-6">
            <h3 className="font-bold text-ink-900 text-lg">Where {competitor} falls short</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-700">
              {cons.map((c) => (
                <li key={c} className="flex gap-2"><X size={18} className="text-stone-400 shrink-0 mt-0.5" />{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-ink-950 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display-md text-white">
            Run {savings.reports} reports/month? Save{" "}
            <span className="text-go-400">${savings.annual.toLocaleString()}</span>/year by switching.
          </h2>
          <p className="mt-4 text-stone-300 max-w-2xl mx-auto">
            Same accuracy. Same insurance-ready output. Delivered faster. Without the subscription.
          </p>
          <Link
            href="/pricing"
            className="mt-8 inline-flex items-center gap-2 bg-go-500 hover:bg-go-600 text-white font-semibold px-6 py-3.5 rounded-xl shadow-go"
          >
            See your savings <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-md text-ink-900">How Roof Today stacks against all the majors</h2>
          <div className="mt-8"><ComparisonTable /></div>
        </div>
      </section>

      <section className="py-16 bg-stone-50 border-t border-stone-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-md text-ink-900 text-center">{competitor} alternative FAQ</h2>
          <div className="mt-8"><FAQ items={faqItems} /></div>
        </div>
      </section>

      <MobileStickyCTA label={`Switch from ${competitor}`} price="$19" />
    </>
  );
}
