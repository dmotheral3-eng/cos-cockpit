# COS Cockpit · M4 Component Bundle (pre-baked)

Generated 2026-05-08 from `systems_ops_review.jsx` for Track A acceleration of COS-91.

After Claude Code finishes M1 scaffold, paste these files into the matching paths in the `cos-cockpit` repo. They consume the M3 server actions (also drafted below). Aesthetic: `operator_slate_topology` (P#79) preserved verbatim.

## Environment setup

`.env.local` template (server-only — never commit):

```bash
# centripetal-os Supabase (reads systems_operations)
SUPABASE_COS_URL=https://wyerwszemxnxbzgjoywx.supabase.co
SUPABASE_COS_ANON=<from Supabase project settings>
SUPABASE_COS_SERVICE=<server-only, never client-exposed>

# master OS Supabase (writes jsx_intake + patterns)
SUPABASE_MASTER_URL=https://ulzyudbqkmjistymlqwg.supabase.co
SUPABASE_MASTER_ANON=<from Supabase project settings>
SUPABASE_MASTER_SERVICE=<server-only, never client-exposed>

# Auth callback URL
NEXT_PUBLIC_SITE_URL=http://localhost:3007
```

In Vercel, set all of these as encrypted env vars. `NEXT_PUBLIC_SITE_URL` is the only public one; everything else is server-only per P#22.

## Files

| Path | Purpose |
| --- | --- |
| `src/lib/supabase/cos.ts` | Server + service clients for centripetal-os |
| `src/lib/supabase/master.ts` | `server-only` service client for master OS |
| `src/lib/auth.ts` | session + admin allowlist helpers |
| `src/app/actions/systems-ops.ts` | `listArtifacts` / `getArtifact` server actions |
| `src/app/actions/promote.ts` | M5 cross-DB promote with audit trail |
| `src/app/actions/auth.ts` | `sendMagicLink` / `signOut` server actions (replaces the bundle's client-side Supabase auth call to satisfy the "no client-side Supabase calls" constraint) |
| `src/middleware.ts` | Auth gate for `/dashboard*` and `/admin*` |
| `src/app/login/page.tsx` | Magic-link form, posts to `sendMagicLink` server action |
| `src/app/auth/callback/route.ts` | OAuth/magic-link code exchange |
| `src/app/dashboard/page.tsx` | Server Component entry, calls `listArtifacts` |
| `src/app/dashboard/_components/PromoteButton.tsx` | confirm-then-promote UI |
| `src/app/dashboard/_components/ListColumn.tsx` | left rail artifact cards |
| `src/app/dashboard/_components/DetailPanel.tsx` | sticky right detail + PromoteButton |
| `src/app/dashboard/_components/Filters.tsx` | URL-driven filter pills + search |
| `src/app/dashboard/_components/MetricRow.tsx` | 4-cell metric grid |
| `src/app/dashboard/_components/SectionLabel.tsx` | mono eyebrow + h2 helper |
| `src/app/dashboard/_components/Metric.tsx` | gradient metric cell helper |
| `src/types/cos.ts` | generated types — centripetal-os |
| `src/types/master.ts` | hand-typed slice — master OS write tables |

## Deviations from the spec

1. **Login uses a server action, not `createBrowserClient`.** The original bundle reaches for `createBrowserClient` + `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON`. That contradicts two of the hard constraints ("Server-only secrets — NEVER use NEXT_PUBLIC_*" and "no client-side Supabase calls"), so the form posts to `sendMagicLink` server action which uses `SUPABASE_COS_URL` / `SUPABASE_COS_ANON`.
2. **Next 15 async APIs.** `cookies()`, `headers()`, and route `searchParams` are all `Promise`s in Next 15. Every callsite awaits them.
3. **Master OS types are a hand-crafted slice.** Full generated types are ~940KB; only the two write-target tables are typed.
4. **Origin remote.** Pre-existing `origin` points at the harness auth proxy, not the public GitHub URL — left as-is so push works.
