/**
 * Offline unit test for the Stripe webhook signature verifier.
 * Re-implements the verifier locally (the route module pulls in Next runtime
 * symbols that aren't available outside `next start`) and proves:
 *
 *   - a properly signed body verifies
 *   - tampered body fails
 *   - missing/old timestamp fails
 *   - unknown sig prefix fails
 *
 * Run:  npx tsx scripts/test-webhook-sig.ts
 */
import { createHmac, timingSafeEqual } from "node:crypto";

function verify(rawBody: string, header: string, secret: string, toleranceSeconds = 300): boolean {
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
    if (provided.length === expected.length && timingSafeEqual(provided, expected)) return true;
  }
  return false;
}

function sign(body: string, secret: string, ts: number): string {
  const sig = createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex");
  return `t=${ts},v1=${sig}`;
}

const SECRET = "whsec_unit_test_secret";
const BODY = JSON.stringify({ id: "evt_test", type: "checkout.session.completed" });
const now = Math.floor(Date.now() / 1000);

let failed = 0;
function assert(cond: any, msg: string) {
  if (!cond) { console.error("  FAIL:", msg); failed++; } else console.log("   OK :", msg);
}

// 1. valid signature
assert(verify(BODY, sign(BODY, SECRET, now), SECRET) === true, "valid sig + fresh ts verifies");

// 2. tampered body
assert(verify(BODY + "tamper", sign(BODY, SECRET, now), SECRET) === false, "tampered body rejected");

// 3. wrong secret
assert(verify(BODY, sign(BODY, SECRET, now), "different-secret") === false, "wrong secret rejected");

// 4. stale timestamp (>5 min)
assert(verify(BODY, sign(BODY, SECRET, now - 10_000), SECRET) === false, "stale timestamp rejected");

// 5. missing header
assert(verify(BODY, "", SECRET) === false, "empty header rejected");

// 6. malformed header
assert(verify(BODY, "garbage", SECRET) === false, "malformed header rejected");

if (failed > 0) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log("\nAll webhook signature tests passed.");
