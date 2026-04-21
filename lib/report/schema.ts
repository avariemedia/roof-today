/**
 * JSON Schema for the MeasurementReport response. Machine-readable contract
 * for API consumers and for property management / insurance integrations.
 */
export const MEASUREMENT_REPORT_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "MeasurementReport",
  type: "object",
  required: ["source", "confidence", "imagery", "address", "planes", "edges", "totals", "crossCheck", "generatedAt", "reportId"],
  properties: {
    source: { type: "string", enum: ["photogrammetry", "solar-api", "mock"] },
    confidence: {
      type: "object",
      required: ["tier", "score", "notes"],
      properties: {
        tier: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
        score: { type: "number", minimum: 0, maximum: 1 },
        notes: { type: "array", items: { type: "string" } },
      },
    },
    imagery: {
      type: "object",
      properties: {
        date: { type: ["string", "null"], format: "date" },
        quality: { type: ["string", "null"], enum: ["HIGH", "MEDIUM", "BASE", null] },
        dsmPixelMeters: { type: ["number", "null"] },
      },
    },
    address: {
      type: "object",
      required: ["formatted", "lat", "lng"],
      properties: {
        formatted: { type: "string" },
        lat: { type: "number" },
        lng: { type: "number" },
        placeId: { type: ["string", "null"] },
      },
    },
    planes: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "pitch_deg", "pitch_ratio", "azimuth_deg", "area_sqft", "slant_area_sqft"],
        properties: {
          id: { type: "string" },
          pitch_deg: { type: "number" },
          pitch_ratio: { type: "string" },
          azimuth_deg: { type: "number" },
          area_sqft: { type: "number" },
          slant_area_sqft: { type: "number" },
        },
      },
    },
    edges: {
      type: "array",
      items: {
        type: "object",
        required: ["type", "length_ft"],
        properties: {
          type: { type: "string", enum: ["ridge", "hip", "valley", "eave", "rake"] },
          length_ft: { type: "number" },
        },
      },
    },
    totals: {
      type: "object",
      properties: {
        facetCount: { type: "integer" },
        horizontal_sqft: { type: "number" },
        slant_sqft: { type: "number" },
        squares: { type: "number" },
        predominantPitch: { type: "string" },
        pitchBreakdown: {
          type: "array",
          items: {
            type: "object",
            properties: {
              pitch: { type: "string" },
              pct: { type: "number" },
              slantSqft: { type: "number" },
            },
          },
        },
        ridgeLf: { type: "number" },
        hipLf: { type: "number" },
        valleyLf: { type: "number" },
        eaveLf: { type: "number" },
        rakeLf: { type: "number" },
        totalLf: { type: "number" },
        wasteFactor: { type: "number" },
      },
    },
    crossCheck: {
      type: "object",
      properties: {
        dsmArea_sqft: { type: "number" },
        solarApiArea_sqft: { type: "number" },
        footprintArea_sqft: { type: "number" },
        maxDeviationPct: { type: "number" },
      },
    },
    generatedAt: { type: "string", format: "date-time" },
    reportId: { type: "string" },
  },
} as const;
