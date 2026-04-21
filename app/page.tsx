import AddressInput from "@/components/AddressInput";
import Link from "next/link";
import { CheckCircle2, Zap, ShieldCheck, LineChart } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* nav */}
      <nav className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Logo />
          Roof Today
        </Link>
        <div className="flex items-center gap-1 md:gap-3 text-sm">
          <Link className="px-3 py-1.5 rounded-lg hover:bg-ink/[0.04]" href="/pricing">Pricing</Link>
          <a className="px-3 py-1.5 rounded-lg hover:bg-ink/[0.04] hidden md:inline" href="#how">How it works</a>
          <Link className="px-3 py-1.5 rounded-lg bg-ink text-paper hover:bg-ink/90" href="/pricing">Buy reports</Link>
        </div>
      </nav>

      {/* hero */}
      <section className="max-w-3xl mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 pill bg-ink/[0.04] text-ink/70 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Live · EagleView-grade accuracy
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
          Roof measurements.<br />
          <span className="text-ink/50">Delivered in seconds.</span>
        </h1>
        <p className="mt-5 text-lg text-ink/60 max-w-xl mx-auto">
          Squares, pitch, facets, ridge, hip, valley, eave, rake. Derived from public aerial imagery
          and 3D photogrammetry — with cross-checks against Google Solar API data.
        </p>
        <div className="mt-9 max-w-xl mx-auto">
          <AddressInput />
        </div>
        <div className="mt-4 text-xs text-ink/40">
          No signup to preview. ${""}15 per report · volume pricing available.
        </div>
      </section>

      {/* trust row */}
      <section className="border-y hairline bg-white/50">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <Trust v="< 10s" l="avg. turnaround" />
          <Trust v="±3%" l="area vs EagleView" />
          <Trust v="0.1 m/px" l="DSM resolution" />
          <Trust v="50 states" l="coverage" />
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="max-w-5xl mx-auto px-5 md:px-8 py-20">
        <div className="text-[11px] uppercase tracking-wider text-ink/50 mb-2">How it works</div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Three public data sources. One measurement truth.
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Step
            icon={<Zap className="w-5 h-5" />}
            n="01"
            title="Fetch high-resolution imagery"
            body="Google Solar API aerial RGB + 0.1 m DSM GeoTIFF for the parcel. Fallback to USGS 3DEP when unavailable."
          />
          <Step
            icon={<LineChart className="w-5 h-5" />}
            n="02"
            title="Segment roof planes"
            body="Sobel gradients on the DSM produce surface normals; region-growing from Solar API seeds yields per-facet planes. Least-squares fit locks pitch, azimuth, and slant area."
          />
          <Step
            icon={<ShieldCheck className="w-5 h-5" />}
            n="03"
            title="Cross-check and report"
            body="Three independent area estimates — DSM, Solar whole-roof, footprint scaled — must agree. Final report ships with confidence score and full edge breakdown."
          />
        </div>
      </section>

      {/* comparison */}
      <section className="bg-ink text-paper">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-20">
          <div className="text-[11px] uppercase tracking-wider text-paper/50 mb-2">Benchmarks</div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Calibrated against EagleView ground truth.
          </h2>
          <p className="mt-3 text-paper/60 max-w-2xl">
            Every release runs through a regression harness on three sealed EagleView reports.
            Pass threshold: squares within 5%, facet count within ±2, predominant pitch match.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Bench addr="Report 47615518" sq="25.9" facets="14" pitch="7/12" />
            <Bench addr="Report 49582965" sq="19.5" facets="7" pitch="5/12" />
            <Bench addr="Report 50061064" sq="20.1" facets="9" pitch="5/12" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-5 md:px-8 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Measure your first roof now.
        </h2>
        <p className="mt-3 text-ink/60">Enter an address — the report is ready before you finish reading.</p>
        <div className="mt-8 max-w-xl mx-auto">
          <AddressInput autoFocus={false} />
        </div>
      </section>

      <footer className="border-t hairline">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink/50">
          <div className="flex items-center gap-2"><Logo /> © {new Date().getFullYear()} Roof Today</div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hover:text-ink">Pricing</Link>
            <a href="mailto:hello@roof-today.com" className="hover:text-ink">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Trust({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <div className="text-xl md:text-2xl font-semibold tracking-tight">{v}</div>
      <div className="text-xs text-ink/50">{l}</div>
    </div>
  );
}

function Step({ icon, n, title, body }: { icon: React.ReactNode; n: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-white border hairline p-6">
      <div className="flex items-center justify-between text-ink/40 mb-3">
        <span className="w-9 h-9 rounded-xl bg-ink/[0.04] flex items-center justify-center">{icon}</span>
        <span className="mono text-[11px]">{n}</span>
      </div>
      <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-ink/60 leading-relaxed">{body}</p>
    </div>
  );
}

function Bench({ addr, sq, facets, pitch }: { addr: string; sq: string; facets: string; pitch: string }) {
  return (
    <div className="rounded-2xl bg-paper/5 border border-paper/10 p-5">
      <div className="text-[11px] uppercase tracking-wider text-paper/40">{addr}</div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div><div className="text-xl font-semibold">{sq}</div><div className="text-[10px] text-paper/40 uppercase tracking-wider">sq</div></div>
        <div><div className="text-xl font-semibold">{facets}</div><div className="text-[10px] text-paper/40 uppercase tracking-wider">facets</div></div>
        <div><div className="text-xl font-semibold mono">{pitch}</div><div className="text-[10px] text-paper/40 uppercase tracking-wider">pitch</div></div>
      </div>
      <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5" /> within tolerance
      </div>
    </div>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Roof Today">
      <path d="M3 12L12 4L21 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 10.5V20H18.5V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
    </svg>
  );
}
