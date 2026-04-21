"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Download, Shield, Clock, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import RoofDiagram from "@/components/RoofDiagram";
import { generateMockReport } from "@/lib/utils";

export default function ReportPreviewClient() {
  const params = useSearchParams();
  const router = useRouter();
  const address = (params.get("address") || "").trim() || "123 Main St, Anytown, USA";
  const report = useMemo(() => generateMockReport(address), [address]);

  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // Gamified "scanning" progress
  useEffect(() => {
    if (done) return;
    const steps = [
      { at: 20, label: "Locating property" },
      { at: 45, label: "Pulling satellite imagery" },
      { at: 70, label: "Detecting roof facets" },
      { at: 90, label: "Calculating measurements" },
      { at: 100, label: "Report ready" },
    ];
    let p = 0;
    const id = setInterval(() => {
      p += 2 + Math.random() * 3;
      if (p >= 100) { p = 100; clearInterval(id); setTimeout(() => setDone(true), 350); }
      setProgress(p);
    }, 55);
    return () => clearInterval(id);
  }, [done]);

  const onUnlock = async () => {
    setUnlocking(true);
    // TODO: wire to /api/checkout once Stripe keys are added
    router.push(`/checkout?report=${report.reportId}&address=${encodeURIComponent(address)}`);
  };

  return (
    <>
      <div className="min-h-screen bg-stone-50">
        {/* Scanning screen */}
        <AnimatePresence>
          {!done && (
            <motion.div
              key="scan"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-20 bg-ink-950 text-white flex flex-col items-center justify-center px-6"
            >
              <div className="w-full max-w-md">
                <div className="aerial-grid rounded-2xl p-8 border border-white/10 bg-ink-900/70">
                  <div className="flex items-center gap-2 text-go-400 text-xs font-bold tracking-[0.2em] uppercase">
                    <Sparkles size={14} /> Analyzing roof
                  </div>
                  <div className="mt-3 text-xl font-bold truncate">{address}</div>
                  <div className="mt-8 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-trust-400 to-go-400"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.25 }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-stone-400 font-mono">
                    <span>{Math.round(progress)}%</span>
                    <span>
                      {progress < 22 && "Locating property…"}
                      {progress >= 22 && progress < 50 && "Pulling satellite imagery…"}
                      {progress >= 50 && progress < 75 && "Detecting roof facets…"}
                      {progress >= 75 && progress < 100 && "Calculating measurements…"}
                      {progress === 100 && "Report ready"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report header */}
        <div className="bg-white border-b border-stone-200">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-bold tracking-[0.2em] text-trust-600 uppercase">Roof Measurement Report</div>
              <div className="mt-1 font-bold text-ink-900 truncate">{address}</div>
              <div className="text-xs text-stone-500 font-mono mt-0.5">
                ID: {report.reportId} · {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-go-50 border border-go-200 px-3 py-2 rounded-lg">
              <CheckCircle2 className="text-go-600" size={18} />
              <div className="text-xs">
                <div className="font-semibold text-go-700">Accuracy verified</div>
                <div className="text-go-700/70">±2% guarantee</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Left: report */}
          <div className="space-y-6">
            {/* Aerial + diagram */}
            <div className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-card">
              <div className="p-5">
                <RoofDiagram seed={address} />
              </div>
              <div className="px-5 pb-5 flex flex-wrap gap-2">
                <Badge color="go">● Facets detected: {report.facetCount}</Badge>
                <Badge color="trust">Ridge · Hip · Valley · Eave · Rake</Badge>
              </div>
            </div>

            {/* Free headline stats */}
            <div className="grid grid-cols-3 gap-3">
              <BigStat label="Total Squares" value={report.totalSquares.toFixed(1)} free />
              <BigStat label="Predominant Pitch" value={report.predominantPitch} free />
              <BigStat label="Facets" value={String(report.facetCount)} free />
            </div>

            {/* Locked detail rows */}
            <div className="rounded-2xl bg-white border border-stone-200 shadow-card overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-stone-200 bg-stone-50">
                <h3 className="font-bold text-ink-900">Facet-by-facet breakdown</h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-trust-700">
                  <Lock size={12} /> Unlock full detail
                </span>
              </div>
              <div className="divide-y divide-stone-100">
                <LockedRow label="Ridge (LF)" value={`${report.ridgeLf}`} />
                <LockedRow label="Hip (LF)" value={`${report.hipLf}`} />
                <LockedRow label="Valley (LF)" value={`${report.valleyLf}`} />
                <LockedRow label="Eave (LF)" value={`${report.eaveLf}`} />
                <LockedRow label="Rake (LF)" value={`${report.rakeLf}`} />
                <LockedRow label="Waste Factor" value={`${report.wasteFactor}%`} />
                <LockedRow label="Facet-by-facet squares" value="Detailed breakdown" shimmer />
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-stone-200 p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="text-stone-400" size={22} />
                  <div>
                    <div className="font-semibold text-ink-900">Printable PDF Report</div>
                    <div className="text-xs text-stone-500">Insurance-ready, fully branded</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-trust-700 inline-flex items-center gap-1">
                  <Lock size={12} /> $19 to unlock
                </span>
              </div>
            </div>
          </div>

          {/* Right: sticky unlock card (desktop) */}
          <aside>
            <div className="lg:sticky lg:top-20 space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-trust-700 to-ink-900 text-white p-6 shadow-trust">
                <div className="flex items-center gap-2 text-go-300 text-xs font-bold tracking-[0.2em] uppercase">
                  <Sparkles size={14} /> You're seeing 20% of your report
                </div>
                <div className="mt-3 text-3xl font-extrabold">Unlock the full report</div>
                <ul className="mt-4 space-y-2 text-sm text-trust-100">
                  <li className="flex gap-2"><CheckCircle2 className="text-go-400 shrink-0 mt-0.5" size={18} /> Full facet-by-facet measurements</li>
                  <li className="flex gap-2"><CheckCircle2 className="text-go-400 shrink-0 mt-0.5" size={18} /> Ridge, hip, valley, eave, rake (LF)</li>
                  <li className="flex gap-2"><CheckCircle2 className="text-go-400 shrink-0 mt-0.5" size={18} /> Waste factor calculation</li>
                  <li className="flex gap-2"><CheckCircle2 className="text-go-400 shrink-0 mt-0.5" size={18} /> Downloadable insurance-ready PDF</li>
                </ul>

                <div className="mt-6 bg-white/10 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-trust-200">Roof Today</div>
                      <div className="text-3xl font-extrabold">$19</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-trust-200 line-through">EagleView ~$85</div>
                      <div className="text-go-300 text-sm font-semibold">You save $66</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onUnlock}
                  disabled={unlocking}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-go-500 hover:bg-go-600 text-white font-bold rounded-xl py-4 text-lg shadow-go animate-pulse-ring"
                >
                  <Unlock size={20} /> Unlock Full Report — $19
                </button>

                <div className="mt-3 flex items-center gap-2 text-xs text-trust-200">
                  <Shield size={14} /> Money-back guarantee · Stripe-secured
                </div>
              </div>

              <div className="rounded-xl bg-white border border-stone-200 p-4 flex items-start gap-3">
                <Clock className="text-go-600 shrink-0 mt-0.5" size={20} />
                <div className="text-xs text-stone-600 leading-relaxed">
                  <span className="font-semibold text-ink-900">Full report delivered in under 5 minutes.</span>{" "}
                  Emailed to you + downloadable from your dashboard.
                </div>
              </div>

              <div className="rounded-xl bg-white border border-stone-200 p-4 text-xs text-stone-600">
                <div className="font-semibold text-ink-900 mb-1">Trusted by 10,000+ contractors</div>
                <div>Real measurements. Real savings. No subscription trap.</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky unlock bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 safe-bottom px-3 pt-3">
        <button
          onClick={onUnlock}
          disabled={unlocking}
          className="w-full inline-flex items-center justify-center gap-2 bg-go-500 hover:bg-go-600 text-white font-bold rounded-xl py-3.5 shadow-go"
        >
          <Unlock size={18} /> Unlock Full Report — $19 <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}

function BigStat({ label, value, free }: { label: string; value: string; free?: boolean }) {
  return (
    <div className="rounded-xl bg-white border border-stone-200 p-4 shadow-card">
      <div className="text-[10px] uppercase tracking-wider font-bold text-stone-500 flex items-center justify-between">
        {label} {free && <span className="text-go-600 normal-case">Free</span>}
      </div>
      <div className="mt-1 font-mono font-extrabold text-ink-900 text-2xl">{value}</div>
    </div>
  );
}

function LockedRow({ label, value, shimmer }: { label: string; value: string; shimmer?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="text-sm font-medium text-ink-900">{label}</div>
      <div className="flex items-center gap-2">
        <span
          className={`font-mono text-sm font-bold text-ink-900 ${shimmer ? "shimmer-bg px-2 rounded" : ""} lock-blur select-none`}
        >
          {value}
        </span>
        <Lock size={14} className="text-stone-400" />
      </div>
    </div>
  );
}

function Badge({ color, children }: { color: "go" | "trust"; children: React.ReactNode }) {
  const cls = color === "go"
    ? "bg-go-50 text-go-700 border-go-200"
    : "bg-trust-50 text-trust-700 border-trust-200";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full border px-2.5 py-1 ${cls}`}>
      {children}
    </span>
  );
}
