# Chapter 2 — Desktop Column-Flow Parity (2026-09-27)

## Verified implementation

- Reproduced a concrete Stitch mismatch at 1280×576: the live layout placed only six shortcuts in its first column, while the source places seven.
- Changed shortcut flow to the source-paced 72px row pitch and compacted the icon hit cell to 60px, retaining the user's 40px art and full-width desktop/taskbar choices.
- Live comparison after the change confirms the first-column order through Internet, with Games, Recycle Bin, and Outlook Express in column two; no shortcut overlap was visible.
- Matched My Documents against the desktop Stitch screen: its first-open bounds remain approximately (240,60), 560×410.

## Files changed

- `src/shell/desktop-layout97.ts`
- `src/shell/desktop-layout97.test.ts`
- `src/shell/desktop-shortcut-source97.test.ts`
- `src/styles/shell97.css`
- `plans/weru97-chapter-2-task-list.md`
- `plans/weru97-desktop-column-flow-parity-2026-09-27.md`
- `achievements/chapter-2-desktop-column-flow-parity-2026-09-27.md`
- `achievements/README.md`

## Validation

- Focused tests: 2 files / 8 tests passed.
- Full suite: 69 files / 336 tests passed using the bounded single-worker threads pool.
- TypeScript: passed.
- Full repository lint: all 217 TypeScript files passed in 28 batches.
- Production build: passed with the existing stale Browserslist data notice.
- Live source/app comparison: same Chrome extension tab, 1280×576 viewport; raw HTML served read-only from the Stitch HTML directory on loopback.
- Exact icon appearance, selection/focus, and remaining Stitch screens are not yet verified.
