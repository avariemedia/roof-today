/**
 * EagleView comparison module.
 * Input:  our MeasurementReport + an EagleViewSample.
 * Output: field-by-field deviation with PASS/FAIL flags at 5% tolerance.
 */
import { MeasurementReport } from "../photogrammetry/types";
import { EagleViewSample } from "./eagleview-truth";

export type ComparisonField = {
  field: string;
  got: number | string;
  expected: number | string;
  deviationPct: number | null;
  absDelta: number | null;
  status: "PASS" | "FAIL" | "INFO";
};

export type ComparisonReport = {
  address: string;
  eagleViewId: string;
  overall: "PASS" | "FAIL";
  passed: number;
  failed: number;
  fields: ComparisonField[];
  tolerance: { squaresPct: number; facetDelta: number; pitchPctPoints: number };
};

export function compareToEagleView(report: MeasurementReport, sample: EagleViewSample): ComparisonReport {
  const fields: ComparisonField[] = [];
  const tolerance = { squaresPct: 5, facetDelta: 2, pitchPctPoints: 10 };

  // Squares
  const sqDev = Math.abs(report.totals.squares - sample.squares) / sample.squares;
  fields.push({
    field: "Squares",
    got: report.totals.squares,
    expected: sample.squares,
    deviationPct: Number((sqDev * 100).toFixed(2)),
    absDelta: Number((report.totals.squares - sample.squares).toFixed(2)),
    status: sqDev * 100 <= tolerance.squaresPct ? "PASS" : "FAIL",
  });

  // Facet count
  const facetDelta = Math.abs(report.totals.facetCount - sample.facetCount);
  fields.push({
    field: "Facet count",
    got: report.totals.facetCount,
    expected: sample.facetCount,
    deviationPct: sample.facetCount ? Number(((facetDelta / sample.facetCount) * 100).toFixed(2)) : null,
    absDelta: report.totals.facetCount - sample.facetCount,
    status: facetDelta <= tolerance.facetDelta ? "PASS" : "FAIL",
  });

  // Predominant pitch (exact)
  fields.push({
    field: "Predominant pitch",
    got: report.totals.predominantPitch,
    expected: sample.predominantPitch,
    deviationPct: null,
    absDelta: null,
    status: report.totals.predominantPitch === sample.predominantPitch ? "PASS" : "FAIL",
  });

  // Per-pitch breakdown — compare top pitch percentage
  const ourTop = report.totals.pitchBreakdown[0];
  const gtTop = sample.pitchBreakdown[0];
  if (ourTop && gtTop) {
    const ppDelta = Math.abs(ourTop.pct - gtTop.pct);
    fields.push({
      field: `Top pitch share (${gtTop.pitch})`,
      got: `${ourTop.pct}% @ ${ourTop.pitch}`,
      expected: `${gtTop.pct}% @ ${gtTop.pitch}`,
      deviationPct: ppDelta,
      absDelta: ourTop.pct - gtTop.pct,
      status: ppDelta <= tolerance.pitchPctPoints && ourTop.pitch === gtTop.pitch ? "PASS" : "FAIL",
    });
  }

  // Total linear footage — informational only (EagleView Bid Perfect doesn't expose LF totals)
  fields.push({
    field: "Total linear footage (informational)",
    got: report.totals.totalLf,
    expected: "n/a",
    deviationPct: null,
    absDelta: null,
    status: "INFO",
  });

  const passed = fields.filter((f) => f.status === "PASS").length;
  const failed = fields.filter((f) => f.status === "FAIL").length;

  return {
    address: sample.address,
    eagleViewId: sample.reportId,
    overall: failed === 0 ? "PASS" : "FAIL",
    passed,
    failed,
    fields,
    tolerance,
  };
}
