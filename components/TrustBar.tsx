import { ShieldCheck, Zap, Lock, BadgeDollarSign } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Accuracy guaranteed", sub: "±2% or money back" },
  { icon: Zap, label: "Reports in minutes", sub: "Not hours or days" },
  { icon: Lock, label: "Stripe-secured", sub: "256-bit SSL encrypted" },
  { icon: BadgeDollarSign, label: "No subscription", sub: "Pay per report" },
];

export default function TrustBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {items.map(({ icon: Icon, label, sub }) => (
        <div
          key={label}
          className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white/70 px-4 py-3"
        >
          <Icon className="shrink-0 text-trust-600 mt-0.5" size={22} />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-ink-900">{label}</div>
            <div className="text-xs text-stone-500">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
