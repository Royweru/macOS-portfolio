# Weru 97 Title-Bar Control Double-Click Guard — 2026-09-26

## Finding

`TitleBar95` put the maximize double-click handler on the whole title bar, while the minimize/maximize/close control group stopped only `pointerdown`. A double-click originating on a title-bar button could therefore bubble to the parent and also invoke the title-area maximize gesture.

## Change

The controls group now stops both pointer-down and double-click propagation. Double-clicking the title label still uses the existing maximize/restore callback; individual buttons retain their existing click behavior.

## Verification

- Regression added to `src/wm/TitleBar95-controls97.test.ts` for the control-group double-click guard.
- Focused window suite: 3 files / 43 tests passed.
- Full suite: 69 files / 327 tests passed.
- TypeScript, production build, and direct ESLint on both changed TypeScript files passed. The full 216-file lint suite had passed immediately before this slice.
- No browser session or localhost was used; the per-app live window-control matrix remains partial.

