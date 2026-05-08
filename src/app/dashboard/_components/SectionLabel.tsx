export function SectionLabel({
  num,
  title,
  subtitle,
}: {
  num: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <div className="text-[10px] font-mono tracking-[0.3em] text-cyan-400">{num}</div>
      <h2 className="text-lg font-light tracking-tight text-slate-200">{title}</h2>
      {subtitle && <span className="text-xs italic text-slate-500">{subtitle}</span>}
    </div>
  );
}
