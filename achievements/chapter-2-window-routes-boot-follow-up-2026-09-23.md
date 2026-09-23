# Chapter 2 — Window Route and Boot Follow-up — 2026-09-23

## Implemented

- Added shared OS-store lifecycle regression coverage for all 25 application IDs rendered by `WindowContent`: open, off-screen move clamping, minimum resize, maximize/restore, minimize/taskbar restore, and close.
- Corrected virtual-path normalization so known Weru filesystem path segments use canonical Windows casing while unknown user-created names preserve their spelling. This fixes the existing `Desktop` path regression and covers `Windows\Media`.
- Started preloading local wallpaper and icon resources before the boot splash and gated normal desktop reveal on the preload promise.
- Changed the boot splash removal timer to the Stitch source's 700ms script timeout and replaced the remaining Microsoft Windows 95 footer with Weru 97 Portfolio Edition branding.

## Files

- `src/features/os/os-store.test.ts`
- `src/features/filesystem/virtual-paths.ts`
- `src/features/filesystem/virtual-paths.test.ts`
- `src/boot/BootSequence97.tsx`
- `src/data/stitch-screen-manifest.ts`
- `plans/weru97-chapter-2-task-list.md`
- `plans/weru97-desktop-stitch-implementation-2026-09-23.md`

## Verification

- TypeScript: passed.
- Full repository lint: passed.
- Vitest: 15 files / 64 tests passed.
- Production build: passed; existing stale Browserslist data notice remains.

## Still open

- The lifecycle test exercises shared store state, not the rendered controls for each application. Live close/drag/resize/touch/keyboard/taskbar verification remains partial.
- The existing browser profile lookup found no open localhost tab. No new browser or tab was opened. Boot stages, preload timing, reduced motion, no-flash behavior, and exact Stitch screenshot parity therefore remain visually/runtime unverified.
- The 12-screen one-by-one parity audit and missing independent Stitch source remain open.
