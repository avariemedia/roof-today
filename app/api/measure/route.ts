import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Roof measurement endpoint.
 * Given lat/lng, calls Google Solar API `buildingInsights:findClosest`
 * and returns roof plane polygons, pitches, azimuths, and computed measurements.
 *
 * Falls back to deterministic mock if API key is not set.
 */

type Vertex = { lat: number; lng: number };

type RoofPlane = {
  id: string;
  area_sqm: number;        // horizontal (projected) area
  area_sqft: number;
  slant_area_sqft: number; // true roof surface area (pitched)
  pitch_deg: number;
  pitch_ratio: string;     // e.g. "6/12"
  azimuth_deg: number;
  center: Vertex;
  polygon?: Vertex[];      // bounding-box polygon derived from center+area+azimuth
};

function degToPitchRatio(deg: number): string {
  // pitch "x/12": rise over 12 run. rise = 12 * tan(deg)
  const rise = 12 * Math.tan((deg * Math.PI) / 180);
  return `${Math.round(rise)}/12`;
}

function sqmToSqft(sqm: number) { return sqm * 10.7639; }

function metersToLatLng(centerLat: number, dxMeters: number, dyMeters: number): Vertex {
  // Approximate meters -> degrees at given latitude
  const dLat = dyMeters / 111_320;
  const dLng = dxMeters / (111_320 * Math.cos((centerLat * Math.PI) / 180));
  return { lat: centerLat + dLat, lng: dLng };
}

/**
 * Build an approximate rectangular polygon for a roof plane from its center, area, and azimuth.
 * The Solar API doesn't return polygon outlines directly; we derive a 3:2-ratio rectangle
 * oriented to the plane's azimuth, sized to the plane's horizontal area.
 */
function buildPolygon(center: Vertex, areaSqm: number, azimuthDeg: number): Vertex[] {
  const aspect = 1.5; // length : width = 1.5 : 1
  const width = Math.sqrt(areaSqm / aspect);
  const length = width * aspect;
  const halfL = length / 2;
  const halfW = width / 2;
  const theta = (azimuthDeg * Math.PI) / 180; // rotate by azimuth

  // Corners in local (x=east, y=north) then rotate by azimuth
  const corners = [
    { x: -halfL, y: -halfW },
    { x: halfL, y: -halfW },
    { x: halfL, y: halfW },
    { x: -halfL, y: halfW },
  ];

  return corners.map(({ x, y }) => {
    const rx = x * Math.cos(theta) - y * Math.sin(theta);
    const ry = x * Math.sin(theta) + y * Math.cos(theta);
    const dLat = ry / 111_320;
    const dLng = rx / (111_320 * Math.cos((center.lat * Math.PI) / 180));
    return { lat: center.lat + dLat, lng: center.lng + dLng };
  });
}

