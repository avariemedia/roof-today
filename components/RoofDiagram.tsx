"use client";

import type { MeasurementReport } from "@/lib/photogrammetry/types";
import { useMemo } from "react";

/**
 * Abstract roof diagram rendered from plane azimuths + areas.
 * Each plane becomes a radial wedge in a compass layout, sized by area,
 * shaded by pitch. Not a literal top-down trace — a premium schematic.
 */
export default function RoofDiagram({ report }: { report: MeasurementReport }) {
  const planes = report.planes;

  const { wedges, maxA } = useMemo(() => {
    const maxA = Math.max(1, ...planes.map((p) => p.area_sqft));
    const wedges = planes.map((p, i) => {
      const az = ((p.azimuth_deg || 0) * Math.PI) / 180;
      const spread = (2 * Math.PI) / Math.max(planes.length, 1);
      const a0 = az - spread / 2;
      const a1 = az + spread / 2;
      const r = 30 + (p.area_sqft / maxA) * 110;
      const x0 = 200 + Math.sin(a0) * 30;
      const y0 = 200 - Math.cos(a0) * 30;
      const x1 = 200 + Math.sin(a0) * r;
      const y1 = 200 - Math.cos(a0) * r;
      const x2 = 200 + Math.sin(a1) * r;
      const y2 = 200 - Math.cos(a1) * r;
      const x3 = 200 + Math.sin(a1) * 30;
      const y3 = 200 - Math.cos(a1) * 30;
      const large = spread > Math.PI ? 1 : 0;
      const d = `M ${x0} ${y0} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A 30 30 0 ${large} 0 ${x0} ${y0} Z`;
      const pitch = p.pitch_deg;
      const shade = Math.min(0.85, 0.25 + pitch / 70);
      return { d, shade, pitch: p.pitch_ratio, id: p.id, area: p.area_sqft };
    });
    return { wedges, maxA };
  }, [planes]);

  return (
    <div className="rounded-2xl bg-white border hairline p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-ink/50">Roof schematic</div>
          <div className="text-sm text-ink/70">{planes.length} facets, oriented by azimuth</div>
        </div>
        <div className="text-[10px] mono text-ink/40">N ↑</div>
      </div>
      <svg viewBox="0 0 400 400" className="w-full h-auto">
        <defs>
          <radialGradient id="rg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0b0f14" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#0b0f14" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="160" fill="url(#rg)" />
        <g opacity="0.12">
          <line x1="200" y1="20" x2="200" y2="380" stroke="#0b0f14" strokeDasharray="2 4" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="#0b0f14" strokeDasharray="2 4" />
        </g>
        {wedges.map((w, i) => (
          <g key={i}>
            <path d={w.d} fill={`rgba(11,15,20,${w.shade})`} stroke="#fff" strokeWidth="1.5" />
          </g>
        ))}
        <circle cx="200" cy="200" r="28" fill="#0b0f14" />
        <text x="200" y="195" textAnchor="middle" fill="#fafaf7" fontSize="9" fontFamily="ui-monospace">
          {report.totals.squares.toFixed(1)}
        </text>
        <text x="200" y="208" textAnchor="middle" fill="#fafaf7" fontSize="7" opacity="0.6">
          SQUARES
        </text>
        <text x="200" y="18" textAnchor="middle" fontSize="9" fill="#0b0f14" opacity="0.4">N</text>
        <text x="200" y="394" textAnchor="middle" fontSize="9" fill="#0b0f14" opacity="0.4">S</text>
        <text x="8" y="204" fontSize="9" fill="#0b0f14" opacity="0.4">W</text>
        <text x="384" y="204" fontSize="9" fill="#0b0f14" opacity="0.4">E</text>
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-ink/60 mono">
        {planes.slice(0, 8).map((p) => (
          <div key={p.id} className="flex justify-between">
            <span>{p.id}</span>
            <span>{p.pitch_ratio} · {Math.round(p.area_sqft)} sf</span>
          </div>
        ))}
      </div>
    </div>
  );
}
