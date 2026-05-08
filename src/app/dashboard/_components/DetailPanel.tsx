import { Hash, FolderOpen, GitBranch, Layers } from "lucide-react";
import type { Artifact } from "@/app/actions/systems-ops";
import { PromoteButton } from "./PromoteButton";

export function DetailPanel({ artifact }: { artifact: Artifact | null }) {
  if (!artifact) {
    return (
      <div className="sticky top-6 rounded-lg p-6 bg-slate-900/40 border border-dashed border-slate-800 text-center">
        <div className="text-[10px] font-mono tracking-[0.16em] uppercase text-slate-600 mb-2">
          select an artifact
        </div>
        <div className="text-xs text-slate-500 italic">
          click any row in the left column to inspect.
        </div>
      </div>
    );
  }

  const meta = artifact.metadata as
    | {
        source_path?: string;
        candidate_for_canonical?: boolean;
      }
    | null;

  return (
    <div className="sticky top-6 rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 space-y-4">
      <div>
        <div className="text-[10px] font-mono tracking-[0.16em] uppercase text-cyan-400 mb-1">
          {artifact.artifact_class} · v{artifact.version}
        </div>
        <h3 className="text-lg font-semibold text-slate-100 leading-tight">
          {artifact.title}
        </h3>
        <div className="text-[11px] font-mono text-slate-500 mt-1">
          {artifact.slug}
        </div>
      </div>

      {artifact.description && (
        <div className="text-xs text-slate-300 italic leading-relaxed">
          {artifact.description}
        </div>
      )}

      {artifact.surfaces && artifact.surfaces.length > 0 && (
        <Field label="surfaces" icon={<Layers className="w-3 h-3" />}>
          <div className="flex flex-wrap gap-1">
            {artifact.surfaces.map((s) => (
              <span
                key={s}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
              >
                {s}
              </span>
            ))}
          </div>
        </Field>
      )}

      {artifact.principle_anchors && artifact.principle_anchors.length > 0 && (
        <Field label="principle_anchors" icon={<Hash className="w-3 h-3" />}>
          <div className="flex flex-wrap gap-1">
            {artifact.principle_anchors.map((p) => (
              <span
                key={p}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-950/40 border border-violet-900/60 text-violet-300"
              >
                P#{p}
              </span>
            ))}
          </div>
        </Field>
      )}

      {meta?.source_path && (
        <Field label="source_path" icon={<FolderOpen className="w-3 h-3" />}>
          <div className="text-[11px] font-mono text-slate-400 break-all">
            {meta.source_path}
          </div>
        </Field>
      )}

      {artifact.superseded_by_slug && (
        <Field label="superseded_by" icon={<GitBranch className="w-3 h-3" />}>
          <div className="text-[11px] font-mono text-amber-300">
            {artifact.superseded_by_slug}
          </div>
        </Field>
      )}

      {!artifact.is_canonical && <PromoteButton slug={artifact.slug} />}
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.16em] uppercase text-slate-500 mb-1.5">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}
