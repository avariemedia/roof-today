import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "I was paying $85 a report with EagleView. Roof Today gave me the same measurements for $19 in under 5 minutes. I cancelled my EagleView subscription the same day.",
    name: "Marcus Reilly",
    role: "Owner, Reilly Roofing Co.",
    city: "Tampa, FL",
  },
  {
    quote:
      "The free sample sold me. I previewed my own house, saw the report was real, paid the $19, and got the full PDF before I finished my coffee.",
    name: "Danielle Cho",
    role: "Estimator, North Star Exteriors",
    city: "Minneapolis, MN",
  },
  {
    quote:
      "Insurance accepted it first try. That's all I needed to know. No subscription trap, no waiting, done.",
    name: "Luis Fernandez",
    role: "Storm Restoration Lead, Bluegrass Contractors",
    city: "Louisville, KY",
  },
];

export default function Testimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {testimonials.map((t) => (
        <figure
          key={t.name}
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card"
        >
          <div className="flex gap-0.5 text-go-500 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <blockquote className="text-ink-900 text-[0.95rem] leading-relaxed">
            "{t.quote}"
          </blockquote>
          <figcaption className="mt-5 pt-4 border-t border-stone-100">
            <div className="font-semibold text-sm text-ink-900">{t.name}</div>
            <div className="text-xs text-stone-500">
              {t.role} · {t.city}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
