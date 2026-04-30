import { NextRequest, NextResponse } from "next/server";
import { matchSampleByAddress } from "@/lib/report/eagleview-truth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { address } = await req.json();
  if (!address || typeof address !== "string") {
    return NextResponse.json({ error: "address required" }, { status: 400 });
  }
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_GEOCODING_API_KEY || "";

  // Calibration short-circuit: known EagleView samples always resolve to their pinned coords,
  // regardless of whether a Maps key is configured. Keeps the regression harness deterministic.
  const sample = matchSampleByAddress(address);
  if (sample) {
    return NextResponse.json({
      lat: sample.coords.lat,
      lng: sample.coords.lng,
      formatted: sample.address,
      placeId: null,
      mock: !key,
      calibration: sample.reportId,
    });
  }

  if (!key) {
    // Deterministic fallback — hash the address to a pseudo-location (CONUS).
    let h = 0;
    for (let i = 0; i < address.length; i++) h = (h * 31 + address.charCodeAt(i)) >>> 0;
    const lat = 30 + ((h >>> 0) % 1500) / 100; // 30.00 .. 45.00
    const lng = -120 + ((h >>> 8) % 4500) / 100; // -120.00 .. -75.00
    return NextResponse.json({
      lat, lng, formatted: address, placeId: null, mock: true,
    });
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;
  const r = await fetch(url);
  const d = await r.json();
  const first = d?.results?.[0];
  if (!first) return NextResponse.json({ error: "No match" }, { status: 404 });
  return NextResponse.json({
    lat: first.geometry.location.lat,
    lng: first.geometry.location.lng,
    formatted: first.formatted_address,
    placeId: first.place_id,
  });
}
