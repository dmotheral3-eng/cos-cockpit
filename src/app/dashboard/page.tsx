import { Database } from "lucide-react";
import { listArtifacts, type Artifact } from "@/app/actions/systems-ops";
import { ListColumn } from "./_components/ListColumn";
import { DetailPanel } from "./_components/DetailPanel";
import { Filters } from "./_components/Filters";
import { MetricRow } from "./_components/MetricRow";
import { SectionLabel } from "./_components/SectionLabel";

type SearchParams = {
  class?: string;
  status?: string;
  search?: string;
  selected?: string;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [artifacts, all] = await Promise.all([listArtifacts(params), listArtifacts()]);

  const counts = {
    all: all.length,
    canonical: all.filter((a) => a.is_canonical).length,
    draft: all.filter((a) => !a.is_canonical).length,
    candidate: all.filter((a) => isCandidate(a)).length,
  };

  const selected = params.selected
    ? artifacts.find((a) => a.slug === params.selected) ?? null
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <Header />
      <MetricRow counts={counts} />

      <div className="max-w-7xl mx-auto mb-4">
        <SectionLabel
          num="01"
          title="systems_operations"
          subtitle="reads from centripetal-os · 13 artifacts ready to render"
        />
      </div>

      <Filters />

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">
        <div className="col-span-7 space-y-2">
          <ListColumn artifacts={artifacts} selectedSlug={selected?.slug ?? null} />
        </div>
        <div className="col-span-5">
          <DetailPanel artifact={selected} />
        </div>
      </div>

      <PromotionFooter />
      <Footer count={artifacts.length} />
    </div>
  );
}

function isCandidate(a: Artifact): boolean {
  const meta = a.metadata as { candidate_for_canonical?: boolean } | null;
  return meta?.candidate_for_canonical === true;
}

function Header() {
  return (
    <div className="max-w-7xl mx-auto mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs tracking-[0.3em] text-cyan-400 font-mono mb-1">
            CENTRIPETAL // COS COCKPIT
          </div>
          <h1 className="text-3xl font-light tracking-tight">systems_operations review</h1>
          <div className="text-xs text-slate-500 italic mt-1">
            triage drafts → promote canonical → live in atlas
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
          <Database className="w-3 h-3" />
          <span>centripetal-os.public.systems_operations</span>
        </div>
      </div>
    </div>
  );
}

function PromotionFooter() {
  const cards = [
    {
      step: "01",
      title: "click promote",
      body: "Confirm-then-write — single button arms the 3 cross-DB writes.",
      card: "from-emerald-950/40 to-slate-900 border-emerald-900/60",
      eyebrow: "text-emerald-400",
    },
    {
      step: "02",
      title: "3 writes execute",
      body: "UPDATE systems_operations · INSERT jsx_intake · approve pattern.",
      card: "from-cyan-950/40 to-slate-900 border-cyan-900/60",
      eyebrow: "text-cyan-400",
    },
    {
      step: "03",
      title: "audit trail logged",
      body: "Every write recorded in metadata.promotion_audit with operator email.",
      card: "from-violet-950/40 to-slate-900 border-violet-900/60",
      eyebrow: "text-violet-400",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <SectionLabel
        num="02"
        title="how to promote"
        subtitle="three writes, one button — atomic-ish across both Supabase projects"
      />
      <div className="grid grid-cols-3 gap-4 mt-4">
        {cards.map((c) => (
          <div
            key={c.step}
            className={`p-4 rounded-lg bg-gradient-to-br border ${c.card}`}
          >
            <div className={`text-[10px] font-mono tracking-[0.16em] mb-2 ${c.eyebrow}`}>
              STEP {c.step}
            </div>
            <div className="text-sm font-semibold text-slate-200 mb-1">{c.title}</div>
            <div className="text-xs text-slate-400 italic">{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer({ count }: { count: number }) {
  return (
    <div className="max-w-7xl mx-auto mt-6 flex items-center justify-between text-[10px] font-mono text-slate-600">
      <div>centripetal-os · systems_operations · {count} artifacts</div>
      <div>refresh · live from DB</div>
    </div>
  );
}
