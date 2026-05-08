import { Metric } from "./Metric";

export function MetricRow({
  counts,
}: {
  counts: { all: number; canonical: number; draft: number; candidate: number };
}) {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4 mb-6">
      <Metric label="total" value={counts.all} accent="slate" />
      <Metric label="canonical" value={counts.canonical} accent="emerald" />
      <Metric label="draft" value={counts.draft} accent="amber" />
      <Metric label="candidate" value={counts.candidate} accent="cyan" />
    </div>
  );
}
