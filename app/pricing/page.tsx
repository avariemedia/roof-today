"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tier = {
  id: "starter" | "pro" | "volume";
  name: string;
  reports: number;
  price: number;
  desc: string;
  highlight?: boolean;
  features: string[];
};

const TIERS: Tier[] = [
  { id: "starter", name: "Starter", reports: 2, price: 25, desc: "Try the system", features: ["2 reports", "Full PDF + JSON", "EagleView-comparable data", "Email support"] },
  { id: "pro", name: "Pro", reports: 10, price: 50, desc: "For active contractors", highlight: true, features: ["10 reports", "Everything in Starter", "Roof schematic", "Priority queue", "Slack/Teams delivery"] },
  { id: "volume", name: "Volume", reports: 50, price: 200, desc: "For roofing operations", features: ["50 reports", "Everything in Pro", "API access", "CSV export", "Dedicated support"] },
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(tier: string) {
    setLoading(tier);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout could not start. Please try again.");
        setLoading(null);
      }
    } catch {
      alert("Network error.");
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen">
      <nav className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">Roof Today</Link>
        <Link className="px-3 py-1.5 rounded-lg hover:bg-ink/[0.04] text-sm" href="/">← Back</Link>
      </nav>

      <section className="max-w-5xl mx-auto px-5 md:px-8 py-12 md:py-20">
        <div className="text-[11px] uppercase tracking-wider text-ink/50 mb-2">Pricing</div>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Pay per report. No subscriptions.</h1>
        <p className="mt-3 text-ink/60 max-w-xl">Buy credits once, use them whenever. Unused credits roll over.</p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((t) => (
            <div
              key={t.id}
              className={cn(
                "rounded-2xl border p-6 flex flex-col bg-white",
                t.highlight ? "border-ink shadow-[0_30px_60px_-30px_rgba(11,15,20,0.35)]" : "hairline",
              )}
            >
              {t.highlight && <div className="pill bg-ink text-paper w-fit mb-3">Most popular</div>}
              <div className="text-[11px] uppercase tracking-wider text-ink/50">{t.name}</div>
              <div className="mt-1 text-sm text-ink/60">{t.desc}</div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight">${t.price}</span>
                <span className="text-ink/50 text-sm">/ pack</span>
              </div>
              <div className="mt-1 text-sm text-ink/60">{t.reports} reports · ${(t.price / t.reports).toFixed(2)} each</div>
              <ul className="mt-6 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-ink/60 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => checkout(t.id)}
                disabled={loading !== null}
                className={cn(
                  "mt-8 rounded-xl px-4 py-3 font-medium text-sm flex items-center justify-center gap-2 transition-colors",
                  t.highlight ? "bg-ink text-paper hover:bg-ink/90" : "bg-ink/[0.04] hover:bg-ink/[0.08]",
                )}
              >
                {loading === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading === t.id ? "Redirecting…" : "Buy now"}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-ink/40 text-center">
          Secure checkout via Stripe. Volume 100+ — <a className="underline" href="mailto:hello@roof-today.com">contact us</a>.
        </p>
      </section>
    </main>
  );
}
