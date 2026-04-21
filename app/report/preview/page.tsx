import { Suspense } from "react";
import ReportPreviewClient from "./ReportPreviewClient";

export const metadata = {
  title: "Your Roof Report Preview",
  description:
    "Preview your roof measurement report free. Total squares, pitch, and diagram are free — unlock facet-level measurements starting at $12.50 \(2-pack $25\).",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-stone-500">Generating preview…</div>}>
      <ReportPreviewClient />
    </Suspense>
  );
}