export async function POST(req: Request) {
  try {
    const { lat, lng, placeId } = await req.json();
    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
    }

    const key = process.env.GOOGLE_SOLAR_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      // Fallback mock (same structure as real response)
      return NextResponse.json(mockResponse(lat, lng));
    }

    const url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${key}`;
    const r = await fetch(url, { method: "GET" });
    const data = await r.json();

    if (!r.ok) {
      // Solar API can fail for rural or low-quality imagery — fallback gracefully
      return NextResponse.json({
        ...mockResponse(lat, lng),
        _fallback: true,
        _solarError: data?.error?.message || "Solar API unavailable for this location",
      });
    }

    const roofStats = data.solarPotential?.roofSegmentStats || [];
    const centerLat = data.center?.latitude ?? lat;
    const centerLng = data.center?.longitude ?? lng;

    const planes: RoofPlane[] = roofStats.map((seg: any, i: number) => {
      const pitchDeg = seg.pitchDegrees ?? 0;
      const azimuthDeg = seg.azimuthDegrees ?? 0;
      const areaSqm = seg.stats?.areaMeters2 ?? 0;
      const slantFactor = 1 / Math.cos((pitchDeg * Math.PI) / 180);
      const slantSqm = areaSqm * slantFactor;
      const center: Vertex = {
        lat: seg.center?.latitude ?? centerLat,
        lng: seg.center?.longitude ?? centerLng,
      };
      return {
        id: `plane-${i + 1}`,
        area_sqm: areaSqm,
        area_sqft: sqmToSqft(areaSqm),
        slant_area_sqft: sqmToSqft(slantSqm),
        pitch_deg: pitchDeg,
        pitch_ratio: degToPitchRatio(pitchDeg),
        azimuth_deg: azimuthDeg,
        center,
        polygon: buildPolygon(center, areaSqm, azimuthDeg),
      };
    });

    // Totals
    const totalHorizSqft = planes.reduce((s, p) => s + p.area_sqft, 0);
    const totalSlantSqft = planes.reduce((s, p) => s + p.slant_area_sqft, 0);
    const totalSquares = totalSlantSqft / 100;

    // Per-pitch breakdown (EagleView-style): bucket planes by rounded pitch ratio, weight by slant area
    const pitchBuckets = new Map<string, number>();
    for (const p of planes) {
      const key = p.pitch_ratio;
      pitchBuckets.set(key, (pitchBuckets.get(key) || 0) + p.slant_area_sqft);
    }
    const pitchBreakdown = Array.from(pitchBuckets.entries())
      .map(([pitch, slantSqft]) => ({
        pitch,
        pct: Math.round((slantSqft / (totalSlantSqft || 1)) * 100),
        slantSqft: Math.round(slantSqft),
      }))
      .sort((a, b) => b.pct - a.pct);

    // Predominant pitch = pitch bucket with the largest slant-area share
    const predominantPitch = pitchBreakdown[0]?.pitch || degToPitchRatio(0);

    // Linear footage estimates from perimeters
    // This is approximate — true ridge/hip/valley requires polygon adjacency analysis.
    // For v1 we estimate from plane perimeters using typical residential ratios.
    const totalPerimeter = planes.reduce((s, p) => {
      if (!p.polygon) return s;
      let perim = 0;
      for (let i = 0; i < p.polygon.length; i++) {
        const a = p.polygon[i];
        const b = p.polygon[(i + 1) % p.polygon.length];
        perim += haversine(a, b);
      }
      return s + perim;
    }, 0);
    const perimFt = totalPerimeter * 3.28084;

    // Typical residential ratios (from NAHB/HAAG roofing industry averages)
    const ridgeLf = Math.round(perimFt * 0.18);
    const hipLf = Math.round(perimFt * 0.10);
    const valleyLf = Math.round(perimFt * 0.08);
    const eaveLf = Math.round(perimFt * 0.40);
    const rakeLf = Math.round(perimFt * 0.24);
    const wasteFactor = planes.length >= 6 ? 12 : planes.length >= 4 ? 10 : 8;

    return NextResponse.json({
      source: "google-solar",
      center: { lat: centerLat, lng: centerLng },
      building: {
        name: data.name,
        imageryDate: data.imageryDate,
        imageryQuality: data.imageryQuality,
        postalCode: data.postalCode,
      },
      planes,
      totals: {
        facetCount: planes.length,
        horizontal_sqft: Math.round(totalHorizSqft),
        slant_sqft: Math.round(totalSlantSqft),
        squares: Number(totalSquares.toFixed(1)),
        predominantPitch,
        pitchBreakdown,
        ridgeLf,
        hipLf,
        valleyLf,
        eaveLf,
        rakeLf,
        wasteFactor,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}

function haversine(a: Vertex, b: Vertex) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function mockResponse(lat: number, lng: number) {
  // Deterministic pseudo-random based on lat/lng for consistency
  const seed = Math.abs(Math.sin(lat * 1000 + lng * 1000)) * 1000;
  const rand = (n: number, offset: number) => (Math.sin(seed + offset) + 1) / 2 * n;
  const facetCount = 4 + Math.floor(rand(5, 1));
  const totalHorizSqft = 1400 + rand(1200, 2);
  const pitchDeg = 20 + rand(20, 3); // ~4/12 to ~10/12
  const slantFactor = 1 / Math.cos((pitchDeg * Math.PI) / 180);
  const totalSlantSqft = totalHorizSqft * slantFactor;
  const planes: RoofPlane[] = Array.from({ length: facetCount }).map((_, i) => {
    const areaSqft = totalHorizSqft / facetCount * (0.7 + rand(0.6, i * 7));
    const areaSqm = areaSqft / 10.7639;
    const planePitch = pitchDeg + rand(4, i * 11) - 2;
    const azimuth = (i * 360) / facetCount + rand(30, i * 13);
    const center = { lat, lng };
    return {
      id: `plane-${i + 1}`,
      area_sqm: areaSqm,
      area_sqft: areaSqft,
      slant_area_sqft: areaSqft / Math.cos((planePitch * Math.PI) / 180),
      pitch_deg: planePitch,
      pitch_ratio: degToPitchRatio(planePitch),
      azimuth_deg: azimuth,
      center,
      polygon: buildPolygon(center, areaSqm, azimuth),
    };
  });
  const perimFt = Math.sqrt(totalHorizSqft) * 4 * 1.2;
  const totalSlantForMock = planes.reduce((s, p) => s + p.slant_area_sqft, 0);
  const mockBuckets = new Map<string, number>();
  for (const p of planes) mockBuckets.set(p.pitch_ratio, (mockBuckets.get(p.pitch_ratio) || 0) + p.slant_area_sqft);
  const mockPitchBreakdown = Array.from(mockBuckets.entries())
    .map(([pitch, slantSqft]) => ({ pitch, pct: Math.round((slantSqft / (totalSlantForMock || 1)) * 100), slantSqft: Math.round(slantSqft) }))
    .sort((a, b) => b.pct - a.pct);
  return {
    source: "mock",
    center: { lat, lng },
    building: {},
    planes,
    totals: {
      facetCount,
      horizontal_sqft: Math.round(totalHorizSqft),
      slant_sqft: Math.round(totalSlantSqft),
      squares: Number((totalSlantSqft / 100).toFixed(1)),
      predominantPitch: mockPitchBreakdown[0]?.pitch || degToPitchRatio(pitchDeg),
      pitchBreakdown: mockPitchBreakdown,
      ridgeLf: Math.round(perimFt * 0.18),
      hipLf: Math.round(perimFt * 0.10),
      valleyLf: Math.round(perimFt * 0.08),
      eaveLf: Math.round(perimFt * 0.40),
      rakeLf: Math.round(perimFt * 0.24),
      wasteFactor: 10,
    },
  };
}
