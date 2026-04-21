"use client";

import type { MeasurementReport } from "@/lib/photogrammetry/types";
import ConfidenceBadge from "./ConfidenceBadge";
import MetricCards from "./MetricCards";
import RoofDiagram from "./RoofDiagram";
import { Download, Printer, ExternalLink } from "lucide-react";

export default function ReportView({ report }: { report: MeasurementReport }) {
  const r = report;
  const pb = r.totals.pitchBreakdown;
  const maxPct = Math.max(1, ...pb.map((p) => p.pct));
  const lfRows: [string, number][] = [
    ["Ridge", r.totals.ridgeLf],
    ["Hip", r.totals.hipLf],
    ["Valley", r.totals.valleyLf],
    ["Eave", r.totals.eaveLf],
    ["Rake", r.totals.rakeLf],
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-ink/50">Measurement Report</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">{r.address.formatted}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink/60">
            <ConfidenceBadge tier={r.confidence.tier} score={r.confidence.score} />
            <span className="mono">· {r.reportId}</span>
            <span>· {new Date(r.generatedAt).toLocaleString()}</span>
            {r.imagery.quality && <span>· Imagery {r.imagery.quality.toLowerCase()}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border hairline bg-white px-3 py-2 text-sm font-medium hover:bg-ink/[0.03]"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <a
            href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(r, null, 2))}`}
            download={`${r.reportId}.json`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-ink text-paper px-3 py-2 text-sm font-medium hover:bg-ink/90"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </a>
        </div>
      </header>

      {/* Top metrics */}
      <MetricCards r={r} />

      {/* Diagram + pitch */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <RoofDiagram report={r} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-white border hairline p-5">
            <div className="text-[11px] uppercase tracking-wider text-ink/50 mb-3">Pitch distribution</div>
            <div className="space-y-2.5">
              {pb.map((p) => (
                <div key={p.pitch}>
                  <div className="flex justify-between text-xs">
                    <span className="mono">{p.pitch}</span>
                    <span className="text-ink/50">{p.pct}% · {p.slantSqft} sf</span>
                  </div>
                  <div className="mt-1 h-1.5 bg-ink/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ink rounded-full"
                      style={{ width: `${(p.pct / maxPct) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white border hairline p-5">
            <div className="text-[11px] uppercase tracking-wider text-ink/50 mb-3">Linear footage</div>
            <table className="w-full text-sm">
              <tbody>
                {lfRows.map(([k, v]) => (
                  <tr key={k} className="border-b hairline last:border-0">
                    <td className="py-1.5 text-ink/70">{k}</td>
                    <td className="py-1.5 text-right mono">{v.toLocaleString()} ft</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2 font-medium">Total</td>
                  <td className="py-2 text-right mono font-semibold">{r.totals.totalLf.toLocaleString()} ft</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Facet table */}
      <div className="rounded-2xl bg-white border hairline overflow-hidden">
        <div className="px-5 py-3 border-b hairline flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-ink/50">Roof facets</div>
            <div className="text-sm text-ink/70">{r.planes.length} planes detected</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink/50">
                <th className="px-5 py-2 font-normal">ID</th>
                <th className="px-5 py-2 font-normal">Pitch</th>
                <th className="px-5 py-2 font-normal">Azimuth</th>
                <th className="px-5 py-2 font-normal text-right">Plan sf</th>
                <th className="px-5 py-2 font-normal text-right">Slant sf</th>
              </tr>
            </thead>
            <tbody>
              {r.planes.map((p) => (
                <tr key={p.id} className="border-t hairline">
                  <td className="px-5 py-2 mono">{p.id}</td>
                  <td className="px-5 py-2 mono">{p.pitch_ratio}</td>
                  <td className="px-5 py-2 mono">{Math.round(p.azimuth_deg)}°</td>
                  <td className="px-5 py-2 text-right mono">{Math.round(p.area_sqft).toLocaleString()}</td>
                  <td className="px-5 py-2 text-right mono">{Math.round(p.slant_area_sqft).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-check */}
      <div className="rounded-2xl bg-white border hairline p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-ink/50">Cross-check</div>
            <div className="text-sm text-ink/70">Three independent area estimates must agree</div>
          </div>
          <span className="pill bg-ink/[0.04] text-ink/70">
            max dev {r.crossCheck.maxDeviationPct.toFixed(1)}%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="DSM photogrammetry" value={`${r.crossCheck.dsmArea_sqft.toLocaleString()} sf`} />
          <Stat label="Solar API whole-roof" value={`${r.crossCheck.solarApiArea_sqft.toLocaleString()} sf`} />
          <Stat label="Footprint × 1.05" value={`${r.crossCheck.footprintArea_sqft.toLocaleString()} sf`} />
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl bg-white border hairline p-5">
        <div className="text-[11px] uppercase tracking-wider text-ink/50 mb-2">Method notes</div>
        <ul className="list-disc pl-5 space-y-1 text-sm text-ink/70">
          {r.confidence.notes.filter(Boolean).map((n, i) => <li key={i}>{n}</li>)}
        </ul>
        <div className="mt-3 text-xs text-ink/50">
          Source: {r.source}. Aerial imagery {r.imagery.date || "date unavailable"}, DSM at {r.imagery.dsmPixelMeters || "n/a"} m/px.
          Compare against <a className="underline inline-flex items-center gap-1" href="https://www.eagleview.com/" target="_blank" rel="noreferrer">EagleView <ExternalLink className="w-3 h-3" /></a> benchmarks in calibration suite.
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-ink/50">{label}</div>
      <div className="mt-0.5 text-lg font-semibold mono">{value}</div>
    </div>
  );
}
