# Chapter 2 — Desktop CRT Source Fidelity (2026-09-23)

## Source finding

Both available Stitch desktop HTML screens render a full-screen `.crt-overlay` after the taskbar. Its four-pixel repeating gradient has a two-pixel clear interval, a one-pixel transition, and one pixel at four-percent black. It sits above the desktop, app windows, Start menu, and taskbar, while remaining click-through.

The active app previously applied two different subtle scanline pseudo-elements (`.wallpaper-bliss::after` and `.shell97::after`) rather than the source's explicit layer. That made scanline density/opacity inconsistent and tied the treatment to shell/wallpaper styling.

## Changes

- Removed both competing pseudo-element scanline overlays.
- Added one explicit `shell97-crt-overlay` after shell content, with the source gradient and click-through behavior.
- Positioned it above ordinary shell/window/taskbar layers and below the Welcome, screensaver, and BSOD overlays.
- Added SSR coverage that the overlay is present after the taskbar and hidden from assistive technology.
- Updated the Stitch manifest and Chapter 2 tracker. Raw Stitch HTML was not modified.

## Verification

- `npx tsc --noEmit`: passed; `npm run lint`: passed.
- `npm test -- --run`: 17 test files, 76 tests passed, including the new shell overlay SSR contract.
- `npm run build`: passed. Existing stale Browserslist data notice remains.
- Browser extension accessibility tree cannot establish visual scanline appearance. Keep the desktop visual status partial until source and app are captured at the same viewport and compared.
