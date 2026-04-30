/**
 * Stripe adapter. Real checkout when STRIPE_SECRET_KEY is present,
 * mock session URL otherwise so the dev experience never breaks.
 */
export type Tier = "starter" | "pro" | "volume";

export const TIER_PRICING: Record<Tier, { reports: number; cents: number; label: string; perReport: string }> = {
  starter: { reports: 2, cents: 2500, label: "Starter", perReport: "$12.50 / report" },
  pro: { reports: 10, cents: 5000, label: "Pro", perReport: "$5.00 / report" },
  volume: { reports: 50, cents: 20000, label: "Volume", perReport: "$4.00 / report" },
};

export async function createCheckoutSession(tier: Tier, origin: string): Promise<{ url: string; mock: boolean }> {
  const secret = process.env.STRIPE_SECRET_KEY;
  const t = TIER_PRICING[tier];

  if (!secret) {
    return {
      url: `${origin}/success?session=mock_${tier}_${Date.now()}&reports=${t.reports}`,
      mock: true,
    };
  }

  const priceIdEnv = {
    starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
    pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    volume: process.env.NEXT_PUBLIC_STRIPE_PRICE_VOLUME,
  }[tier];

  const body = new URLSearchParams();
  body.append("mode", "payment");
  body.append("success_url", `${origin}/success?session={CHECKOUT_SESSION_ID}&reports=${t.reports}`);
  body.append("cancel_url", `${origin}/pricing?canceled=1`);
  body.append("payment_method_types[]", "card");
  // `tier` lets the webhook map the paid session back to a known credit pack
  // even if the price IDs were created out-of-band (no inline amount match).
  body.append("metadata[tier]", tier);

  if (priceIdEnv) {
    body.append("line_items[0][price]", priceIdEnv);
    body.append("line_items[0][quantity]", "1");
  } else {
    body.append("line_items[0][price_data][currency]", "usd");
    body.append("line_items[0][price_data][product_data][name]", `Roof Measure ${t.label} (${t.reports} reports)`);
    body.append("line_items[0][price_data][unit_amount]", String(t.cents));
    body.append("line_items[0][quantity]", "1");
  }

  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error?.message || "Stripe error");
  return { url: data.url as string, mock: false };
}
