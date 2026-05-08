"use client";

import { useState, useTransition } from "react";
import { Star, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { promoteArtifact } from "@/app/actions/promote";

export function PromoteButton({ slug }: { slug: string }) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      try {
        const result = await promoteArtifact(slug);
        if (result.ok) setDone(true);
        else setError(result.error ?? "unknown");
      } catch (e) {
        setError(e instanceof Error ? e.message : "promotion_failed");
      }
    });
  };

  if (done) {
    return (
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="p-3 rounded bg-emerald-950/40 border border-emerald-700/60 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <div className="text-emerald-300 font-semibold">promoted</div>
            <div className="text-emerald-500/80 italic text-[11px] mt-0.5">
              UPDATE systems_operations · INSERT jsx_intake · approve pattern · all 3 writes confirmed
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-800">
      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.14em] mb-2">
        promote to canonical
      </div>
      <button
        onClick={handleClick}
        disabled={pending}
        className={`w-full p-3 rounded font-medium text-sm transition-all flex items-center justify-center gap-2 ${
          confirming
            ? "bg-emerald-900/60 border-2 border-emerald-500 text-emerald-100 hover:bg-emerald-800/70"
            : "bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-700/60 text-emerald-300 hover:border-emerald-500"
        } disabled:opacity-50`}
      >
        {pending ? (
          <>
            <Sparkles className="w-4 h-4 animate-pulse" /> writing...
          </>
        ) : confirming ? (
          <>
            <Sparkles className="w-4 h-4" /> click again — runs 3 cross-DB writes
          </>
        ) : (
          <>
            <Star className="w-4 h-4" /> Make {slug} canonical
          </>
        )}
      </button>
      {confirming && !pending && (
        <button
          onClick={() => setConfirming(false)}
          className="w-full mt-2 text-[10px] font-mono text-slate-500 hover:text-slate-300 py-1"
        >
          cancel
        </button>
      )}
      {error && (
        <div className="mt-2 p-2 rounded bg-rose-950/40 border border-rose-800/50 flex items-center gap-2">
          <AlertCircle className="w-3 h-3 text-rose-400" />
          <span className="text-[11px] text-rose-300 font-mono">{error}</span>
        </div>
      )}
    </div>
  );
}
