# Chapter 2 — Linked README Reconciliation — 2026-09-26

- Kept generated project README nodes bound to the `.md` URL in the project manifest during active filesystem reconciliation.
- Prevented older generated inline README content and stale URL caches from overriding the current linked asset; retained a fetched cache only when its URL still matches.
- Added focused regressions in `src/features/filesystem/filesystem-service.test.ts`.
- Verification: 68 test files / 318 tests passed; TypeScript, changed-file ESLint, and production build passed.
- Remaining: live reload verification on an affected persisted profile and full visual/deployment parity remain open. This is not a claim that Chapter 2 is complete.
