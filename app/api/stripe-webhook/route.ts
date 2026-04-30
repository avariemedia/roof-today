import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { COOKIE_NAME, cookieAttrs, makeCookieValue, verifyCredits } from "@/lib/credits";
import { TIER_PRICING, type Tier } from "@/lib/stripe";

export const runtime = "nodejs";
// Required: don't let Next/Node parse the body before we verify the signature.
export const dynamic = "force-dynamic";

/**
 * Verify a Stripe webhook signature header (`Stripe-Signature`) against the
 * raw request body using the configured webhook secret. Implementation mirrors
 * the algorithm Stripe documents — split `t=...,v1=...` items, build the signed
 * payload `<t>.<rawBody>`, HMAC-SHA256 it with the secret, then constant-time
 * compare against the supplied v1 signatures.
 *
 * We implement this directly (instead of pulling in `stripe`) to avoid adding
 * a runtime dependency and to keep this route tree-shakable.
 */
function verifyStripeSignature(rawBody: string, header: string, secret: string, toleranceSeconds = 300): boolean {
  if (!header) return false;
  const parts = header.split(",").map((p) => p.trim());
  let timestamp: string | null = null;
  const v1: string[] = [];
  for (const p of parts) {
    const [k, v] = p.split("=");
    if (!k || !v) continue;
    if (k === "t") timestamp = v;
    else if (k === "v1") v1.push(v);
  }
  if (!timestamp || v1.length === 0) return false;
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - ts) > toleranceSeconds) return false;

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secret).update(signedPayload).digest();
  for (const sig of v1) {
    let provided: Buffer;
    try {
      provided = Buffer.from(sig, "hex");
    } catch {
      continue;
    }
    if (provided.length === expected.length && timingSafeEqual(provided, expected)) {
      return true;
    }
  }
  return false;
}

function reportsForAmount(cents: number): number | null {
  for (const [, t] of Object.entries(TIER_PRICING)) {
    if (t.cents === cents) return t.reports;
  }
  return null;
}

function reportsForTier(tier: string | undefined): number | null {
  if (!tier) return null;
  const t = TIER_PRICING[tier as Tier];
  return t ? t.reports : null;
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook not configured" }, { status: 503 });
  }
  const sigHeader = req.headers.get("stripe-signature") || "";
  const rawBody = await req.text();
  if (!verifyStripeSignature(rawBody, sigHeader, secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  if (event?.type !== "checkout.session.completed") {
    // Acknowledge — Stripe expects a 2xx for events we don't act on.
    return NextResponse.json({ ok: true, ignored: event?.type });
  }

  const session = event?.data?.object || {};
  if (session?.payment_status && session.payment_status !== "paid") {
    return NextResponse.json({ ok: true, ignored: "unpaid" });
  }

  const amount = Number(session?.amount_total);
  const tierMeta: string | undefined = session?.metadata?.tier;
  const reports = reportsForTier(tierMeta) ?? (Number.isFinite(amount) ? reportsForAmount(amount) : null);

  if (!reports) {
    return NextResponse.json({ error: "unknown tier/amount", amount, tier: tierMeta }, { status: 422 });
  }

  // Add to existing balance if the buyer's prior cookie is present.
  const existing = verifyCredits(req.cookies.get(COOKIE_NAME)?.value);
  const total = (existing?.credits ?? 0) + reports;
  const cookie = makeCookieValue(total);
  if (!cookie) {
    return NextResponse.json({ error: "signing secret missing" }, { status: 503 });
  }

  const res = NextResponse.json({ ok: true, credits: total, addedReports: reports });
  res.headers.append("Set-Cookie", `${COOKIE_NAME}=${cookie}; ${cookieAttrs()}`);
  return res;
}
