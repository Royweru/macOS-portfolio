# Chapter 2 — Shared Window Close Policy (2026-09-24)

## Delivered

- Fixed Ctrl/Cmd+W bypassing `canClose` and Notepad's dirty-document confirmation.
- Fixed dirty-state detection to inspect the document editor descendant.
- Routed title-bar close, title context-menu close, and focused-window keyboard close through the same confirmation policy.
- Made context menu and title-bar maximize behavior respect per-window capabilities; centralized Ctrl/Cmd+M and honor `canMinimize`.
- Added focused unit tests and updated the Phase 3 task tracker.
- Added a `Window97` server-render regression matrix for all 27 registered app IDs, asserting close/minimize controls, all eight resize zones, and the two CD-window maximize exceptions.

## Verification

- Focused window-policy and OS-store suites: 2 files, 41 tests passed.
- Current focused `Window97.test.ts`: 30 tests passed, including the per-app rendered-control matrix.
- Full Vitest suite: 29 files, 124 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; existing stale Browserslist-data advisory only.

## Not claimed

- No live window was exercised and no localhost server was started.
- Physical per-application click/drag/resize coverage and live Notepad dirty-confirmation acceptance remain partial; the render matrix does not substitute for that acceptance.

## Current verification refresh (2026-09-25)

- Recounted the active Chapter 2 tracker from file contents: 136 verified, 37 evidence-partial, 0 unchecked. Corrected the stale ledger header.
- Re-ran the complete suite with disk space restored: 65 test files and 285 tests passed.
- Re-ran lint and TypeScript (`tsc --noEmit --incremental false`): both passed.
- Production build is still in progress; no build-pass claim is made until the process exits successfully.
- Restored the formerly empty plan file with the shared policy and test-scope record.
