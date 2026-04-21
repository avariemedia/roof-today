export const metadata = { title: "Sign in", robots: { index: false, follow: false } };
export default function Page() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-display-md text-ink-900">Sign in</h1>
      <p className="mt-3 text-stone-600">Enter your email and we'll send a magic link.</p>
      <form className="mt-6 flex flex-col gap-3">
        <input type="email" placeholder="you@contractor.com" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-go-400" />
        <button type="button" className="bg-go-500 hover:bg-go-600 text-white font-semibold rounded-xl py-3 shadow-go">Send magic link</button>
      </form>
      <p className="mt-6 text-xs text-stone-500">Auth wiring is stubbed — plug in Clerk or Auth.js in the next iteration.</p>
    </div>
  );
}
