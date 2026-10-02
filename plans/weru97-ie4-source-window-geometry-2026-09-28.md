# Weru 97 IE4 Stitch Window Geometry — 2026-09-28

## Goal

Bring the live IE4 window's initial rectangle into line with the actual retained Stitch wrapper, not only the source's nominal `940×680` maximum. Keep Weru's full-width desktop, taskbar boundary, and shortcut-rail clearance intact.

## Source evidence

The raw IE4 HTML uses an 80px source icon rail (`pl-20`), nested 8px padding on the main and interactive window canvas, and an app window declared `w-[940px] max-w-[98%] h-[680px] max-h-[96%]`. The interactive parent height is `calc(100vh-42px)` with 8px padding. At a 1422×644 CSS viewport, the retained raw HTML was measured previously at approximately **940×563**, position **(281,28)**. The measured height follows the source's content box after the wrapper and padding are applied; the nominal 680px is only the maximum.

## Implementation

- Added `getIe4InitialRect97()` in `src/apps/ie4/ie4-window-geometry97.ts` to derive IE4's initial size and position from the source content gutters and max-height rule.
- Routed IE4 first-open and New Window geometry through the helper while preserving the 940×680 source declaration in `WINDOW_CONFIGS` as the desktop-height maximum.
- Kept new windows to the right of Weru's 240px shortcut rail where the viewport permits, with minimum-size and taskbar clamping handled by the shared geometry invariant.
- Added source-bound tests for the retained wrapper classes, matched-viewport rectangle, narrow viewports, and multiple-window clamping.
- The old persisted IE4 rectangle (`940×598` at `(241,0)`) was not migrated or reset as part of this visual correction.

## Live verification

Reused Chrome extension QA tab `681018304` at `http://localhost:3001/`, CSS viewport 1422×644. Opened one temporary IE4 instance through File → New Window. Its live rectangle measured **940×563** at `(325,35)` after the 44px multiple-window cascade and work-area clamp; without cascade, the source-derived base is `(281,28)`. Closed only that test-created window and confirmed the original persisted `ie4` instance remained the sole IE window. The temporary dev server was stopped after the measurement.

The source-derived outer rectangle is now aligned. This does not establish full page typography, interaction-state, icon, or whole-screen pixel parity; those remain in the Chapter 2 tracker.

## Verification

- Focused: IE4 geometry/source tests plus OS store tests, 3 files / 55 tests passed.
- Full suite: 74 files / 365 tests passed.
- TypeScript: passed.
- Production build: passed; existing stale Browserslist-data warning only.
- Full lint: passed all 228 TypeScript files after removing an unused import.
- `git diff --check`: passed; Git emitted only the repository's existing LF-to-CRLF working-copy notices.
- No saved filesystem or pre-existing window rectangle was reset. Local preview calls used the no-KV in-memory visitor fallback; stopping the dev process discarded those local increments.

## Remaining

Compare complete IE4 page rendering and interactions against the raw source at a matched viewport; verify typed-address and popup fallback, `case-study.url`, visitor behavior, Print preview, and deployed output. Keep the IE4 visual and functionality manifest statuses partial until those gates are satisfied.
