import { Check, X } from "lucide-react";

const rows = [
  { feature: "Price per report", rt: "$4–$12.50", ev: "~$85", gaf: "~$65", hover: "~$50" },
  { feature: "Turnaround", rt: "Minutes", ev: "2–24 hrs", gaf: "Hours", hover: "Same day" },
  { feature: "Subscription required", rt: false, ev: true, gaf: true, hover: true },
  { feature: "Free sample preview", rt: true, ev: false, gaf: false, hover: false },
  { feature: "Insurance-ready PDF", rt: true, ev: true, gaf: true, hover: true },
  { feature: "Contracts / commitment", rt: false, ev: true, gaf: true, hover: true },
  { feature: "Mobile-first UX", rt: true, ev: false, gaf: false, hover: true },
  { feature: "Pay only when you need it", rt: true, ev: false, gaf: false, hover: false },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="text-go-600 mx-auto" size={20} />
    ) : (
      <X className="text-stone-300 mx-auto" size={20} />
    );
  }
  return <span className="text-sm text-stone-700">{value}</span>;
}

export default function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
      <table className="w-full text-left min-w-[640px]">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50">
            <th className="px-4 md:px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Feature</th>
            <th className="px-4 md:px-6 py-4">
              <div className="text-ink-900 font-bold">Roof Today</div>
              <div className="text-xs text-go-600 font-semibold">Best value</div>
            </th>
            <th className="px-4 md:px-6 py-4 text-stone-600 font-semibold">EagleView</th>
            <th className="px-4 md:px-6 py-4 text-stone-600 font-semibold">GAF QuickMeasure</th>
            <th className="px-4 md:px-6 py-4 text-stone-600 font-semibold">Hover</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.feature} className={i % 2 ? "bg-stone-50/50" : "bg-white"}>
              <td className="px-4 md:px-6 py-3.5 text-sm font-medium text-ink-900">{r.feature}</td>
              <td className="px-4 md:px-6 py-3.5 text-center font-semibold">
                {typeof r.rt === "boolean" ? <Cell value={r.rt} /> : (
                  <span className="text-ink-900">{r.rt}</span>
                )}
              </td>
              <td className="px-4 md:px-6 py-3.5 text-center"><Cell value={r.ev} /></td>
              <td className="px-4 md:px-6 py-3.5 text-center"><Cell value={r.gaf} /></td>
              <td className="px-4 md:px-6 py-3.5 text-center"><Cell value={r.hover} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
