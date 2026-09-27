# Chapter 2 — Title-Bar Control Double-Click Guard (2026-09-26)

- Prevented double-clicks on title-bar buttons from bubbling into the title-area maximize handler.
- Added a source regression; the focused window suite passed (3 files / 43 tests).
- Full suite passed (69 files / 327 tests); TypeScript, targeted ESLint, and production build passed.
- Per-window live close/drag/resize/control verification remains partial.
- Details: [`weru97-titlebar-control-doubleclick-guard-2026-09-26.md`](../plans/weru97-titlebar-control-doubleclick-guard-2026-09-26.md).
