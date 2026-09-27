# Chapter 2 — Notepad Caret Status (2026-09-24)

## Delivered

- Replaced the inaccurate total-lines/`Col 1` readout with the caret's actual one-based line and column.
- Added a tested position helper for LF, CRLF, standalone CR, and out-of-range selection offsets.
- Preserved the already enlarged 16px monospace text editor and corrected the checklist's stale 14px description.

## Verification

- Full suite: 50 files / 199 tests passed, including the 3 focused caret tests.
- TypeScript, lint, and production build passed; build emitted the existing stale Browserslist data warning.
- `git diff --check` passed with line-ending normalization warnings only.
- Live pointer/keyboard verification remains open; localhost was not started.
