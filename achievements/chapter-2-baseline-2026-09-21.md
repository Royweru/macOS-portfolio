# Weru 97 Chapter 2 — Baseline and First Runtime Correction

Date: 2026-09-21

## Verified baseline

- Worktree contains the active Next.js Weru 97 shell, local Stitch HTML, plans, and achievement history.
- Ten local Stitch HTML sources are present; the manifest records twelve requested IDs, including derived entries where no independent local artifact exists.
- Active runtime routes through `App.tsx` → `Shell97` → `WindowManager97` → `Window97` and `BootSequence97`.
- `npx tsc --noEmit` passed.
- `npm run lint` passed.
- Initial `npm test -- --run` passed: 5 files, 10 tests; the current suite is 6 files / 13 tests after the geometry coverage was added.
- `npm run build` passed with `/` and `/api/visitors` generated successfully.
- Live browser baseline: `http://localhost:3000/`, viewport 1422×702 CSS pixels, devicePixelRatio 1.35, CSS zoom 1.

## Implemented in this slice

- Added the shared 1024×768 Weru 97 logical geometry contract.
- Replaced browser-viewport window placement with logical desktop placement.
- Added persisted-window rectangle migration and clamping.
- Applied clamping on open, focus, restore, move, resize, and rectangle updates.
- Replaced the black outer shell background with the Bliss wallpaper treatment.
- Enlarged the logical taskbar, Start button, Start logo, and task buttons.
- Added geometry tests for legacy rectangles, minimum sizes, work-area limits, and logical centering.

## Remaining evidence

Browser screenshots and interaction checks are still required for all window types, all viewports, and all Stitch application surfaces. No app-level visual parity is marked complete from this baseline alone.

## Runtime evidence added

- Screensaver was found active from persisted settings and is now exit-able by pointerdown or keyboard input.
- The live browser showed the corrected full-width Bliss desktop with no black side borders and no duplicate stage wallpaper seam.
- Explorer opened at the Stitch-sized logical configuration, moved horizontally and vertically, resized from the southeast handle, maximized, restored, minimized, restored from the taskbar, and closed.
- `skills.txt` opened in Notepad and closed through its title-bar button.
- Start menu opened with the classic vertical Weru 97 banner.
- Run launched Calculator; `7 + 0 = 7` was verified through the live UI; Calculator then closed.
- Local pixel AppIcon assets now render in active title bars instead of configuration emoji when an asset mapping exists.
- Stitch-informed window defaults were tightened for Explorer, Notepad, Internet Explorer, Paint, CD Player, Calculator, and Minesweeper.
- Final gate after this slice: TypeScript passed, lint passed, 6 test files / 13 tests passed, and production build passed.
- These checks verify the shared runtime foundation but do not yet complete the full application-by-application Stitch matrix.

## Record update — final gate and scope discipline

- Re-ran the production build after the shell, geometry, cursor, and app-window corrections; `npm run build` exited 0. The only output requiring maintenance is the non-blocking Browserslist database-age warning.
- Updated the Chapter 2 tracker with the verified gate result and kept all unverified application-by-application items marked partial instead of claiming completion.
- Replaced the active-path lazy-window Framer spinner with a classic stepped Win97 loading indicator so the loading state does not reintroduce rounded modern styling.
- Rebuilt and reloaded the live localhost:3000 runtime after that cleanup; the browser returned to the full Bliss shell with the persisted Explorer visible, and the Start menu still opened with the classic Windows 97 layout.

## Record update — full-width shell correction (2026-09-22)

- Removed the centered 1024×768 visual stage from the active shell. The browser now receives a full-width, full-height Weru 97 shell and edge-to-edge taskbar.
- Increased the taskbar token to 46px, enlarged the Start control and task buttons, and enlarged desktop icon hit areas and labels.
- Replaced the visible Start-menu `Windows 97` banner and BSOD heading with `Weru 97`; the media registry label now reads `Weru Media Player 6.4`.
- Replaced pointer scaling based on stage width with an explicit shell scale so full-width layout does not corrupt drag, resize, or desktop-icon movement math.
- Live localhost verification: full-width Bliss desktop, larger taskbar, spread desktop icons, `Weru 97` Start menu, and Explorer opening/closing controls were visible and usable.
- Validation after the correction: TypeScript passed, lint passed, 6 test files / 13 tests passed, and production build exited 0. The build still reports only the non-blocking stale Browserslist data warning.
- The remaining work is explicit: complete the per-window interaction matrix, compare every available Stitch source, and verify the remaining media, dialog, Paint, and Minesweeper workflows.

## Record update — Chapter 2 parity audit (2026-09-22)

- Audited all 12 Stitch IDs against their local HTML or documented missing-source status; the extraction scope and dimensions are recorded in `plans/weru97-chapter-2-parity-audit-2026-09-22.md`.
- Corrected the persisted shortcut migration so existing visitors receive My Pictures and the shifted Recycle Bin/MS-DOS positions without overwriting custom shortcut locations.
- Live reload now shows the complete desktop shortcut set, and My Pictures opens the classic Paint surface through the central app route.
- Removed the unused legacy `src/components/BootScreen.tsx` adapter; `BootSequence97` is the only imported boot implementation.
- Final validation after the migration fix: TypeScript passed, lint passed, 9 test files / 19 tests passed, and production build passed. The only build notice is the non-blocking stale Browserslist database warning.
- The active Chapter 2 tracker was updated with `[x]` for verified work and `[~]` only where exact visual comparison, missing Stitch source, bundled media, or complete touch/viewport evidence is still required.
