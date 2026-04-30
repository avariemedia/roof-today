/**
 * Unit smoke for the signed-cookie credit module.
 * Runs offline, no server required:  npx tsx scripts/test-credits.ts
 *
 * Covers: round-trip, tampered signature, expired payload, missing secret,
 * negative balance, enforced flag.
 */
import { signCredits, verifyCredits, makeCookieValue, isCreditsEnforced } from "../lib/credits";

let failed = 0;
function assert(cond: any, msg: string) {
  if (!cond) {
    console.error("  FAIL:", msg);
    failed++;
  } else {
    console.log("   OK :", msg);
  }
}

const SECRET = "test-secret-please-do-not-use-in-prod-32b";
process.env.SESSION_SIGNING_SECRET = SECRET;

const now = Math.floor(Date.now() / 1000);

// 1. round-trip
const t1 = signCredits({ credits: 10, exp: now + 3600 })!;
assert(typeof t1 === "string" && t1.includes("."), "signCredits returns body.sig token");
const v1 = verifyCredits(t1);
assert(v1?.credits === 10, "verifyCredits returns credits=10");

// 2. tampered signature
const [body, sig] = t1.split(".");
const tampered = body + "." + sig.slice(0, -2) + "AA";
assert(verifyCredits(tampered) === null, "tampered signature is rejected");

// 3. expired payload
const t3 = signCredits({ credits: 5, exp: now - 10 })!;
assert(verifyCredits(t3) === null, "expired payload is rejected");

// 4. negative balance is rejected
const t4 = signCredits({ credits: -1, exp: now + 3600 })!;
assert(verifyCredits(t4) === null, "negative credits is rejected");

// 5. mismatched secret
assert(verifyCredits(t1, "different-secret-still-long-enough-32b!!") === null, "wrong secret is rejected");

// 6. makeCookieValue + isCreditsEnforced
assert(makeCookieValue(2) !== null, "makeCookieValue produces a token when secret is set");
assert(isCreditsEnforced() === true, "isCreditsEnforced=true when secret is set");

// 7. no secret → no-op
delete process.env.SESSION_SIGNING_SECRET;
assert(makeCookieValue(2) === null, "makeCookieValue null without secret");
assert(isCreditsEnforced() === false, "isCreditsEnforced=false without secret");
assert(verifyCredits(t1) === null, "verifyCredits null without secret");

if (failed > 0) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log("\nAll credit tests passed.");
