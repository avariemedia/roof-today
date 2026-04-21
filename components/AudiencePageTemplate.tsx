import AddressCapture from "@/components/AddressCapture";
import Testimonials from "@/components/Testimonials";
import TrustBar from "@/components/TrustBar";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import { Check } from "lucide-react";

export default function AudiencePageTemplate({
  h1,
  subhead,
  intro,
  useCases,
  benefits,
}: {
  h1: string;
  subhead: string;
  intro: string;
  useCases: { title: string; body: string }[];
  benefits: string[];
}) {
  return (
    <>
      <section className="py-14 md:py-20 bg-gradient-to-b from-trust-50/60 to-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-display-lg text-ink-900">{h1}</h1>
          <p className="mt-3 text-lg font-semibold text-trust-700">{subhead}</p>
          <p className="mt-4 text-stone-600 text-lg leading-relaxed max-w-3xl">{intro}</p>
          <div className="mt-8 max-w-xl"><AddressCapture size="lg" /></div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-md text-ink-900">How it fits your workflow</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-5">
            {useCases.map((u) => (
              <div key={u.title} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
                <h3 className="font-bold text-ink-900 text-lg">{u.title}</h3>
                <p className="mt-2 text-stone-600 text-sm leading-relaxed">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-stone-50 border-y border-stone-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-md text-ink-900">Why it wins</h2>
          <ul className="mt-8 grid md:grid-cols-2 gap-4">
            {benefits.map((b) => (
              <li key={b} className="flex gap-3 bg-white rounded-xl p-4 border border-stone-200">
                <Check size={20} className="text-go-600 shrink-0 mt-0.5" /> <span className="text-ink-900 font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><TrustBar /></div>
      </section>

      <section className="py-14 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Testimonials />
        </div>
      </section>

      <MobileStickyCTA label="Try a free sample" />
    </>
  );
}
