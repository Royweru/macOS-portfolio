# Weru 97 Visual Fidelity Pass — Started

Date: 2026-09-21

## Scope

Started the approved visual-fidelity and interaction correction pass. The pass is based on the local Stitch HTML, the supplied Windows 97 icon/cursor reference, and a canonical 1024x768 logical desktop.

## Initial Findings

- The active shell uses generic Lucide icons instead of dedicated pixel assets.
- The Bliss wallpaper points to a missing local image.
- The default desktop shortcut set does not include Internet Explorer.
- The global stylesheet still imports modern/legacy shell rules that can override Win97 styles.
- The window drag surface can intercept title-bar button pointer events.
- Resize hit zones are too small for reliable interaction.
- The boot stylesheet contains competing legacy rules.

## Execution State

- Phase 0: `[x]` baseline and safety records created; typecheck, lint, tests, and production build pass.
- Phase 1: `[~]` Stitch source and active import audit started; desktop source audited.
- Phase 2: `[~]` initial local pixel icon and cursor assets added.
- Phase 3/4: `[~]` initial Bliss wallpaper, Internet Explorer shortcut, and enlarged shell geometry added; manual visual verification remains.
- Phase 7: `[~]` title-bar control propagation guard and larger resize hit zones added; manual interaction verification remains.
- Canonical canvas: `[x]` 1024x768 stage and scale-aware drag/resize coordinates added; runtime root and local asset smoke checks passed.
- Later phases: `[ ]` pending verification.

## Verification — Initial Slice

- `npx tsc --noEmit` — passed
- `npm run lint` — passed
- `npm test -- --run` — passed, 5 files / 10 tests
- `npm run build` — passed

## Initial Assets Added

- `public/assets/win97/wallpaper/bliss.svg`
- `public/assets/win97/icons/*.svg`
- `public/assets/win97/cursors/*.svg`

## Second Slice

- `Shell97` now owns a centered logical 1024x768 stage.
- Drag and resize hooks convert browser pixel deltas back to logical desktop units.
- Desktop shortcut drag coordinates are adjusted for stage scaling.
- `WindowManager97` clamps movement and resizing to the logical work area above the 30px taskbar.
- Resize edge and corner hit zones are now 10px for reliable pointer targeting.
- Browser QA verified boot completion, full desktop/taskbar visibility, Internet Explorer launch, close-button removal, and southeast resize geometry changes.
- The boot timer dependency bug was fixed so stage transitions no longer restart the whole sequence.
- The old duplicate `.shell97` wrapper was removed from `App.tsx`; `Shell97` now owns the desktop canvas.

## Third Slice — Asset and Surface Convergence

- Added a versioned Win97 asset manifest covering desktop/file/application/system icons, cursor hotspots, wallpaper, and boot/app buckets.
- Verified all 27 manifest-backed local icon, cursor, and wallpaper assets exist under `public/assets/win97`.
- Added the missing local `boot` and `apps` asset buckets with provenance rules; production UI remains React/CSS rather than iframe-rendered HTML.
- Replaced duplicate AppIcon keys with one authoritative local asset map and added file, document, executable, URL, music, video, and system icons.
- Completed the cursor state set: default, pointer, busy, hand, move, and all four resize directions.
- Reworked the Start menu to the Stitch 210px vertical-banner composition and removed the modern search/app-grid surface from the classic shell.
- Upgraded Paint with a period-correct tool grid, palette, zoom controls, and pointer drawing canvas; kept image viewing for real portfolio assets.
- Refined Calculator, Minesweeper, Media Player, and IE surfaces with Stitch-derived dimensions, scanlines, palette/number states, and classic bevel treatments.
- Removed inactive `tokens.css`, `windows-shell.css`, and Spotlight stylesheet imports from the active global CSS path.
- Browser QA confirmed the Bliss desktop, local icon set, taskbar, Start menu proportions, Internet Explorer close behavior, and prior resize behavior.

## Third Slice Verification

- `npx tsc --noEmit` — passed
- `npm run lint` — passed
- `npm test -- --run` — passed, 5 files / 10 tests
- `npm run build` — passed; `/` static route and `/api/visitors` dynamic route generated

## Fourth Slice — Explorer Runtime Hygiene

- Fixed duplicate React keys in Explorer quick access where the intentional Desktop/Documents aliases share one virtual folder ID.
- Deduplicated rendered folder nodes by stable VFS ID so migrated IndexedDB data cannot render duplicate entries.
- Confirmed the refreshed Explorer surface renders the virtual root, local system files, folders, and taskbar state without a new application console error.
- The development overlay may retain historical warnings from the pre-fix hot-reload session; a fresh production build has no corresponding compile/type failure.

## Fourth Slice Verification

- `npx tsc --noEmit` — passed
- `npm run lint` — passed
- `npm test -- --run` — passed, 5 files / 10 tests
- `npm run build` — passed

## Fifth Slice — Classic CSS Boundary

- Removed inactive modern `window.css`, `tokens.css`, `windows-shell.css`, and Spotlight stylesheet imports from the production global style path.
- Routed Ctrl+N through the same central Projects Explorer target used by desktop and Start menu actions, preventing the legacy portfolio-card path from becoming an accidental active shell surface.
- Preserved the legacy source files for historical reference; they are no longer authoritative for the classic runtime.

## Fifth Slice Verification

- `npx tsc --noEmit` — passed
- `npm run lint` — passed
- `npm test -- --run` — passed, 5 files / 10 tests
- `npm run build` — passed
- Runtime smoke: `/` returned 200; local Bliss SVG and Internet Explorer icon returned 200.

## Sixth Slice — Utility Dialog Contracts

- Added a close callback contract from `WindowContent` into Control Panel, System Properties, Run, Find, and Shutdown surfaces.
- Dialog buttons now perform their expected close/open behavior instead of being decorative controls; Run launches the selected app and closes itself, while Cancel/OK/Close routes remove the owning window.
- Kept protected Run commands (`regedit`, `format c:`) non-destructive and visibly denied.

## Sixth Slice Verification

- `npx tsc --noEmit` — passed
- `npm run lint` — passed
- `npm run build` — passed

## Seventh Slice — Taskbar State Fidelity

- Added the Stitch-style taskbar divider and local retro tray indicators.
- Task buttons now receive the focused/minimized state from the central window manager, so active windows are visibly sunken and minimized windows remain restorable from the taskbar.

## Seventh Slice Verification

- `npx tsc --noEmit` — passed
- `npm run lint` — passed
- `npm test -- --run` — passed, 5 files / 10 tests
- `npm run build` — passed

## Evidence

- Boot reached the desktop after the BIOS/starting/logo sequence without looping.
- Desktop showed the Bliss wallpaper, five visible shortcuts including Internet, and the classic taskbar.
- Internet Explorer opened from the Internet desktop shortcut.
- The Close title-bar control removed the Internet Explorer window.
- The southeast resize handle changed the window height while preserving logical canvas bounds.

- Approved execution checklist: `plans/weru97-visual-fidelity-task-list.md`
- Architecture addendum: `implementation_plan_windows_97_upgrade.md`
- Live tracker: `tasks_list_windows97_upgrade.md`
