"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/vs/eagleview", label: "vs EagleView" },
  { href: "/sample-report", label: "Sample Report" },
  { href: "/for/roofing-contractors", label: "For Contractors" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-ink-900" aria-label="Roof Today home">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink-900 transition">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm font-semibold text-stone-700 px-3 py-2 hover:text-ink-900"
          >
            Sign in
          </Link>
          <Link
            href="/#address"
            className="text-sm font-semibold text-white bg-go-500 hover:bg-go-600 px-4 py-2.5 rounded-lg shadow-go transition"
          >
            Get Free Sample
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 -mr-2 text-ink-900"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-stone-100 bg-white">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-3 text-base font-medium text-stone-800"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="py-3 text-base font-medium text-stone-800"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/#address"
              onClick={() => setOpen(false)}
              className="mt-2 text-center text-white bg-go-500 hover:bg-go-600 px-4 py-3 rounded-lg font-semibold shadow-go"
            >
              Get Free Sample
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
