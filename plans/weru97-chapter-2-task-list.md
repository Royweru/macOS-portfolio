# Weru 97 Chapter 2 — Complete Window, Stitch, and Runtime Fidelity

This is the active execution tracker for the full-window correction and Stitch fidelity pass. Raw Stitch sources remain unchanged under `Stitch Designs/html`. A task is `[x]` only after implementation and verification evidence exist; `[~]` means implemented or partially implemented but still awaiting evidence; `[ ]` means not started. Current ledger: 75 verified tasks, 18 evidence-partial tasks, 0 unchecked tasks (recounted from the checklist on 2026-09-23).

## Phase 0 — Establish the truth

- [x] Record the current worktree and validation baseline.
- [x] Inventory the active Shell97, WindowManager97, Window97, BootSequence97, and application routes.
- [x] Inventory the twelve local Stitch HTML sources and preserve the one remaining manifest entry without an independent file.
- [x] Record browser viewport, zoom, and current visual defects from the live browser session: initial baseline 1422×702 CSS px at localhost:3001; browser-only follow-up 927×597 CSS px at `http://localhost:3000/`, devicePixelRatio 1.5, CSS zoom 1. The app booted and displayed the first-visit wizard; no desktop-wide application inspection was used.
- [x] Create this task list and link it from the main upgrade tracker.
- [x] Add the starting achievement record.

Evidence: `achievements/chapter-2-baseline-2026-09-21.md`; TypeScript, lint, tests, and build all pass at baseline.

## Phase 1 — Desktop canvas

- [x] Keep 1024×768 only as the Stitch source-composition anchor; never render it as a fixed-size browser desktop.
- [x] Create shared taskbar, source-layout, and minimum-window constants, while reading live visible bounds from the browser viewport.
- [x] Place windows at source-authored coordinates where available; keep the full shell, wallpaper, and taskbar at browser width.
- [x] Clamp window rectangles to the actual visible work area so saved windows cannot disappear beneath the taskbar.
- [x] Use Bliss as the outer viewport background so wide screens do not show black side borders.
- [x] Make the shell and taskbar fill the browser viewport; increase taskbar height to 46px, Start button, task buttons, and Start logo sizing.
- [x] Remove the narrow-screen `!important` window geometry override so inline window-manager positioning and resizing remain authoritative at every viewport.
- [~] Re-run wide desktop, laptop, tablet, and narrow comparisons after the full-viewport geometry correction. Earlier shell/taskbar bounds were verified at all four sizes; current viewport-bound window migration and narrow-screen drag/resize need a fresh responsive pass.

Evidence: `src/wm/geometry97.ts`, `src/utils/layout.ts`, `src/styles/shell97.css`, `src/styles/tokens97.css`, and geometry tests.

## Phase 2 — Persisted window repair

- [x] Add `clampWindowRect97()` as the shared rectangle invariant.
- [x] Clamp windows when opened, focused, restored, moved, resized, and updated.
- [x] Migrate legacy persisted rectangles from the fixed-stage schema to the current browser work area (store schema version 12), preserving their offset from Stitch's authored placement.
- [x] Clamp persisted maximize/restore rectangles as well as normal rectangles.
- [x] Re-clamp visible windows when the browser work area changes, without deleting filesystem or profile data.
- [x] Repair an existing off-canvas window when it is focused again.
- [x] Verify deliberately invalid localStorage rectangles through the migration/clamp regression test; the repair is also applied during store rehydration and focus.

## Phase 3 — Common window controls

