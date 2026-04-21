import type { MeasurementReport } from "@/lib/photogrammetry/types";

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-white border hairline px-5 py-4">
      <div className="text-[11px] uppercase tracking-wider text-ink/50">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-ink/50">{sub}</div>}
    </div>
  );
}

export default function MetricCards({ r }: { r: MeasurementReport }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card label="Squares" value={r.totals.squares.toFixed(1)} sub={`${r.totals.slant_sqft.toLocaleString()} sq ft slant`} />
      <Card label="Predominant pitch" value={r.totals.predominantPitch} sub={`${r.totals.facetCount} facets`} />
      <Card label="Total linear ft" value={r.totals.totalLf.toLocaleString()} sub={`${r.totals.ridgeLf + r.totals.hipLf} ridge+hip`} />
      <Card label="Waste factor" value={`${r.totals.wasteFactor}%`} sub="Recommended" />
    </div>
  );
}
