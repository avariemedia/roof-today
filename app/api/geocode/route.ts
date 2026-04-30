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
    // No Maps key configured and this is not a calibration sample.
    // Refuse instead of synthesizing pseudo-coords — silently mocking a real
    // user's address would route them to a confidently-wrong report.
    return NextResponse.json(
      {
        error: "geocoder unavailable",
        code: "geocoder_unavailable",
        detail: "Address lookup is not configured on this deployment.",
      },
      { status: 503 },
    );
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
