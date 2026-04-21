import { ShieldCheck, Shield, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type Tier = "HIGH" | "MEDIUM" | "LOW";

export default function ConfidenceBadge({
  tier,
  score,
  compact = false,
}: {
  tier: Tier;
  score: number;
  compact?: boolean;
}) {
  const config = {
    HIGH: { Icon: ShieldCheck, label: "High confidence", cls: "bg-emerald-50 text-emerald-900 border-emerald-200" },
    MEDIUM: { Icon: Shield, label: "Medium confidence", cls: "bg-amber-50 text-amber-900 border-amber-200" },
    LOW: { Icon: ShieldAlert, label: "Low confidence", cls: "bg-rose-50 text-rose-900 border-rose-200" },
  }[tier];
  const { Icon, label, cls } = config;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", cls)}>
      <Icon className="w-3.5 h-3.5" />
      {compact ? tier : label}
      <span className="opacity-60 mono">{Math.round(score * 100)}%</span>
    </span>
  );
}
