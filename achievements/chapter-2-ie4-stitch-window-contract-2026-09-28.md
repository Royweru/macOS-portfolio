# Chapter 2 — IE4 Stitch Window Contract — 2026-09-28

## Completed slice

- Added a regression assertion tying `WINDOW_CONFIGS.ie4` title and 940×680 size to the retained IE4 Stitch source.
- Focused IE source-contract tests pass (1 file / 4 tests), as do TypeScript and ESLint for the changed test.
- Full current-worktree gates also pass: 71 test files / 352 tests, TypeScript, lint on 222 TypeScript files, production build, and `git diff --check` (only the existing stale Browserslist-data notice appeared during build).

## Still open

The live matched-viewport comparison and full-screen visual parity remain unverified.
