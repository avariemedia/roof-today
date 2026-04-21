import Link from "next/link";
import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="bg-ink-950 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2">
            <div className="text-white">
              <Logo />
            </div>
            <p className="mt-4 text-sm text-stone-400 max-w-sm">
              The roof measurement report contractors actually use. Accurate, instant,
              affordable. No subscription. No contracts.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/sample-report" className="hover:text-white">Sample Report</Link></li>
              <li><Link href="/features/accuracy" className="hover:text-white">Accuracy</Link></li>
              <li><Link href="/features/speed" className="hover:text-white">Speed</Link></li>
              <li><Link href="/api-access" className="hover:text-white">API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Compare</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/vs/eagleview" className="hover:text-white">vs EagleView</Link></li>
              <li><Link href="/vs/gaf-quickmeasure" className="hover:text-white">vs GAF QuickMeasure</Link></li>
              <li><Link href="/vs/hover" className="hover:text-white">vs Hover</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">For</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/for/roofing-contractors" className="hover:text-white">Roofing Contractors</Link></li>
              <li><Link href="/for/solar-installers" className="hover:text-white">Solar Installers</Link></li>
              <li><Link href="/for/insurance-adjusters" className="hover:text-white">Insurance Adjusters</Link></li>
              <li><Link href="/for/storm-restoration" className="hover:text-white">Storm Restoration</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink-800 flex flex-col md:flex-row gap-4 justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Roof Today. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-stone-300">Terms</Link>
            <Link href="/privacy" className="hover:text-stone-300">Privacy</Link>
            <Link href="/refund" className="hover:text-stone-300">Refund Policy</Link>
            <Link href="/contact" className="hover:text-stone-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
