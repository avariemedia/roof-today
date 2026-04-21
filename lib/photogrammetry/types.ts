export type LatLng = { lat: number; lng: number };

export type Raster = {
  width: number;
  height: number;
  data: Float32Array;
  bounds: { north: number; south: number; east: number; west: number };
  pixelMeters: number;
};

export type RoofPlane3D = {
  id: string;
  normal: [number, number, number];
  offset: number;
  area_sqft: number;
  slant_area_sqft: number;
  pitch_deg: number;
  pitch_ratio: string;
  azimuth_deg: number;
  center: LatLng;
  polygon: LatLng[];
};

export type RoofEdge = {
  type: "ridge" | "hip" | "valley" | "eave" | "rake";
  length_ft: number;
  planeIds: [string, string | null];
  line: [LatLng, LatLng];
};

export type ConfidenceTier = "HIGH" | "MEDIUM" | "LOW";

export type MeasurementReport = {
  source: "photogrammetry" | "solar-api" | "mock";
  confidence: { tier: ConfidenceTier; score: number; notes: string[] };
  imagery: { date: string | null; quality: "HIGH" | "MEDIUM" | "BASE" | null; dsmPixelMeters: number | null };
  address: { formatted: string; lat: number; lng: number; placeId: string | null };
  planes: RoofPlane3D[];
  edges: RoofEdge[];
  totals: {
    facetCount: number;
    horizontal_sqft: number;
    slant_sqft: number;
    squares: number;
    predominantPitch: string;
    pitchBreakdown: { pitch: string; pct: number; slantSqft: number }[];
    ridgeLf: number;
    hipLf: number;
    valleyLf: number;
    eaveLf: number;
    rakeLf: number;
    totalLf: number;
    wasteFactor: number;
  };
  crossCheck: {
    dsmArea_sqft: number;
    solarApiArea_sqft: number;
    footprintArea_sqft: number;
    maxDeviationPct: number;
  };
  generatedAt: string;
  reportId: string;
};
