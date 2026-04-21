export const metadata = {
  title: "Contact Roof Today",
  description: "Get in touch with Roof Today — sales, support, API access.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-display-md text-ink-900">Contact</h1>
      <p className="mt-4 text-stone-600">
        Questions about pricing, API access, team plans, or a specific report? We answer fast.
      </p>
      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 space-y-3 text-sm">
        <div><span className="font-semibold text-ink-900">Support:</span> support@roof-today.com</div>
        <div><span className="font-semibold text-ink-900">Sales:</span> sales@roof-today.com</div>
        <div><span className="font-semibold text-ink-900">Partnerships / API:</span> api@roof-today.com</div>
      </div>
    </div>
  );
}