- [~] Live-verify close on every active application window. A browser-only follow-up at localhost:3000 confirmed plain Escape leaves Explorer open, its title-bar X closes it, and Ctrl+W closes a reopened instance; the per-app acceptance matrix is not complete.
- [x] Keep plain Escape from closing whichever application has focus; retain Ctrl/Cmd+W as the explicit keyboard close shortcut. Verified live in Explorer: Escape preserved the window and Ctrl+W closed it.
- [~] Verify Escape exits the screensaver without closing the underlying focused window. The desktop shortcut handler now ignores keys while the saver is active, but the screensaver-specific live interaction still needs a browser test.
- [~] Live-verify title-bar drag on every active application window. Explorer horizontal and diagonal drags from the clear center of the title bar now move correctly. The misleading earlier test started in the overlapping 10px north-resize strip; that strip is now 6px. The per-app matrix is not complete.
- [~] Live-verify edge and corner resize on every active application window. Explorer east- and north-edge resize both worked after narrowing edge strips; the remaining edges/corners and per-app matrix are still open.
- [~] Live-verify minimize, taskbar restore, maximize, and restore on every active application window. Explorer minimize kept its taskbar button, taskbar restore brought it back, maximize filled the work area above the taskbar, and restore returned its prior rectangle; the full per-app matrix is not complete.
- [x] Preserve event guards for buttons, links, inputs, menus, and resize handles.
- [x] Preserve pointer capture and logical scaling during drag and resize.
- [x] Regression-test the shared open/move-clamp/minimum-resize/maximize-restore/minimize-taskbar-restore/close state lifecycle for all 25 app IDs rendered by `WindowContent` (`src/features/os/os-store.test.ts`). This covers store transitions, not per-app live UI controls.
- [~] Complete the multi-window focus, z-order, keyboard, pointer, touch, and taskbar matrix. Mouse/keyboard and representative z-order evidence exist; a formal touch pass across every app remains.

Required matrix: Explorer, Notepad, IE4, Media Player, CD Player, Paint, Calculator, Minesweeper, MS-DOS, System Properties, Control Panel, Run, Find, Shutdown, Recycle Bin, and project windows.

## Phase 4 — Stitch fidelity contract

- [x] Preserve raw Stitch HTML unchanged.
- [x] Maintain the 12-screen manifest with source, scope, target, and status.
- [x] Complete screen-by-screen extraction notes for desktop, boot, Explorer, Notepad, IE, CD Player, Media Player, Paint, Calculator, Minesweeper, and dialogs. See `plans/weru97-chapter-2-parity-audit-2026-09-22.md`.
- [x] Keep raw HTML out of the production render path.
- [~] Verify dimensions, bevels, typography, spacing, controls, scrollbars, and inactive states against each source. The extracted contract is documented and implemented; final per-source screenshot comparison remains.
- [x] Record missing independent source artifacts without fabricating provenance.
- [x] Verify that alternate Stitch wallpapers and duplicate shell chrome never enter app windows. Extraction notes, scoped CSS, and live IE/CD/Media surfaces confirm app windows do not render a second desktop.

## Phase 5 — Desktop and shell fidelity

- [x] Treat Stitch screen `e05eddbf62974f6484f6b284b8b879ae` as the authoritative complete desktop reference; do not substitute a generic desktop. `BlissWallpaper97` now uses the source's sky gradient, cloud SVG geometry, layered hill paths, colors, and intentional black horizon band; the live shell remains full browser width as requested.
- [~] Match desktop icon order, positions, sizes, labels, selection, and keyboard focus against the supplied desktop source. A fresh source audit corrected the earlier assumption that the source is always one column: Stitch uses column-first vertical flow and wraps according to available height. Weru now uses 40px art with an 80px row pitch; source-to-app screenshot comparison is still open because captures measured 1280×580 (source) and 1421×644 (app), not a matched viewport.
- [x] Preserve Stitch's column-first shortcut flow with responsive wrapping rather than forcing a single column. The 80px pitch preserves the source's 16px row gap while accommodating the requested larger artwork; regression tests verify the seven-row wrap at 596px work-area height and single-column fit at 912px.
- [~] Reproduce the desktop screen's initial My Documents window state for first-time visitors. New clean first-visit sessions now seed the source-authored 560×410 window at (240,60); existing persisted windows are intentionally left untouched. A clean-profile live screenshot remains to be captured.
- [x] Replace remaining generic icons with local pixel assets where a supplied asset exists, including My Pictures and Videos.
- [x] Apply the supplied default, text, hand, busy, move, and resize cursors.
- [x] Match taskbar, Start button, tray, clock, Start menu, and context menus. Live comparison against the supplied Start/context Stitch screen verified the classic menu rows, disabled Paste states, Programs submenu, taskbar controls, and Weru branding; full-width shell and enlarged taskbar remain intentional production adaptations.
- [x] Verify hover, pressed, selected, disabled, and inactive states through the shared classic button/menu/window styles and live Start/desktop states.
- [x] Remove modern rounded cards, glass, and soft shadows from the active classic shell.

## Phase 6 — Explorer and Notepad

