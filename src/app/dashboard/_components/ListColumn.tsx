"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Star, FileCode, AlertCircle } from "lucide-react";
import type { Artifact } from "@/app/actions/systems-ops";

const CLASS_ACCENT: Record<
  string,
  { bar: string; chip: string; eyebrow: string }
> = {
  cockpit: {
    bar: "bg-cyan-500",
    chip: "bg-cyan-950/60 border-cyan-900/60 text-cyan-300",
    eyebrow: "text-cyan-400",
  },
  system_diagram: {
    bar: "bg-violet-500",
    chip: "bg-violet-950/60 border-violet-900/60 text-violet-300",
    eyebrow: "text-violet-400",
  },
  playbook: {
    bar: "bg-amber-500",
    chip: "bg-amber-950/60 border-amber-900/60 text-amber-300",
    eyebrow: "text-amber-400",
  },
  dashboard: {
    bar: "bg-emerald-500",
    chip: "bg-emerald-950/60 border-emerald-900/60 text-emerald-300",
    eyebrow: "text-emerald-400",
  },
  operator_doc: {
    bar: "bg-rose-500",
    chip: "bg-rose-950/60 border-rose-900/60 text-rose-300",
    eyebrow: "text-rose-400",
  },
};

const FALLBACK_ACCENT = {
  bar: "bg-slate-500",
  chip: "bg-slate-900 border-slate-800 text-slate-300",
  eyebrow: "text-slate-400",
};

export function ListColumn({
  artifacts,
  selectedSlug,
}: {
  artifacts: Artifact[];
  selectedSlug: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const select = useCallback(
    (slug: string) => {
      const next = new URLSearchParams(params.toString());
      next.set("selected", slug);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  if (artifacts.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 text-sm text-slate-400">
        <AlertCircle className="w-4 h-4 text-amber-400" />
        no artifacts match these filters
      </div>
    );
  }

  return (
    <>
      {artifacts.map((a) => {
        const accent = CLASS_ACCENT[a.artifact_class] ?? FALLBACK_ACCENT;
        const isSelected = a.slug === selectedSlug;
        const meta = a.metadata as { candidate_for_canonical?: boolean } | null;
        const isCandidate = meta?.candidate_for_canonical === true;

        return (
          <button
            key={a.slug}
            onClick={() => select(a.slug)}
            className={`w-full text-left rounded-lg p-4 border transition-colors flex gap-3 group ${
              isSelected
                ? "bg-slate-900 border-cyan-700"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className={`w-1 rounded-full ${accent.bar} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <StatusPin
                  isCanonical={a.is_canonical}
                  isCandidate={isCandidate}
                />
                <span
                  className={`text-[10px] font-mono tracking-[0.16em] uppercase ${accent.eyebrow}`}
                >
                  {a.artifact_class}
                </span>
                <span className="text-[10px] font-mono text-slate-600">
                  v{a.version}
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-100 mb-0.5 truncate">
                {a.title}
              </div>
              <div className="text-[11px] font-mono text-slate-500 truncate">
                {a.slug}
              </div>
              {a.description && (
                <div className="text-xs text-slate-400 italic mt-1 line-clamp-2">
                  {a.description}
                </div>
              )}
              {a.surfaces && a.surfaces.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {a.surfaces.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${accent.chip}`}
                    >
                      {s}
                    </span>
                  ))}
                  {a.surfaces.length > 4 && (
                    <span className="text-[10px] font-mono text-slate-500">
                      +{a.surfaces.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </>
  );
}

function StatusPin({
  isCanonical,
  isCandidate,
}: {
  isCanonical: boolean;
  isCandidate: boolean;
}) {
  if (isCanonical) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.14em] text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 rounded px-1.5 py-0.5">
        <Star className="w-2.5 h-2.5" /> canonical
      </span>
    );
  }
  if (isCandidate) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.14em] text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded px-1.5 py-0.5">
        <FileCode className="w-2.5 h-2.5" /> candidate
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.14em] text-amber-300 bg-amber-950/60 border border-amber-800/60 rounded px-1.5 py-0.5">
      <FileCode className="w-2.5 h-2.5" /> draft
    </span>
  );
}
