/**
 * Calibration harness.
 *
 * Usage:
 *   1. Start dev server:  npm run dev   (in another terminal)
 *   2. Run:               npm run calibrate
 *
 * Runs the 3 EagleView truth samples through /api/geocode + /api/measure,
 * then compares via lib/report/compare and prints a PASS/FAIL table.
 *
 * Set CALIBRATE_BASE_URL to target a deployed instance.
 */
import { EAGLEVIEW_SAMPLES } from "../lib/report/eagleview-truth";
import { compareToEagleView } from "../lib/report/compare";

const BASE = process.env.CALIBRATE_BASE_URL || "http://localhost:3000";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

function tag(status: "PASS" | "FAIL" | "INFO") {
  if (status === "PASS") return `${GREEN}PASS${RESET}`;
  if (status === "FAIL") return `${RED}FAIL${RESET}`;
  return `${DIM}INFO${RESET}`;
}

async function geocode(address: string): Promise<{ lat: number; lng: number; formatted: string }> {
  const r = await fetch(`${BASE}/api/geocode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });
  const d = await r.json();
  if (!d?.lat || !d?.lng) throw new Error(`geocode failed for "${address}"`);
  return { lat: d.lat, lng: d.lng, formatted: d.formatted || address };
}

async function measure(lat: number, lng: number, address: string) {
  const r = await fetch(`${BASE}/api/measure`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng, address }),
  });
  if (!r.ok) throw new Error(`measure failed (${r.status}): ${await r.text()}`);
  return r.json();
}

async function main() {
  console.log(`\n  ${BOLD}Roof Today — EagleView calibration${RESET}`);
  console.log(`  Target: ${BASE}\n`);

  let totalPass = 0;
  let totalFail = 0;

  for (const s of EAGLEVIEW_SAMPLES) {
    console.log(`  ${BOLD}${s.reportId}${RESET}  ${DIM}${s.address}${RESET}`);
    try {
      const geo = await geocode(s.address);
      const report = await measure(geo.lat, geo.lng, geo.formatted);
      const cmp = compareToEagleView(report, s);

      console.log(`  overall:  ${tag(cmp.overall)}  (passed ${cmp.passed} / failed ${cmp.failed})`);
      console.log(`  confidence: ${report.confidence.tier} · ${Math.round(report.confidence.score * 100)}%  source=${report.source}`);
      for (const f of cmp.fields) {
        const dev = f.deviationPct != null ? ` dev=${f.deviationPct.toFixed(1)}%` : "";
        console.log(`    ${tag(f.status)}  ${f.field.padEnd(40)}  got=${String(f.got).padEnd(16)} expected=${String(f.expected).padEnd(14)}${dev}`);
      }
      if (cmp.overall === "PASS") totalPass++;
      else totalFail++;
    } catch (e: any) {
      console.log(`  ${tag("FAIL")}  ${e?.message || "error"}`);
      totalFail++;
    }
    console.log();
  }

  console.log("  " + "─".repeat(74));
  const ok = totalFail === 0;
  const color = ok ? GREEN : RED;
  console.log(`  ${color}${totalPass} / ${EAGLEVIEW_SAMPLES.length} samples PASS${RESET}\n`);
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
