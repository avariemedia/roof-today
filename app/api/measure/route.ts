import { NextRequest, NextResponse } from "next/server";
import { runMeasurement } from "@/lib/photogrammetry/measure";
import {
  COOKIE_NAME,
  cookieAttrs,
  isCreditsEnforced,
  makeCookieValue,
  verifyCredits,
} from "@/lib/credits";

export const runtime = "nodejs";
export const maxDuration = 60;

function buildResponse(report: any, newCredits: number | null): NextResponse {
  const res = NextResponse.json(report);
  if (newCredits !== null) {
    const cookie = makeCookieValue(newCredits);
    if (cookie) res.headers.append("Set-Cookie", `${COOKIE_NAME}=${cookie}; ${cookieAttrs()}`);
  }
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lat = Number(body?.lat);
    const lng = Number(body?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "lat and lng are required numbers" }, { status: 400 });
    }

    let creditsAfter: number | null = null;
    if (isCreditsEnforced()) {
      const balance = verifyCredits(req.cookies.get(COOKIE_NAME)?.value);
      if (!balance || balance.credits <= 0) {
        return NextResponse.json(
          { error: "no report credits", code: "no_credits" },
          { status: 402 },
        );
      }
      creditsAfter = balance.credits - 1;
    }

    const report = await runMeasurement({
      lat,
      lng,
      address: typeof body?.address === "string" ? body.address : undefined,
      placeId: typeof body?.placeId === "string" ? body.placeId : undefined,
    });
    return buildResponse(report, creditsAfter);
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

  let creditsAfter: number | null = null;
  if (isCreditsEnforced()) {
    const balance = verifyCredits(req.cookies.get(COOKIE_NAME)?.value);
    if (!balance || balance.credits <= 0) {
      return NextResponse.json(
        { error: "no report credits", code: "no_credits" },
        { status: 402 },
      );
    }
    creditsAfter = balance.credits - 1;
  }

  const report = await runMeasurement({
    lat,
    lng,
    address: sp.get("address") || undefined,
    placeId: sp.get("placeId") || undefined,
  });
  return buildResponse(report, creditsAfter);
}
