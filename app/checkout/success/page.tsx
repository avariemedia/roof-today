import Link from "next/link";
import { CheckCircle2, Mail, Download } from "lucide-react";

export const metadata = {
  title: "Report Unlocked — Roof Today",
  robots: { index: false, follow: false },
};

export default function Page({
  searchParams,
}: {
  searchParams: { address?: string; report?: string; session_id?: string; dev?: string };
}) {
  const address = searchParams.address || "";
  const reportId = searchParams.report || "";
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <CheckCircle2 className="mx-auto text-go-500" size={56} />
        <h1 className="mt-4 text-display-md text-ink-900">Your report is unlocked.</h1>
        <p className="mt-3 text-stone-600">
          {address ? `Full report for ${address} is being generated now.` : "Your full report is being generated now."}
        </p>

        <div className="mt-8 rounded-2xl bg-white border border-stone-200 p-6 text-left shadow-card">
          <div className="flex items-start gap-3">
            <Mail className="text-trust-600 mt-0.5" size={22} />
            <div>
              <div className="font-semibold text-ink-900">Check your email</div>
              <div className="text-sm text-stone-600">You'll get a magic-link to your dashboard and a PDF attachment within minutes.</div>
            </div>
          </div>
          <div className="mt-5 flex items-start gap-3">
            <Download className="text-trust-600 mt-0.5" size={22} />
            <div>
              <div className="font-semibold text-ink-900">Download your PDF</div>
              <div className="text-sm text-stone-600">Insurance-ready, fully branded. Available from your dashboard.</div>
            </div>
          </div>
          {reportId && <div className="mt-5 text-xs font-mono text-stone-500">Report ID: {reportId}</div>}
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-800 text-white font-semibold rounded-xl py-3">
            Go to Dashboard
          </Link>
          <Link href="/#address" className="inline-flex items-center justify-center gap-2 bg-go-500 hover:bg-go-600 text-white font-semibold rounded-xl py-3 shadow-go">
            Order Another Report
          </Link>
        </div>

        {searchParams.dev && (
          <p className="mt-6 text-xs text-amber-600">
            Dev mode: Stripe keys not set. This is a simulated success. Add STRIPE_SECRET_KEY to enable real checkout.
          </p>
        )}
      </div>
    </div>
  );
}
