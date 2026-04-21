import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://roof-today.com";

type PlanId = "starter" | "pro" | "volume";

// Plan catalog with cents pricing + Stripe Price ID env mapping
const PLANS: Record<PlanId, { name: string; description: string; reports: number; amountCents: number; priceEnv: string }> = {
  starter: {
    name: "Roof Today — Starter Pack",
    description: "2 roof measurement report credits",
    reports: 2,
    amountCents: 2500,
    priceEnv: "NEXT_PUBLIC_STRIPE_PRICE_STARTER",
  },
  pro: {
    name: "Roof Today — Pro Pack",
    description: "10 roof measurement report credits",
    reports: 10,
    amountCents: 5000,
    priceEnv: "NEXT_PUBLIC_STRIPE_PRICE_PRO",
  },
  volume: {
    name: "Roof Today — Volume Pack",
    description: "50 roof measurement report credits",
    reports: 50,
    amountCents: 20000,
    priceEnv: "NEXT_PUBLIC_STRIPE_PRICE_VOLUME",
  },
};

export async function POST(req: Request) {
  try {
    const { email, address, reportId, plan } = await req.json();
    const planId: PlanId = (plan && PLANS[plan as PlanId]) ? plan : "starter";
    const selected = PLANS[planId];

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env[selected.priceEnv];

    // Dev fallback: if Stripe isn't configured, return a simulated success URL
    if (!secretKey) {
      return NextResponse.json({
        url: `${SITE_URL}/checkout/success?dev=1&plan=${planId}&address=${encodeURIComponent(address || "")}&report=${encodeURIComponent(reportId || "")}`,
      });
    }

    const body = new URLSearchParams();
    body.append("mode", "payment");
    body.append("success_url", `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}&address=${encodeURIComponent(address || "")}&report=${encodeURIComponent(reportId || "")}`);
    body.append("cancel_url", `${SITE_URL}/report/preview?address=${encodeURIComponent(address || "")}`);
    body.append("customer_email", email || "");
    body.append("allow_promotion_codes", "true");
    body.append("payment_method_types[]", "card");

    if (priceId) {
      body.append("line_items[0][price]", priceId);
      body.append("line_items[0][quantity]", "1");
    } else {
      body.append("line_items[0][price_data][currency]", "usd");
      body.append("line_items[0][price_data][product_data][name]", selected.name);
      body.append("line_items[0][price_data][product_data][description]", selected.description);
      body.append("line_items[0][price_data][unit_amount]", String(selected.amountCents));
      body.append("line_items[0][quantity]", "1");
    }

    body.append("metadata[plan]", planId);
    body.append("metadata[reports]", String(selected.reports));
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
