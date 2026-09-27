# Chapter 2 — Markdown Opens as a Rendered Preview (2026-09-24)

## Delivered

- Project `.md` files now open in Notepad's rendered Markdown view by default, so README headings and hyperlinks are immediately visible.
- The Source toggle retains access to editable Markdown, and `.txt` documents continue to open as plain text.
- Added server-rendered regressions for the default view and safe external-link attributes.

## Verification

- Focused initial-view/caret tests: 5 passed; full suite: 51 files / 201 tests passed.
- TypeScript, lint, and production build passed; build emitted the existing stale Browserslist warning.
- Published build remains stale, so deployment and live-link parity are still open.

## Readability verification refresh (2026-09-25)

- Confirmed the Markdown preview and editable Notepad textarea both use a 16px baseline; added a CSS source regression so the README/file text cannot silently revert to the former tiny sizing.
- Current full suite passes 65 files / 285 tests; TypeScript, lint, and production build pass. Deployment parity remains open.
