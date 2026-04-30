/**
 * Signed-cookie credit accounting. Zero infrastructure: a HMAC-SHA256 signed
 * payload `{credits, exp}` rides in `rt_credits`. Mutated only by:
 *   - Stripe webhook (on `checkout.session.completed`) — adds credits.
 *   - /api/measure (on a successful run) — decrements one credit.
 *
 * Without `SESSION_SIGNING_SECRET` the system is a no-op (cookies are not set
 * or read), which mirrors the rest of the repo's "no key, mock mode" stance.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_NAME = "rt_credits";
const DEFAULT_TTL_DAYS = 365;

export type CreditPayload = {
  credits: number;
  exp: number;
};

function getSecret(): string | null {
  const s = process.env.SESSION_SIGNING_SECRET;
  return s && s.length >= 16 ? s : null;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export function signCredits(payload: CreditPayload, secret = getSecret()): string | null {
  if (!secret) return null;
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = b64url(createHmac("sha256", secret).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyCredits(token: string | undefined | null, secret = getSecret()): CreditPayload | null {
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = createHmac("sha256", secret).update(body).digest();
  let provided: Buffer;
  try {
    provided = fromB64url(sig);
  } catch {
    return null;
  }
  if (provided.length !== expected.length) return null;
  if (!timingSafeEqual(provided, expected)) return null;
  let payload: any;
  try {
    payload = JSON.parse(fromB64url(body).toString("utf8"));
  } catch {
    return null;
  }
  if (typeof payload?.credits !== "number" || typeof payload?.exp !== "number") return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  if (payload.credits < 0) return null;
  return { credits: payload.credits, exp: payload.exp };
}

export function makeCookieValue(credits: number, ttlDays = DEFAULT_TTL_DAYS): string | null {
  const exp = Math.floor(Date.now() / 1000) + ttlDays * 86400;
  return signCredits({ credits, exp });
}

export function cookieAttrs(maxAgeSeconds = DEFAULT_TTL_DAYS * 86400): string {
  const httpsOnly = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `Path=/; HttpOnly; SameSite=Lax${httpsOnly}; Max-Age=${maxAgeSeconds}`;
}

export function isCreditsEnforced(): boolean {
  return getSecret() !== null;
}
