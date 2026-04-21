/**
 * End-to-end measurement orchestrator.
 * Produces a MeasurementReport from lat/lng + optional address string.
 */
import { MeasurementReport, RoofPlane3D, LatLng, ConfidenceTier } from "./types";
import { fetchBuildingInsights, fetchDataLayers, fetchRaster } from "./solar";
import { segmentPlanes } from "./planes";
import { classifyEdges, sumByType } from "./edges";
import { pitchDegToRatio, SQFT_PER_SQM, enToLatLng } from "./geo";

function reportId() {
  return "rpt_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function pitchBreakdown(planes: RoofPlane3D[]) {
  const totalSlant = planes.reduce((s, p) => s + p.slant_area_sqft, 0) || 1;
  const buckets = new Map<string, number>();
  for (const p of planes) buckets.set(p.pitch_ratio, (buckets.get(p.pitch_ratio) || 0) + p.slant_area_sqft);
  return Array.from(buckets.entries())
    .map(([pitch, slantSqft]) => ({
      pitch,
      pct: Math.round((slantSqft / totalSlant) * 100),
      slantSqft: Math.round(slantSqft),
    }))
    .sort((a, b) => b.pct - a.pct);
}

function computeConfidence(
  planesCount: number,
  imageryQuality: "HIGH" | "MEDIUM" | "BASE" | null,
  dsmUsed: boolean,
  crossCheckMaxDev: number
): { tier: ConfidenceTier; score: number; notes: string[] } {
  const notes: string[] = [];
  let score = 0.5;
  if (imageryQuality === "HIGH") { score += 0.25; notes.push("Google Solar imagery: HIGH quality"); }
  else if (imageryQuality === "MEDIUM") { score += 0.1; notes.push("Google Solar imagery: MEDIUM quality"); }
  else if (imageryQuality === "BASE") { score += 0.0; notes.push("Google Solar imagery: BASE quality"); }
  else notes.push("No imagery quality reported (fallback data)");
  if (dsmUsed) { score += 0.15; notes.push("DSM photogrammetry applied"); }
  else notes.push("DSM unavailable — used Solar API roof segments only");
  if (crossCheckMaxDev < 0.05) { score += 0.10; notes.push(`Cross-check deviation ${(crossCheckMaxDev*100).toFixed(1)}% (within 5%)`); }
  else if (crossCheckMaxDev < 0.10) { score += 0.05; notes.push(`Cross-check deviation ${(crossCheckMaxDev*100).toFixed(1)}%`); }
  else notes.push(`Cross-check deviation ${(crossCheckMaxDev*100).toFixed(1)}% — review recommended`);
  if (planesCount >= 4) { score += 0.05; }
  score = Math.min(1, Math.max(0, score));
  const tier: ConfidenceTier = score >= 0.85 ? "HIGH" : score >= 0.65 ? "MEDIUM" : "LOW";
  return { tier, score, notes };
}

export type MeasureInput = {
  lat: number;
  lng: number;
  placeId?: string | null;
  address?: string;
};

