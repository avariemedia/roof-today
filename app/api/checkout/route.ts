import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.roof-today.com";

export async function POST(req: Request) {
  try {
    const { email, address, reportId } = await req.json();

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_SINGLE;

    // Fallback: if Stripe isn't configured yet, return a dev redirect so the flow works end-to-end
    if (!secretKey) {
      return NextResponse.json({
        url: `${SITE_URL}/checkout/success?dev=1&address=${encodeURIComponent(address || "")}&report=${encodeURIComponent(reportId || "")}`,
      });
    }

    // Build a Stripe Checkout session via the REST API (no SDK, no extra deps)
    const body = new URLSearchParams();
    body.append("mode", "payment");
    body.append("success_url", `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&address=${encodeURIComponent(address || "")}&report=${encodeURIComponent(reportId || "")}`);
    body.append("cancel_url", `${SITE_URL}/report/preview?address=${encodeURIComponent(address || "")}`);
    body.append("customer_email", email || "");
    body.append("allow_promotion_codes", "true");
    body.append("payment_method_types[]", "card");

    if (priceId) {
      body.append("line_items[0][price]", priceId);
      body.append("line_items[0][quantity]", "1");
    } else {
      // Ad-hoc $19 line item if no price ID is set
      body.append("line_items[0][price_data][currency]", "usd");
      body.append("line_items[0][price_data][product_data][name]", "Roof Today — Roof Measurement Report");
      body.append("line_items[0][price_data][product_data][description]", address ? `Report for ${address}` : "Single roof measurement report");
      body.append("line_items[0][price_data][unit_amount]", "1900");
      body.append("line_items[0][quantity]", "1");
    }

    body.append("metadata[address]", address || "");
    body.append("metadata[report_id]", reportId || "");

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.message || "Stripe error" }, { status: 400 });
    }

    return NextResponse.json({ url: data.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
