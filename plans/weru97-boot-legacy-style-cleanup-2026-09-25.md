# Weru 97 — Boot Stylesheet Cleanup (2026-09-25)

## Finding

The active `BootSequence97` path no longer uses the old generic lock-screen UI, but `src/styles/boot.css` still shipped rounded lock-card/avatar styles, backdrop blur, a thin rounded progress bar, and duplicate pre-Stitch boot selectors. These were unreferenced by the current React source and conflicted with the classic boot-only implementation.

## Change

- Remove the retired modern lock-screen/blur and duplicate boot selector rules.
- Retain the classic welcome wizard's `.boot97-welcome-icon` rule because it is still used.
- Add a regression to the raw-Stitch boot source-contract suite asserting retired selectors and modern effects stay absent.

## Verification boundary

The source-contract suite passes (1 file / 7 tests), the full suite passes (64 files / 248 tests), TypeScript and lint pass, `npm run build -- --webpack` passes with the existing stale Browserslist-data advisory, and `git diff --check` passes (Git emits existing LF-to-CRLF normalization notices). This is stylesheet/dead-code cleanup; it does not prove rendered boot timing, preload, skip, or matched-viewport parity. Keep the Phase 10 live acceptance tasks partial until browser evidence exists.