export async function runMeasurement(input: MeasureInput): Promise<MeasurementReport> {
  const apiKey = process.env.GOOGLE_SOLAR_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const origin: LatLng = { lat: input.lat, lng: input.lng };

  // If no API key configured, return a high-quality deterministic mock
  if (!apiKey) return mockReport(input);

  try {
    const insights = await fetchBuildingInsights(input.lat, input.lng, apiKey);
    if (!insights) return mockReport(input, "no_building_insights");

    const seeds = insights.solarPotential.roofSegmentStats.map((s) => ({
      lat: s.center.latitude,
      lng: s.center.longitude,
      pitchDegrees: s.pitchDegrees,
      azimuthDegrees: s.azimuthDegrees,
    }));

    const dataLayers = await fetchDataLayers(input.lat, input.lng, 30, apiKey);
    let dsm = null;
    let dsmUsed = false;
    if (dataLayers?.dsmUrl) {
      dsm = await fetchRaster(dataLayers.dsmUrl, apiKey);
      dsmUsed = dsm !== null;
    }

    let planes: RoofPlane3D[];
    if (dsm) {
      planes = segmentPlanes(dsm, origin, seeds);
      // Merge with Solar API segment areas where our DSM-derived areas are zero
      for (let i = 0; i < planes.length; i++) {
        if (planes[i].area_sqft < 10 && insights.solarPotential.roofSegmentStats[i]) {
          const s = insights.solarPotential.roofSegmentStats[i];
          const slantM2 = s.stats.areaMeters2;
          const horizM2 = s.stats.groundAreaMeters2;
          planes[i].area_sqft = horizM2 * SQFT_PER_SQM;
          planes[i].slant_area_sqft = slantM2 * SQFT_PER_SQM;
        }
      }
    } else {
      // Solar API segments only, no DSM refinement
      planes = insights.solarPotential.roofSegmentStats.map((s, i) => ({
        id: `p${i + 1}`,
        normal: [
          -Math.sin((s.pitchDegrees * Math.PI) / 180) * Math.sin((s.azimuthDegrees * Math.PI) / 180),
          -Math.sin((s.pitchDegrees * Math.PI) / 180) * Math.cos((s.azimuthDegrees * Math.PI) / 180),
          Math.cos((s.pitchDegrees * Math.PI) / 180),
        ],
        offset: s.planeHeightAtCenterMeters,
        area_sqft: s.stats.groundAreaMeters2 * SQFT_PER_SQM,
        slant_area_sqft: s.stats.areaMeters2 * SQFT_PER_SQM,
        pitch_deg: s.pitchDegrees,
        pitch_ratio: pitchDegToRatio(s.pitchDegrees),
        azimuth_deg: s.azimuthDegrees,
        center: { lat: s.center.latitude, lng: s.center.longitude },
        polygon: bboxToPolygon(s.boundingBox),
      }));
    }

    const edges = classifyEdges(planes, origin);
    const lf = sumByType(edges);
    const totalHoriz = planes.reduce((s, p) => s + p.area_sqft, 0);
    const totalSlant = planes.reduce((s, p) => s + p.slant_area_sqft, 0);

    const solarArea = insights.solarPotential.wholeRoofStats.areaMeters2 * SQFT_PER_SQM;
    const footprintArea = insights.solarPotential.wholeRoofStats.groundAreaMeters2 * SQFT_PER_SQM;
    const areas = [totalSlant, solarArea, footprintArea * 1.1].filter((v) => v > 0);
    const maxDev = areas.length > 1
      ? (Math.max(...areas) - Math.min(...areas)) / Math.max(...areas)
      : 0;

    const pb = pitchBreakdown(planes);
    const confidence = computeConfidence(planes.length, insights.imageryQuality, dsmUsed, maxDev);

    return {
      source: "photogrammetry",
      confidence,
      imagery: {
        date: insights.imageryDate
          ? `${insights.imageryDate.year}-${String(insights.imageryDate.month).padStart(2, "0")}-${String(insights.imageryDate.day).padStart(2, "0")}`
          : null,
        quality: insights.imageryQuality,
        dsmPixelMeters: dsm?.pixelMeters ?? null,
      },
      address: {
        formatted: input.address || `${input.lat.toFixed(6)}, ${input.lng.toFixed(6)}`,
        lat: input.lat,
        lng: input.lng,
        placeId: input.placeId ?? null,
      },
      planes,
      edges,
      totals: {
        facetCount: planes.length,
        horizontal_sqft: Math.round(totalHoriz),
        slant_sqft: Math.round(totalSlant),
        squares: Number((totalSlant / 100).toFixed(1)),
        predominantPitch: pb[0]?.pitch || "0/12",
        pitchBreakdown: pb,
        ridgeLf: Math.round(lf.ridge),
        hipLf: Math.round(lf.hip),
        valleyLf: Math.round(lf.valley),
        eaveLf: Math.round(lf.eave),
        rakeLf: Math.round(lf.rake),
        totalLf: Math.round(lf.total),
        wasteFactor: planes.length >= 6 ? 12 : planes.length >= 4 ? 10 : 8,
      },
      crossCheck: {
        dsmArea_sqft: Math.round(totalSlant),
        solarApiArea_sqft: Math.round(solarArea),
        footprintArea_sqft: Math.round(footprintArea),
        maxDeviationPct: Number((maxDev * 100).toFixed(2)),
      },
      generatedAt: new Date().toISOString(),
      reportId: reportId(),
    };
  } catch (err: any) {
    console.error("runMeasurement error:", err?.message || err);
    return mockReport(input, "exception");
  }
}

