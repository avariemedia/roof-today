import { NextRequest, NextResponse } from "next/server";
import { compareToEagleView } from "@/lib/report/compare";
import { EAGLEVIEW_SAMPLES } from "@/lib/report/eagleview-truth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { report, sampleId } = await req.json();
  if (!report) return NextResponse.json({ error: "report required" }, { status: 400 });
  const sample = EAGLEVIEW_SAMPLES.find((s) => s.reportId === sampleId) || EAGLEVIEW_SAMPLES[0];
  const comparison = compareToEagleView(report, sample);
  return NextResponse.json(comparison);
}

export async function GET() {
  return NextResponse.json({ samples: EAGLEVIEW_SAMPLES.map((s) => ({ id: s.reportId, address: s.address })) });
}
