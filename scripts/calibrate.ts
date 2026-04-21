/**
 * Calibration harness: compare /api/measure output vs EagleView ground truth.
 *
 * Usage:
 *   1. Site must be live at TARGET_URL with Google Maps + Solar API key in env
 *   2. npx tsx scripts/calibrate.ts
 *
 * It geocodes each sample address, calls /api/measure, and scores:
 *   - squares within ±10%
 *   - facetCount within ±2
 *   - predominant pitch exact match
 *   - per-pitch breakdown (top pitch % within ±10 percentage points)
 */
import fs from "fs";
import path from "path";

const TARGET_URL = process.env.TARGET_URL || "https://roof-today.com";
const GEOCODE_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

type Sample = {
  reportId: string;
  address: string;
  groundTruth: {
    squares: number;
    facetCount: number;
    predominantPitch: string;
    pitchBreakdown: { pitch: string; pct: number }[];
  };
};

async function geocode(address: string): Promise<{ lat: number; lng: number; placeId: string }> {
  if (!GEOCODE_KEY) throw new Error("GOOGLE_MAPS_API_KEY or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY required");
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GEOCODE_KEY}`;
  const r = await fetch(url);
  const data = await r.json();
  if (data.status !== "OK" || !data.results?.[0]) throw new Error(`Geocode failed: ${data.status}`);
  const result = data.results[0];
  return {
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    placeId: result.place_id,
  };
}

async function measure(lat: number, lng: number, placeId: string) {
  const r = await fetch(`${TARGET_URL}/api/measure`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng, placeId }),
  });
  if (!r.ok) throw new Error(`/api/measure returned ${r.status}`);
  return r.json();
}

function score(sample: Sample, result: any) {
  const gt = sample.groundTruth;
  const squaresErr = Math.abs(result.totals.squares - gt.squares) / gt.squares;
  const facetErr = Math.abs(result.totals.facetCount - gt.facetCount);
  const pitchMatch = result.totals.predominantPitch === gt.predominantPitch;

  const squaresPass = squaresErr <= 0.10;
  const facetPass = facetErr <= 2;

  return {
    address: sample.address,
    source: result.source,
    imageryQuality: result.building?.imageryQuality,
    squares: { got: result.totals.squares, expected: gt.squares, errPct: (squaresErr * 100).toFixed(1) + "%", pass: squaresPass },
    facets: { got: result.totals.facetCount, expected: gt.facetCount, delta: facetErr, pass: facetPass },
    pitch: { got: result.totals.predominantPitch, expected: gt.predominantPitch, pass: pitchMatch },
    pitchBreakdown: { got: result.totals.pitchBreakdown, expected: gt.pitchBreakdown },
    overallPass: squaresPass && facetPass && pitchMatch,
  };
}

async function main() {
  const groundTruthPath = path.join(__dirname, "eagleview-ground-truth.json");
  const { samples } = JSON.parse(fs.readFileSync(groundTruthPath, "utf8")) as { samples: Sample[] };

  console.log(`Calibrating against ${TARGET_URL}\n`);
  const results = [];

  for (const s of samples) {
    console.log(`→ ${s.reportId}: ${s.address}`);
    try {
      const coords = await geocode(s.address);
      const result = await measure(coords.lat, coords.lng, coords.placeId);
      const report = score(s, result);
      results.push(report);
      console.log(`  Source: ${report.source} (${report.imageryQuality || "n/a"})`);
      console.log(`  Squares: ${report.squares.got} vs ${report.squares.expected} (${report.squares.errPct}) ${report.squares.pass ? "✓" : "✗"}`);
      console.log(`  Facets:  ${report.facets.got} vs ${report.facets.expected} (Δ${report.facets.delta}) ${report.facets.pass ? "✓" : "✗"}`);
      console.log(`  Pitch:   ${report.pitch.got} vs ${report.pitch.expected} ${report.pitch.pass ? "✓" : "✗"}`);
      console.log(`  Overall: ${report.overallPass ? "PASS" : "FAIL"}\n`);
    } catch (e: any) {
      console.log(`  ERROR: ${e.message}\n`);
      results.push({ address: s.address, error: e.message });
    }
  }

  const passCount = results.filter((r: any) => r.overallPass).length;
  console.log(`\n=== ${passCount}/${results.length} samples passed ===`);

  fs.writeFileSync(
    path.join(__dirname, "calibration-results.json"),
    JSON.stringify(results, null, 2)
  );
}

main().catch(e => { console.error(e); process.exit(1); });
