# Centripetal OS — code-lane bootloader (stable; zero doctrine lives here)

1) Before ANY action in this repo, read its registry row: project_routing on
   Supabase master ulzyudbqkmjistymlqwg (via MCP when available; otherwise ask
   Dave for the row — never guess coordinates). The row names the canonical
   branch, Bolt workspace, Vercel project, and Supabase refs. A row with NULL
   last_verified_at is INTENDED, not confirmed — verify live before relying
   on it.
2) main is protected and is the single codebase. NEVER push, force-push, or
   commit to main. Every change lands as a branch → PR → Dave reviews →
   squash-merge → Vercel deploys main.
3) The code lane is transport + git mechanics + recovery + headless CI only.
   App features are authored in Bolt (permanently disconnected) and arrive as
   exports — apply them as branches; do not author or redesign app features
   here.
4) No secrets or env VALUES anywhere in the repo — names only. No stack vendor
   names in customer-facing code, comments, or UI copy.
5) If the registry/Supabase is unreachable: stop and tell Dave. Do not operate
   from memory.
