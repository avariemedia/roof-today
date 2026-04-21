"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertTriangle } from "lucide-react";
import ReportView from "@/components/ReportView";
import type { MeasurementReport } from "@/lib/photogrammetry/types";

export const dynamic = "force-dynamic";

export default function ReportPage() {
  return (
    <main className="min-h-screen">
      <nav className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">Roof Today</Link>
        <Link className="text-sm px-3 py-1.5 rounded-lg hover:bg-ink/[0.04]" href="/">← New report</Link>
      </nav>
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
        <Suspense fallback={<LoadingState phase="Preparing report…" />}>
          <ReportInner />
        </Suspense>
      </section>
    </main>
  );
}

function ReportInner() {
  const sp = useSearchParams();
  const lat = sp.get("lat");
  const lng = sp.get("lng");
  const address = sp.get("address") || undefined;
  const placeId = sp.get("placeId") || undefined;

  const [report, setReport] = useState<MeasurementReport | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [phase, setPhase] = useState("Fetching aerial imagery…");

  useEffect(() => {
    if (!lat || !lng) {
      setErr("Missing coordinates.");
      return;
    }
    let cancelled = false;
    const phases = [
      "Fetching aerial imagery…",
      "Loading DSM (elevation raster)…",
      "Segmenting roof planes…",
      "Intersecting planes, classifying edges…",
      "Cross-checking areas…",
    ];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % phases.length;
      if (!cancelled) setPhase(phases[i]);
    }, 900);

    fetch("/api/measure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: Number(lat), lng: Number(lng), address, placeId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.error) setErr(data.error);
        else setReport(data);
      })
      .catch((e) => !cancelled && setErr(String(e)))
      .finally(() => clearInterval(t));

    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [lat, lng, address, placeId]);

  if (err) {
    return (
      <div className="mt-12 rounded-2xl bg-white border hairline p-8 max-w-lg mx-auto text-center">
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
        <h2 className="mt-3 text-xl font-semibold">Couldn&apos;t generate report</h2>
        <p className="mt-2 text-sm text-ink/60">{err}</p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-ink text-paper px-4 py-2.5 text-sm font-medium">
          Try another address
        </Link>
      </div>
    );
  }
  if (!report) return <LoadingState phase={phase} />;
  return <div className="mt-6"><ReportView report={report} /></div>;
}

function LoadingState({ phase }: { phase: string }) {
  return (
    <div className="mt-12 rounded-2xl bg-white border hairline p-10 text-center">
      <Loader2 className="w-7 h-7 mx-auto animate-spin text-ink/60" />
      <div className="mt-4 text-sm text-ink/60">{phase}</div>
      <div className="mt-8 max-w-md mx-auto space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-3 skeleton rounded" style={{ width: `${70 + i * 8}%` }} />
        ))}
      </div>
    </div>
  );
}
