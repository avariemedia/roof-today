/**
 * Google Solar API client + GeoTIFF DSM fetcher.
 * Solar API dataLayers endpoint returns a 0.1 m/pixel Digital Surface Model
 * GeoTIFF derived from Google's stereo-photogrammetric pipeline.
 * Docs: https://developers.google.com/maps/documentation/solar/data-layers
 */
import { fromArrayBuffer } from "geotiff";
import type { Raster } from "./types";

const SOLAR_BASE = "https://solar.googleapis.com/v1";

export type BuildingInsights = {
  name: string;
  center: { latitude: number; longitude: number };
  boundingBox: { sw: { latitude: number; longitude: number }; ne: { latitude: number; longitude: number } };
  imageryDate: { year: number; month: number; day: number };
  imageryQuality: "HIGH" | "MEDIUM" | "BASE";
  postalCode?: string;
  solarPotential: {
    maxArrayAreaMeters2: number;
    wholeRoofStats: { areaMeters2: number; groundAreaMeters2: number };
    roofSegmentStats: Array<{
      pitchDegrees: number;
      azimuthDegrees: number;
      stats: { areaMeters2: number; groundAreaMeters2: number };
      center: { latitude: number; longitude: number };
      boundingBox: { sw: { latitude: number; longitude: number }; ne: { latitude: number; longitude: number } };
      planeHeightAtCenterMeters: number;
    }>;
  };
};

export type DataLayers = {
  imageryDate: { year: number; month: number; day: number };
  dsmUrl: string;
  rgbUrl: string;
  maskUrl: string;
  imageryQuality: "HIGH" | "MEDIUM" | "BASE";
};

export async function fetchBuildingInsights(lat: number, lng: number, apiKey: string): Promise<BuildingInsights | null> {
  const url = new URL(`${SOLAR_BASE}/buildingInsights:findClosest`);
  url.searchParams.set("location.latitude", lat.toFixed(6));
  url.searchParams.set("location.longitude", lng.toFixed(6));
  url.searchParams.set("requiredQuality", "HIGH");
  url.searchParams.set("key", apiKey);
  const r = await fetch(url.toString(), { cache: "no-store" });
  if (r.status === 404) {
    // Retry at MEDIUM
    url.searchParams.set("requiredQuality", "MEDIUM");
    const r2 = await fetch(url.toString(), { cache: "no-store" });
    if (!r2.ok) return null;
    return (await r2.json()) as BuildingInsights;
  }
  if (!r.ok) return null;
  return (await r.json()) as BuildingInsights;
}

export async function fetchDataLayers(
  lat: number,
  lng: number,
  radiusMeters: number,
  apiKey: string
): Promise<DataLayers | null> {
  const url = new URL(`${SOLAR_BASE}/dataLayers:get`);
  url.searchParams.set("location.latitude", lat.toFixed(6));
  url.searchParams.set("location.longitude", lng.toFixed(6));
  url.searchParams.set("radiusMeters", String(radiusMeters));
  url.searchParams.set("view", "FULL_LAYERS");
  url.searchParams.set("requiredQuality", "BASE");
  url.searchParams.set("pixelSizeMeters", "0.25");
  url.searchParams.set("key", apiKey);
  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) return null;
  return (await r.json()) as DataLayers;
}

/** Download a GeoTIFF from a Solar API layer URL and return a single-band Raster. */
export async function fetchRaster(layerUrl: string, apiKey: string): Promise<Raster | null> {
  const url = layerUrl.includes("key=") ? layerUrl : `${layerUrl}&key=${apiKey}`;
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) return null;
  const buf = await r.arrayBuffer();
  const tiff = await fromArrayBuffer(buf);
  const image = await tiff.getImage();
  const rasters = await image.readRasters();
  const band = rasters[0] as any;
  const width = image.getWidth();
  const height = image.getHeight();

  // Bounds: GeoTIFF reports bbox in projected coords. For Solar API, tiles are in WGS84
  // tile space or UTM. We request pixelSizeMeters so the image is already meter-scaled.
  // Compute bounds in lat/lng from the origin tiepoint + pixel scale.
  const bbox = image.getBoundingBox();
  const resolution = image.getResolution();
  const pixelMeters = Math.abs(resolution[0]);

  // Assume EPSG:4326 projected to meters via request; bbox is in the projection's native units.
  // We treat numeric bbox values as degrees if they look like lat/lng, else meters from origin.
  let north: number, south: number, east: number, west: number;
  const geoKeys = image.getGeoKeys() as any;
  const isGeographic = geoKeys?.ProjectedCSTypeGeoKey === undefined;
  if (isGeographic) {
    west = bbox[0]; south = bbox[1]; east = bbox[2]; north = bbox[3];
  } else {
    // Solar API returns WebMercator-like meters; convert via image tiepoint + degrees scale.
    // Fallback: call getOrigin (tiepoint) interpreted as lat/lng.
    const tie = (image as any).fileDirectory.ModelTiepoint;
    // x,y,z -> i,j,k origin. After tie, scale[0]=degrees/pixel lng, scale[1]=degrees/pixel lat
    const lngOrigin = tie[3], latOrigin = tie[4];
    const lngScale = resolution[0]; const latScale = resolution[1];
    west = lngOrigin; north = latOrigin;
    east = lngOrigin + width * lngScale;
    south = latOrigin + height * latScale; // latScale is negative
  }

  const data = new Float32Array(band.length);
  for (let i = 0; i < band.length; i++) data[i] = band[i];

  return { width, height, data, bounds: { north, south, east, west }, pixelMeters };
}
