# Chapter 2 — Notepad Unsaved-Close Guard (2026-09-25)

## Delivered

- Consolidated dirty-state detection into a shared helper used by title-bar and global keyboard close paths.
- Added regression tests that assert the expected descendant selector is used, and that missing/clean content is not treated as dirty.
- Kept the Chapter 2 task marked partial because live edit → close → Cancel/confirm behavior has not been exercised.

## Verification

- Focused window suites: 2 files, 11 tests passed.
- Full Vitest suite: 64 files, 247 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build -- --webpack`: passed; existing stale Browserslist-data warning only.
- `git diff --check`: passed; Git reported its existing LF-to-CRLF normalization notices.
- No localhost server or browser was used.
