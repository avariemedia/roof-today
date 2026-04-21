import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function Success({ searchParams }: { searchParams: { session?: string; reports?: string } }) {
  const reports = searchParams?.reports || "—";
  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-md w-full rounded-2xl bg-white border hairline p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Payment received</h1>
        <p className="mt-2 text-ink/60 text-sm">
          {reports} report credits added to your account. You'll get a confirmation email shortly.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link href="/" className="rounded-xl bg-ink text-paper px-4 py-2.5 text-sm font-medium hover:bg-ink/90">Measure a roof</Link>
          <Link href="/pricing" className="text-xs text-ink/50 hover:text-ink">← Back to pricing</Link>
        </div>
        {searchParams?.session ? <div className="mt-6 text-[10px] mono text-ink/30 break-all">{searchParams.session}</div> : null}
      </div>
    </main>
  );
}