function bboxToPolygon(bb: { sw: { latitude: number; longitude: number }; ne: { latitude: number; longitude: number } }): LatLng[] {
  return [
    { lat: bb.sw.latitude, lng: bb.sw.longitude },
    { lat: bb.sw.latitude, lng: bb.ne.longitude },
    { lat: bb.ne.latitude, lng: bb.ne.longitude },
    { lat: bb.ne.latitude, lng: bb.sw.longitude },
  ];
}

/** Deterministic, plausible mock used when API key is absent or Solar API 404s. */
export function mockReport(input: MeasureInput, reason?: string): MeasurementReport {
  const rand = (seed: number) => {
    const x = Math.sin((input.lat + input.lng) * 1000 + seed) * 10000;
    return x - Math.floor(x);
  };
  const facetCount = 4 + Math.floor(rand(1) * 4);
  const pitchDeg = 20 + rand(3) * 15;
  const totalHoriz = 1400 + rand(5) * 900;
  const slantFactor = 1 / Math.cos((pitchDeg * Math.PI) / 180);

  const planes: RoofPlane3D[] = Array.from({ length: facetCount }).map((_, i) => {
    const area = totalHoriz / facetCount * (0.7 + rand(i * 7) * 0.6);
    const pp = pitchDeg + rand(i * 11) * 4 - 2;
    const pR = (pp * Math.PI) / 180;
    const az = (i * 360) / facetCount + rand(i * 13) * 30;
    const aR = (az * Math.PI) / 180;
    return {
      id: `p${i + 1}`,
      normal: [-Math.sin(pR) * Math.sin(aR), -Math.sin(pR) * Math.cos(aR), Math.cos(pR)],
      offset: 10 + rand(i) * 2,
      area_sqft: area,
      slant_area_sqft: area / Math.cos(pR),
      pitch_deg: pp,
      pitch_ratio: pitchDegToRatio(pp),
      azimuth_deg: az,
      center: {
        lat: input.lat + (rand(i * 3) - 0.5) * 0.00015,
        lng: input.lng + (rand(i * 5) - 0.5) * 0.00015,
      },
      polygon: [],
    };
  });
  const edges = classifyEdges(planes, { lat: input.lat, lng: input.lng });
  const lf = sumByType(edges);
  const totalSlant = planes.reduce((s, p) => s + p.slant_area_sqft, 0);
  const perim = Math.sqrt(totalHoriz) * 4 * 1.2;
  if (lf.total < 10) {
    // Generate plausible LF distribution for mock
    lf.ridge = perim * 0.18; lf.hip = perim * 0.10; lf.valley = perim * 0.08;
    lf.eave = perim * 0.40; lf.rake = perim * 0.24;
    lf.total = lf.ridge + lf.hip + lf.valley + lf.eave + lf.rake;
  }
  const pb = pitchBreakdown(planes);
  return {
    source: "mock",
    confidence: {
      tier: "LOW",
      score: 0.35,
      notes: ["Running in MOCK mode — configure GOOGLE_SOLAR_API_KEY for real measurements", reason || ""].filter(Boolean),
    },
    imagery: { date: null, quality: null, dsmPixelMeters: null },
    address: {
      formatted: input.address || `${input.lat.toFixed(6)}, ${input.lng.toFixed(6)}`,
      lat: input.lat,
      lng: input.lng,
      placeId: input.placeId ?? null,
    },
    planes,
    edges,
    totals: {
      facetCount,
      horizontal_sqft: Math.round(totalHoriz),
      slant_sqft: Math.round(totalSlant),
      squares: Number((totalSlant / 100).toFixed(1)),
      predominantPitch: pb[0]?.pitch || pitchDegToRatio(pitchDeg),
      pitchBreakdown: pb,
      ridgeLf: Math.round(lf.ridge),
      hipLf: Math.round(lf.hip),
      valleyLf: Math.round(lf.valley),
      eaveLf: Math.round(lf.eave),
      rakeLf: Math.round(lf.rake),
      totalLf: Math.round(lf.total),
      wasteFactor: 10,
    },
    crossCheck: {
      dsmArea_sqft: Math.round(totalSlant),
      solarApiArea_sqft: Math.round(totalSlant * 0.98),
      footprintArea_sqft: Math.round(totalHoriz * 1.05),
      maxDeviationPct: 4.2,
    },
    generatedAt: new Date().toISOString(),
    reportId: reportId(),
  };
}
