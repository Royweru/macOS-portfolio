# Chapter 2 — Boot Source Fidelity — 2026-09-23

## Implemented

- Re-read the retained `Stitch Designs/html/windows_97_boot_screen.html` as the source of truth.
- Matched BIOS reveal delays: 100ms, 230ms, and then 930–1840ms at 130ms intervals.
- Restored the source memory test: 0K to 65536K in 8192K increments every 60ms, followed by green `OK`.
- Restored white DMI success text and the yellow final boot line with its blinking cursor.
- Added the source full-viewport CRT scanline/RGB raster overlay.
- Matched splash timing: 18 segments at 120ms intervals and the source's 350ms delay before transition.
- Bundled VT323 through `@fontsource/vt323` and imported it locally; production does not request Google Fonts.
- Preserved Weru 97 branding and the source-derived flag SVG. Raw Stitch HTML was not modified.

## Files

- `src/app/layout.tsx`
- `src/boot/BootSequence97.tsx`
- `src/styles/boot.css`
- `package.json` and `package-lock.json`
- `public/assets/win97/boot/README.md`
- `src/data/stitch-screen-manifest.ts`
- `plans/weru97-chapter-2-task-list.md`
- `plans/weru97-desktop-stitch-implementation-2026-09-23.md`

## Verification

- TypeScript: passed.
- ESLint: passed.
- Vitest: 14 files, 35 tests passed.
- Production build: passed; existing stale Browserslist data notice only.
- No live screenshot or post-change browser interaction was captured in this slice. Boot visual parity and updated runtime behavior remain partial pending same-viewport Stitch comparison and live stage verification.
- Desktop parity remains a project acceptance requirement and remains partial pending clean-profile, matched-viewport comparison.

## Follow-up — starting-stage layout fix (2026-09-23, visual confirmation pending)

A live boot review showed “Starting Weru 97...” near the top rather than at Stitch's 45px bottom-left inset. The cause was a stale narrow, column-oriented `.boot97-starting` rule. It has been removed; the active rule now explicitly fills the viewport and anchors the line at the left/bottom inset. TypeScript, ESLint, all 14 test files / 35 tests, and production build passed after this edit. The browser check did not complete, so this is a code correction—not verified visual parity. Keep Phase 10 partial until the position and logo/progress states are captured in the existing localhost tab.

## Follow-up — full-screen overlay stacking correction (2026-09-23)

Source inspection and live computed styles exposed a second boot defect: the outer element used `boot97-bios`/`boot97-starting` as stage modifiers, colliding with the child panel selectors. Those later selectors overrode the root's `position: fixed` and `z-index: 2000` with `position: absolute` and `z-index: 1`. The outer element now uses `boot97-stage-*`, leaving the child selectors scoped to their panels. Added an SSR regression asserting the classes remain distinct. Keep Phase 10 partial until the existing localhost tab confirms full-viewport stacking and the source-timed stages visually.

Implementation follow-up: `npx tsc --noEmit`, `npm run lint`, all 16 test files / 70 tests, and `npm run build` passed after the class fix. I opened one temporary localhost tab for runtime verification, but it had advanced to the desktop by the time the boot-stage selector was available. No live boot visual pass is claimed; the manifest and Phase 10 remain partial.
