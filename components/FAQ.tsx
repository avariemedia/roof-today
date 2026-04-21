"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FAQItem = { q: string; a: string };

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <button
              key={i}
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left p-5 md:p-6 group"
              aria-expanded={isOpen}
            >
              <div className="flex items-start justify-between gap-6">
                <h3 className="font-semibold text-ink-900 text-base md:text-lg">{item.q}</h3>
                <ChevronDown
                  className={`shrink-0 text-stone-400 mt-1 transition-transform ${
                    isOpen ? "rotate-180 text-go-600" : ""
                  }`}
                  size={20}
                />
              </div>
              {isOpen && (
                <p className="mt-3 text-stone-600 leading-relaxed text-sm md:text-base">{item.a}</p>
              )}
            </button>
          );
        })}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((i) => ({
              "@type": "Question",
              name: i.q,
              acceptedAnswer: { "@type": "Answer", text: i.a },
            })),
          }),
        }}
      />
    </>
  );
}
