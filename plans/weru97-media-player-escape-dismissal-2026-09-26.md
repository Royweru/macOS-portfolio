# Media Player Escape Dismissal — 2026-09-26

## Finding

The Media Player already dismissed its File/Favorites menus, Open URL dialog, and Properties dialog on Escape, but omitted the Open Media library. The library could only be dismissed with its close or Cancel controls.

## Change

- Escape now dismisses the Open Media library too, using the same keyboard path as the other player overlays.
- A focused regression requires all four dismissal paths to remain present.
- The raw Stitch source and player/window geometry are unchanged.

## Verification and limits

- Focused Media Player suite passes (8 tests); the full suite passes (68 files / 319 tests), TypeScript passes, the changed Media Player files pass ESLint, and the production build passes (existing stale Browserslist data notice only).
- This is a code-level regression check; live keyboard/focus behavior and matched-viewport Stitch comparison remain partial in the Chapter 2 task list.
