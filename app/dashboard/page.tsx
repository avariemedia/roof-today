export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-display-md text-ink-900">Your reports</h1>
      <p className="mt-3 text-stone-600">Dashboard placeholder — wiring to come in v1.1 once auth and persistence are turned on.</p>
      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-10 text-center">
        <div className="text-stone-500">No reports yet. Order your first to see it here.</div>
        <a href="/#address" className="mt-6 inline-flex bg-go-500 hover:bg-go-600 text-white font-semibold rounded-xl px-5 py-3 shadow-go">Order your first report</a>
      </div>
    </div>
  );
}
