"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MobileStickyCTA({
  href = "/#address",
  label = "Get Free Sample Report",
  price,
}: {
  href?: string;
  label?: string;
  price?: string;
}) {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 safe-bottom px-3 pt-3">
      <Link
        href={href}
        className="w-full inline-flex items-center justify-center gap-2 bg-go-500 hover:bg-go-600 text-white font-semibold rounded-xl py-3.5 shadow-go"
      >
        {label}
        {price && <span className="opacity-80 text-sm">· {price}</span>}
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
