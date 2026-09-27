# Repository ESLint Batching — 2026-09-26

## Finding

The repository's configured lint command invoked ESLint once for the whole project. In this worktree, a full-tree ESLint process exceeded Node's available memory, while individually batched ESLint runs completed cleanly. Leaving the standard `npm run lint` command on the failing path made the verification gate unreliable.

## Change

- Added `scripts/lint-batched.mjs`, which enumerates TypeScript and TSX files while skipping the configured output folders (`.next`, `dist`) and standard dependency/VCS folders (`node_modules`, `.git`).
- The runner invokes the repository's installed ESLint CLI in sequential batches of eight files, reports progress, and returns immediately with the failing batch's exit status.
- Updated `npm run lint` to use the bounded runner; no lint rules or source suppressions were changed.

## Verification

- `npm run lint` passed across all 214 configured TypeScript targets in 27 batches (210 files under `src/`, four outside `src/`).
- The final batch covered files 209–214. Every batch exited successfully with no lint diagnostics.
- After the lint runner was integrated, the full verification gates also passed: 68 test files / 318 tests, `npx tsc --noEmit`, and `npm run build`. The build reported only the existing stale Browserslist data notice.

This closes the repository-wide lint item only. It does not close the remaining Chapter 2 visual comparison, live interaction, or deployment-parity items.

## Current-worktree recheck — 2026-09-26

After additional tests and Paint/menu files were added, `npm run lint` was rerun against the exact updated worktree. All 216 configured TypeScript/TSX files passed in 27 batches, with no diagnostics. The Chapter 2 gate snapshot is now 69 test files / 323 tests plus TypeScript, repository lint, and production build; visual/live acceptance remains partial.
