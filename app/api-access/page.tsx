export const metadata = {
  title: "Roof Today API — Aerial Roof Measurement API for Contractors",
  description:
    "Roof Today API: programmatic access to aerial roof measurement reports. Included on Team plans. Request API access.",
  alternates: { canonical: "/api-access" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-display-md text-ink-900">API access</h1>
      <p className="mt-4 text-stone-600 text-lg max-w-2xl">
        Programmatic aerial roof measurements for contractors, CRMs, and estimation platforms. Included on Team plans with volume pricing.
      </p>
      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-700">
        <p><strong>POST /v1/reports</strong> — create a report by address.</p>
        <p className="mt-2"><strong>GET /v1/reports/:id</strong> — fetch measurements + PDF URL.</p>
        <p className="mt-4">Request access: <a className="text-trust-700 underline" href="/contact?topic=api">contact our API team</a>.</p>
      </div>
    </div>
  );
}
