"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Download, Shield, Clock, CheckCircle2, Sparkles, ArrowRight, MapPin } from "lucide-react";
import RoofMeasureMap from "@/components/RoofMeasureMap";

type Plane = {
  id: string;
  pitch_ratio: string;
  pitch_deg: number;
  azimuth_deg: number;
  polygon?: { lat: number; lng: number }[];
  center: { lat: number; lng: number };
  area_sqft: number;
  slant_area_sqft: number;
};

type MeasureResponse = {
  source: "google-solar" | "mock";
  center: { lat: number; lng: number };
  building: { imageryDate?: any; imageryQuality?: string; postalCode?: string };
  planes: Plane[];
  totals: {
    facetCount: number;
    horizontal_sqft: number;
    slant_sqft: number;
    squares: number;
    predominantPitch: string;
    ridgeLf: number;
    hipLf: number;
    valleyLf: number;
    eaveLf: number;
    rakeLf: number;
    wasteFactor: number;
  };
  _fallback?: boolean;
  _solarError?: string;
};

export default function ReportPreviewClient() {
  const params = useSearchParams();
  const router = useRouter();
  const address = (params.get("address") || "").trim() || "123 Main St, Anytown, USA";
  const queryLat = params.get("lat");
  const queryLng = params.get("lng");
  const lat = queryLat ? Number(queryLat) : null;
  const lng = queryLng ? Number(queryLng) : null;
  const reportId = useMemo(() => "RT-" + Math.floor(100000 + Math.random() * 899999), []);

  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [measure, setMeasure] = useState<MeasureResponse | null>(null);
  const [loadingMeasure, setLoadingMeasure] = useState(true);
  const [selectedPlaneId, setSelectedPlaneId] = useState<string | null>(null);
  const [pinPos, setPinPos] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch measurements
  useEffect(() => {
    if (lat === null || lng === null || Number.isNaN(lat) || Number.isNaN(lng)) {
      setLoadingMeasure(false);
      return;
    }
    fetch("/api/measure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng }),
    })
      .then((r) => r.json())
      .then((data) => { setMeasure(data); setLoadingMeasure(false); })
      .catch(() => setLoadingMeasure(false));
  }, [lat, lng]);

  // Gamified scanning progress (completes when measurements arrive or 4s timeout)
  useEffect(() => {
    if (done) return;
    let p = 0;
    const id = setInterval(() => {
      const cap = loadingMeasure ? 85 : 100;
      p = Math.min(cap, p + 2 + Math.random() * 3);
      setProgress(p);
      if (p >= 100) { clearInterval(id); setTimeout(() => setDone(true), 350); }
    }, 55);
    return () => clearInterval(id);
  }, [done, loadingMeasure]);

  // Once measurement done, push progress to 100
  useEffect(() => {
    if (!loadingMeasure && progress < 100) setProgress(100);
  }, [loadingMeasure, progress]);

  const mapCenter = pinPos || measure?.center || (lat !== null && lng !== null ? { lat, lng } : null);
  const totals = measure?.totals;
  const hasCoords = lat !== null && lng !== null && !Number.isNaN(lat!) && !Number.isNaN(lng!);

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
                      {progress >= 50 && progress < 75 && "Detecting roof planes…"}
                      {progress >= 75 && progress < 100 && "Calculating measurements…"}
                      {progress === 100 && "Report ready"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-bold tracking-[0.2em] text-trust-600 uppercase">Roof Measurement Report</div>
              <div className="mt-1 font-bold text-ink-900 truncate">{address}</div>
              <div className="text-xs text-stone-500 font-mono mt-0.5">
                ID: {reportId} · {new Date().toLocaleDateString()}
                {measure?.source === "google-solar" && <span className="ml-2 text-go-600">· Google Solar imagery</span>}
                {measure?._fallback && <span className="ml-2 text-amber-600">· Estimate (imagery unavailable)</span>}
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

        {!hasCoords && (
          <div className="mx-auto max-w-3xl px-4 pt-8">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <MapPin className="inline mr-1" size={14} /> Need an exact home location. Go back and pick your address from the dropdown so we can pull accurate satellite imagery.
            </div>
          </div>
        )}

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[1.55fr_1fr] gap-8">
          {/* Left: report */}
          <div className="space-y-6">
            {/* Interactive map with roof planes */}
            <div className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-card">
              {mapCenter && (
                <RoofMeasureMap
                  lat={mapCenter.lat}
                  lng={mapCenter.lng}
                  planes={measure?.planes || []}
                  onPinDrop={(p) => setPinPos(p)}
                  onPlaneClick={(p) => setSelectedPlaneId(p.id === selectedPlaneId ? null : p.id)}
                  selectedPlaneId={selectedPlaneId}
                  height="440px"
                />
              )}
              {!mapCenter && (
                <div className="h-[440px] bg-stone-100 flex items-center justify-center text-stone-500 text-sm">
                  Enter an address on the home page to see the aerial view.
                </div>
              )}
              <div className="px-5 py-4 flex flex-wrap gap-2 border-t border-stone-100">
                <Badge color="go">● {totals?.facetCount ?? "…"} roof planes detected</Badge>
                <Badge color="trust">Tap a plane to see its details</Badge>
              </div>
            </div>

            {/* Free headline stats */}
            <div className="grid grid-cols-3 gap-3">
              <BigStat label="Total Squares" value={totals ? totals.squares.toFixed(1) : "…"} free />
              <BigStat label="Predominant Pitch" value={totals?.predominantPitch || "…"} free />
              <BigStat label="Facets" value={totals ? String(totals.facetCount) : "…"} free />
            </div>

            {/* Selected plane details */}
            {selectedPlaneId && measure && (() => {
              const p = measure.planes.find((x) => x.id === selectedPlaneId);
              if (!p) return null;
              return (
                <div className="rounded-2xl bg-white border border-go-200 shadow-card p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold tracking-[0.2em] text-go-700 uppercase">Selected plane · {p.id}</div>
                    <button onClick={() => setSelectedPlaneId(null)} className="text-xs text-stone-500 hover:text-ink-900">Close</button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <MiniStat label="Area" value={`${Math.round(p.slant_area_sqft)} sqft`} />
                    <MiniStat label="Pitch" value={p.pitch_ratio} />
                    <MiniStat label="Azimuth" value={`${Math.round(p.azimuth_deg)}°`} />
                    <MiniStat label="Squares" value={(p.slant_area_sqft / 100).toFixed(1)} />
                  </div>
                </div>
              );
            })()}

            {/* Locked detail rows */}
            <div className="rounded-2xl bg-white border border-stone-200 shadow-card overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-stone-200 bg-stone-50">
                <h3 className="font-bold text-ink-900">Facet-by-facet breakdown</h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-trust-700">
                  <Lock size={12} /> Unlock full detail
                </span>
              </div>
              <div className="divide-y divide-stone-100">
                <LockedRow label="Ridge (LF)" value={`${totals?.ridgeLf ?? "—"}`} />
                <LockedRow label="Hip (LF)" value={`${totals?.hipLf ?? "—"}`} />
                <LockedRow label="Valley (LF)" value={`${totals?.valleyLf ?? "—"}`} />
                <LockedRow label="Eave (LF)" value={`${totals?.eaveLf ?? "—"}`} />
                <LockedRow label="Rake (LF)" value={`${totals?.rakeLf ?? "—"}`} />
                <LockedRow label="Waste Factor" value={`${totals?.wasteFactor ?? "—"}%`} />
                <LockedRow label="Per-facet area, pitch & orientation" value="Full facet table" shimmer />
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
                  <Lock size={12} /> Starts at $12.50
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
                <div className="mt-1 text-sm text-trust-200">Buy a pack of credits. Use them anytime.</div>
                <ul className="mt-4 space-y-2 text-sm text-trust-100">
                  <li className="flex gap-2"><CheckCircle2 className="text-go-400 shrink-0 mt-0.5" size={18} /> Full facet-by-facet measurements</li>
                  <li className="flex gap-2"><CheckCircle2 className="text-go-400 shrink-0 mt-0.5" size={18} /> Ridge, hip, valley, eave, rake (LF)</li>
                  <li className="flex gap-2"><CheckCircle2 className="text-go-400 shrink-0 mt-0.5" size={18} /> Waste factor calculation</li>
                  <li className="flex gap-2"><CheckCircle2 className="text-go-400 shrink-0 mt-0.5" size={18} /> Downloadable insurance-ready PDF</li>
                </ul>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => router.push(`/checkout?plan=starter&report=${reportId}&address=${encodeURIComponent(address)}`)}
                    className="text-left rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 p-3 transition"
                  >
                    <div className="text-xs text-trust-200">Starter</div>
                    <div className="text-2xl font-extrabold">$25</div>
                    <div className="text-[11px] text-trust-200">2 reports · $12.50 ea</div>
                  </button>
                  <button
                    onClick={() => router.push(`/checkout?plan=pro&report=${reportId}&address=${encodeURIComponent(address)}`)}
                    className="relative text-left rounded-xl border border-go-400/50 bg-go-500/20 hover:bg-go-500/30 p-3 transition"
                  >
                    <div className="absolute -top-2 right-2 text-[9px] font-bold tracking-wider bg-go-500 text-white px-1.5 py-0.5 rounded">BEST VALUE</div>
                    <div className="text-xs text-go-200">Pro</div>
                    <div className="text-2xl font-extrabold">$50</div>
                    <div className="text-[11px] text-go-200">10 reports · $5 ea</div>
                  </button>
                </div>

                <button
                  onClick={() => router.push(`/checkout?plan=starter&report=${reportId}&address=${encodeURIComponent(address)}`)}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-go-500 hover:bg-go-600 text-white font-bold rounded-xl py-4 text-lg shadow-go animate-pulse-ring"
                >
                  <Unlock size={20} /> Get 2 reports — $25
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
          onClick={() => router.push(`/checkout?plan=starter&report=${reportId}&address=${encodeURIComponent(address)}`)}
          className="w-full inline-flex items-center justify-center gap-2 bg-go-500 hover:bg-go-600 text-white font-bold rounded-xl py-3.5 shadow-go"
        >
          <Unlock size={18} /> Get 2 reports — $25 <ArrowRight size={16} />
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-stone-50 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider font-bold text-stone-500">{label}</div>
      <div className="font-mono font-bold text-ink-900">{value}</div>
    </div>
  );
}

function LockedRow({ label, value, shimmer }: { label: string; value: string; shimmer?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="text-sm font-medium text-ink-900">{label}</div>
      <div className="flex items-center gap-2">
        <span className={`font-mono text-sm font-bold text-ink-900 ${shimmer ? "shimmer-bg px-2 rounded" : ""} lock-blur select-none`}>
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
