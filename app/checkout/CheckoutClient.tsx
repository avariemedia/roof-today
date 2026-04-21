"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock, ShieldCheck, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function CheckoutClient() {
  const params = useSearchParams();
  const address = params.get("address") || "";
  const reportId = params.get("report") || "";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCheckout = async () => {
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Please enter a valid email."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, address, reportId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/report/preview?address=${encodeURIComponent(address)}`} className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-ink-900">
          <ArrowLeft size={16} /> Back to report preview
        </Link>

        <div className="mt-6 grid md:grid-cols-[1.2fr_1fr] gap-6">
          <div className="rounded-2xl bg-white border border-stone-200 p-6 md:p-8 shadow-card">
            <h1 className="text-2xl font-extrabold text-ink-900">Unlock your full roof report</h1>
            <p className="mt-2 text-stone-600 text-sm">
              Delivered in under 5 minutes. Emailed to you + available in your dashboard.
            </p>

            <label className="mt-6 block">
              <span className="text-sm font-semibold text-ink-900">Email for your report</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 focus-within:ring-2 focus-within:ring-go-400">
                <Mail size={18} className="text-stone-400" />
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@contractor.com"
                  className="flex-1 bg-transparent outline-none py-3 text-base text-ink-900 placeholder:text-stone-400"
                />
              </div>
            </label>

            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

            <button
              onClick={onCheckout}
              disabled={loading}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-go-500 hover:bg-go-600 text-white font-bold rounded-xl py-4 text-lg shadow-go disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={18} />}
              {loading ? "Redirecting to secure checkout…" : "Continue to Secure Checkout — $19"}
            </button>

            <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
              <ShieldCheck size={14} className="text-go-600" />
              Powered by Stripe · 256-bit SSL · Apple Pay, Google Pay, and cards accepted
            </div>
          </div>

          <aside className="rounded-2xl bg-gradient-to-br from-trust-700 to-ink-900 text-white p-6 shadow-trust">
            <div className="text-xs font-bold tracking-[0.2em] text-go-300 uppercase">Order Summary</div>
            <div className="mt-3 font-bold text-lg truncate">{address || "Your roof report"}</div>
            {reportId && <div className="text-xs font-mono text-trust-200">ID: {reportId}</div>}
            <div className="mt-6 space-y-2 text-sm">
              <Row k="Full facet breakdown" />
              <Row k="Ridge · Hip · Valley · Eave · Rake (LF)" />
              <Row k="Waste factor" />
              <Row k="Insurance-ready PDF" />
              <Row k="Dashboard access + email delivery" />
            </div>
            <div className="mt-5 pt-5 border-t border-white/10 flex items-baseline justify-between">
              <span className="text-trust-200">Total</span>
              <span className="text-3xl font-extrabold">$19.00</span>
            </div>
            <div className="mt-4 text-xs text-trust-200">
              Money-back guarantee — if your report is outside our ±2% accuracy tolerance, we'll refund and re-run.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ k }: { k: string }) {
  return (
    <div className="flex items-start gap-2 text-trust-100">
      <span className="text-go-400 shrink-0">✓</span>
      <span>{k}</span>
    </div>
  );
}
