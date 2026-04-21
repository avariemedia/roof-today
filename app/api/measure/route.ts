import { NextRequest, NextResponse } from "next/server";
import { runMeasurement } from "@/lib/photogrammetry/measure";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lat = Number(body?.lat);
    const lng = Number(body?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "lat and lng are required numbers" }, { status: 400 });
    }
    const report = await runMeasurement({
      lat,
      lng,
      address: typeof body?.address === "string" ? body.address : undefined,
      placeId: typeof body?.placeId === "string" ? body.placeId : undefined,
    });
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Measurement failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const lat = Number(sp.get("lat"));
  const lng = Number(sp.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }
  const report = await runMeasurement({
    lat, lng,
    address: sp.get("address") || undefined,
    placeId: sp.get("placeId") || undefined,
  });
  return NextResponse.json(report);
}