- [x] Match Explorer title bar, menus, labeled Back/Forward/Up/Cut/Copy/Paste/Undo toolbar, Address row, tree, file area, views, status bar, and scrollbars. The live My Documents surface was compared against the supplied Stitch Explorer and the filesystem/keyboard behavior remains functional.
- [x] Verify folder navigation, file opening, context menus, keyboard navigation, and central extension routing.
- [x] Verify Explorer windows use independent per-instance paths. A live regression found generic File Explorer inheriting a shared `explorerFolderId`, so it displayed `C:\My Documents` alongside the actual My Documents window. The shared state was removed; localhost QA shows File Explorer at `C:\` and My Documents at `C:\My Documents`. Rechecked after the latest report with a normal reload in the same tab: the root window remained at `C:\`, My Documents contained only its four portfolio text files, and no user storage was cleared. Earlier Projects/My Documents keyed-window checks remain valid.
- [x] Keep personal media libraries separate from My Documents. Layout version 8 moves Videos to `C:\Videos` and Screenshots under `C:\My Pictures`; saved shortcuts migrate to those paths without clearing IndexedDB. Live QA confirmed both addresses, My Documents' four text files, and the existing simulation-icons image remained available in Screenshots.
- [x] Match Notepad title bar, menus, typography, text area, scrollbars, and read-only state. The live `about_me.txt` surface was compared against the supplied Stitch Notepad and retains the read-only, Save As, find, and close behavior.
- [x] Verify editing, dirty state, save, Save As, find, and unsaved-close confirmation.
- [x] Verify Explorer → Notepad → edit → save → reopen.
- [~] Compare the recovered alternate My Documents Stitch variant one-by-one. Live runtime now matches its 560×410 source geometry and authored x/y anchor within a few pixels, with separate menu/toolbar/address rows, one app-owned status strip, and scanlines crossing the window; the duplicate generic footer is removed. The source has six named sample files while the real Weru filesystem has seven different entries, so exact content parity remains partial.

## Phase 7 — Media applications

- [x] Match Internet Explorer chrome, toolbar, address bar, page viewport, and status bar at the implemented Stitch-derived surface.
- [x] Verify home, history, allowed external URLs, `case-study.url`, and visitor fallback.
- [x] Match Media Player display, controls, seek, volume, playlist, and equalizer. The Stitch-derived wireframe viewport, OSD metadata, playlist rows, transport deck, LCD readout, compact player, codec notice, and status bar are live-verified.
- [~] Verify real video playback, reduced motion, and media end states. Reduced-motion handling and explicit media error/end states are implemented; real playback remains unverified because no bundled media asset exists.
- [x] Match CD Player LCD, controls, track list, and equalizer at the implemented Stitch-derived surface.
- [~] Verify functional audio behavior where bundled media exists; no bundled audio asset is currently present, so the empty/media-unavailable path is the only honest verification.

## Phase 8 — Paint, Calculator, and Minesweeper

- [x] Match Paint menus, toolbox, palette, canvas, scrollbars, status, and pixel rendering. The Stitch cyber-engine canvas, metrics, 28-color palette, memo, and status strip are now rendered in React/CSS and live-verified.
- [x] Verify image viewing through Explorer → My Pictures → Screenshots → Paint. The supplied `windows_97_simulation_icons.jpg` reference sheet was opened as a real virtual-filesystem image in the classic Paint surface; after migration it remains reachable at `C:\My Pictures\Screenshots`.
- [x] Verify required Paint drawing behavior. Live QA verified pencil drag, eraser drag, and fill behavior on the supplied image surface; pointer capture prevents hover-only drawing.
- [x] Match Calculator dimensions, display, buttons, and keyboard behavior at the implemented Stitch-derived surface.
- [x] Verify arithmetic, clear, backspace, sign, memory, and divide-by-zero handling. Browser smoke coverage and calculator regression behavior are present.
- [x] Match Minesweeper board and controls at the implemented Stitch-derived surface.
- [x] Verify generation, reveal, flagging, timer, win, loss, reset, and pressed states.

## Phase 9 — System dialogs and secondary apps

- [~] Match System Properties and Control Panel. The System Properties General tab now follows the source composition: an 80px framed monitor/tower drawing, System/Registered to/Computer information, and 21/18-cell segmented resource meters. All four tabs support pointer and arrow/Home/End keyboard navigation; render/logic tests cover the source-derived data and 39 meter cells. The Control Panel remains a functional classic icon grid. This source-shaped update has no fresh live screenshot; final pixel comparison and independent Control Panel source parity remain open.
- [x] Match Run, Find, Shutdown, and Recycle Bin dialogs.
- [x] Match MS-DOS Prompt and authentic output treatment.
- [x] Verify `ver`, `cls`, `crash`, and existing portfolio commands.
- [x] Verify `crash → BSOD → recovery`.
- [x] Verify every dialog's intended close and action buttons.

## Phase 10 — Boot and transitions

- [x] Use BootSequence97 as the active boot path.
- [x] Keep the boot overlay fixed to the full viewport.
- [x] Remove the legacy implementation after import and visual checks; the unused `src/components/BootScreen.tsx` adapter is removed and `BootSequence97` is the only imported boot path.
- [~] Match BIOS, starting, logo, progress, skip, welcome, and desktop transition states. Source-timed BIOS lines, the 8,192K/60ms memory test, DMI success color, CRT raster overlay, local VT323, Weru branding, source flag SVG, 120ms splash segments, and 350ms transition delay are implemented. The starting text is explicitly placed bottom-left at the source's 45px inset. This pass also replaces the source's Microsoft Windows footer with Weru 97 branding and ends the splash after the source's 700ms display timeout. The existing localhost browser reference had no open tab, so no new tab was created and live visual verification remains outstanding.
- [~] Verify preload, reduced motion, and no desktop flash before completion. Boot imagery now starts preloading before the splash and the desktop reveal waits for the local preload promise; code gates pass, but preload/fade/reduced-motion behavior still needs a fresh browser session check.

## Phase 11 — Authenticity cleanup

- [x] Remove modern rounded-card styling and conflicting soft shadows from the classic path. Scoped classic overrides cover active window content and lazy-window states.
- [x] Preserve intentional one- and two-pixel Win97 hard shadows and bevels.
- [x] Remove generic vector replacements where pixel assets exist.
- [x] Standardize classic fonts, cursors, bevels, pressed states, and selection states.
- [x] Confirm no app inherits portfolio-card CSS or a duplicate desktop shell through scoped overrides and source extraction rules. Legacy portfolio/settings routes now resolve to classic Explorer, Notepad, Paint, Contact, MS-DOS, or Control Panel surfaces instead of the modern card-based content path.
- [x] Remove the unreferenced legacy browser and media wrapper modules after replacing the IE4 route with its dedicated implementation; TypeScript, lint, tests, and production build all pass with the active `ie4`, `media-player`, and `cd-player` routes.

## Phase 12 — Final verification and records

- [x] Establish TypeScript, lint, test, and build gates. Latest verified run on 2026-09-23 after the Explorer-state and filesystem-library correction: TypeScript passed, full repository lint passed, 16 test files / 69 tests passed, and production build exited 0. The only build notice is the pre-existing stale Browserslist database warning.
- [x] Add behavior tests for close, minimize, maximize, drag, resize, boot skip, calculator, Minesweeper, routing, and visitor fallback. The suite covers the shared window-state lifecycle for all 25 routed app IDs, boot skip keys, calculator arithmetic/divide-by-zero, Minesweeper generation/adjacency, extension/URL routing, virtual-path canonicalization, and the no-KV visitor fallback; live browser checks cover media-unavailable status and Paint surface interaction.
- [x] Test wide, laptop, tablet, and narrow viewports. Explicit local viewport QA verified shell bounds, taskbar width/height, and document overflow at all four requested sizes.
- [~] Test mouse, pointer, touch, keyboard, reduced motion, and reload persistence.
- [~] Compare every available Stitch source and record intentional differences. The desktop source and live app were re-opened on 2026-09-23, but captures measured 1280×580 and 1421×644 respectively; no matched-viewport or pixel-parity claim is made. One independent ID is still missing, and full-width shell, 46px taskbar, and 40px artwork remain documented user-requested adaptations.
- [x] Update the manifest verification states.
- [x] Update this task list after the verified geometry, shell, persistence, browser-control, IE4, legacy-cleanup, desktop icon-flow, and Explorer resize-hit-area slices; remaining items stay partial until their evidence exists.
- [x] Add dated achievement entries for every completed verified slice. Current additions include the source-flow correction, first-visit desktop composition, Explorer control sample, and boot source-fidelity correction; desktop and boot visual/runtime evidence gaps remain partial.

## Definition of done

Every active window behaves correctly; every major app has a Stitch-matched surface; the desktop fills wide screens without black borders; boot fills the viewport; saved windows remain reachable; modern styling is absent from the classic path; and the task list, manifest, plans, and achievements accurately reflect verified evidence.
