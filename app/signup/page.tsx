export const metadata = { title: "Sign up", robots: { index: false, follow: false } };
export default function Page() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-display-md text-ink-900">Get started</h1>
      <p className="mt-3 text-stone-600">Or skip this — just generate a free sample on the homepage.</p>
      <a href="/#address" className="mt-6 inline-flex bg-go-500 hover:bg-go-600 text-white font-semibold rounded-xl px-5 py-3 shadow-go">Try a free sample instead</a>
    </div>
  );
}
