# Protection Passport

> "Know what protects you." — a Personal Protection Intelligence Platform for
> Indian households, per `docs/PRD.md`.

Protection Passport consolidates evidence of life, health, accident,
disability, employer/group, bank-linked, card-linked and government/social
protection into one understandable household view — the **Protection
Graph**: person → source → benefit/policy → eligibility → evidence →
nominee → claim route → verification state.

This repository contains the MVP web app (document-first, mock-data-first,
per PRD section 16). It never connects to a real bank, card or Account
Aggregator — see the demo banner in the app itself.

## Repository layout

```
apps/web/     Next.js + TypeScript + Tailwind app (the MVP)
docs/         Product requirements
```

## Running the app

```bash
cd apps/web
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests (evidence/verification logic)
npm run build    # production build
```

## What's implemented

- **Dashboard** — protection-by-category totals, emergency readiness score,
  attention-needed items, recently verified items, Family Protection Matrix.
- **Protection Inventory** — filterable list + detail/evidence view per item.
- **Family** — per-person protection view and nominee readiness.
- **Emergency Mode** — only explicitly authorized info, verified vs.
  potentially-claimable split, access audit log.
- **Documents** — simulated upload flow (nothing leaves the browser),
  document list with processing status.
- **Settings** — consent, family access, retention/deletion, security
  (illustrative controls).
- **Mock API routes** under `apps/web/src/app/api/*` implementing the
  contract in PRD section 8.1, backed by deterministic demo data.

## Evidence & verification model

Every protection item carries one of five verification states — `VERIFIED`,
`USER_CONFIRMED`, `NEEDS_VERIFICATION`, `UNKNOWN`, `NOT_DETECTED` — per PRD
section 6. A transaction, card name or keyword is evidence of a
*possibility*, never automatic proof of coverage. See
`apps/web/src/lib/protection-logic.ts` and its tests.

All data in this build is fictional demo data.
