import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, TIER_PRICING, type Tier } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { tier } = await req.json();
    if (!tier || !(tier in TIER_PRICING)) {
      return NextResponse.json({ error: "valid tier required: starter | pro | volume" }, { status: 400 });
    }
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.get("origin") ||
      `http://${req.headers.get("host")}`;
    const result = await createCheckoutSession(tier as Tier, origin);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Checkout failed" }, { status: 500 });
  }
}
