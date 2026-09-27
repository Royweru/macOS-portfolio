# Chapter 2 — Boot Legacy Style Cleanup (2026-09-25)

## Delivered

- Removed unreferenced lock-screen/avatar/glass styling and duplicate legacy boot selectors from the active boot stylesheet.
- Preserved the welcome wizard icon styling that remains in use.
- Added a source-contract regression for the classic-only boot stylesheet.

## Verification

- Focused boot source-contract suite: 1 file, 7 tests passed.
- Full Vitest suite: 64 files, 248 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build -- --webpack`: passed; existing stale Browserslist-data advisory only.
- `git diff --check`: passed; Git emitted its existing LF-to-CRLF normalization notices.
- No local server or browser interaction was used; live boot parity stays partial.
