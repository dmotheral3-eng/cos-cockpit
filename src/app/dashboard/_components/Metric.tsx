export type MetricAccent = "slate" | "emerald" | "amber" | "cyan";

const ACCENT_MAP: Record<MetricAccent, { card: string; label: string; value: string }> = {
  slate: {
    card: "from-slate-900 to-slate-950 border-slate-800",
    label: "text-slate-500",
    value: "text-slate-100",
  },
  emerald: {
    card: "from-emerald-950/40 to-slate-900 border-emerald-900/60",
    label: "text-emerald-400",
    value: "text-emerald-200",
  },
  amber: {
    card: "from-amber-950/40 to-slate-900 border-amber-900/60",
    label: "text-amber-400",
    value: "text-amber-200",
  },
  cyan: {
    card: "from-cyan-950/40 to-slate-900 border-cyan-900/60",
    label: "text-cyan-400",
    value: "text-cyan-200",
  },
};

export function Metric({
  label,
  value,
  accent = "slate",
}: {
  label: string;
  value: number | string;
  accent?: MetricAccent;
}) {
  const a = ACCENT_MAP[accent];
  return (
    <div className={`p-4 rounded-lg bg-gradient-to-br border ${a.card}`}>
      <div
        className={`text-[10px] font-mono tracking-[0.16em] uppercase mb-2 ${a.label}`}
      >
        {label}
      </div>
      <div className={`text-3xl font-light tracking-tight ${a.value}`}>{value}</div>
    </div>
  );
}
