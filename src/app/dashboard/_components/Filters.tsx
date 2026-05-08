"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

const CLASSES = [
  "all",
  "cockpit",
  "system_diagram",
  "playbook",
  "dashboard",
  "operator_doc",
] as const;
const STATUSES = ["all", "canonical", "draft", "candidate"] as const;

export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const currentClass = params.get("class") ?? "all";
  const currentStatus = params.get("status") ?? "all";
  const currentSearch = params.get("search") ?? "";

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (!v || v === "all" || v === "") next.delete(k);
        else next.set(k, v);
      }
      next.delete("selected");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  return (
    <div className="max-w-7xl mx-auto mb-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-slate-500 mr-1">
          class
        </span>
        {CLASSES.map((c) => (
          <Pill
            key={c}
            label={c}
            active={currentClass === c}
            onClick={() => update({ class: c })}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-slate-500 mr-1">
          status
        </span>
        {STATUSES.map((s) => (
          <Pill
            key={s}
            label={s}
            active={currentStatus === s}
            onClick={() => update({ status: s })}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Search className="w-3 h-3 text-slate-500" />
        <input
          type="search"
          defaultValue={currentSearch}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="search slug or title…"
          className="flex-1 max-w-md bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-700"
        />
      </div>
    </div>
  );
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-[11px] font-mono tracking-[0.08em] border transition-colors ${
        active
          ? "bg-cyan-950/60 border-cyan-700 text-cyan-200"
          : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
      }`}
    >
      {label}
    </button>
  );
}
