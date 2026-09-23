# Weru 97 Chapter 2 — Complete Window, Stitch, and Runtime Fidelity

This is the active execution tracker for the full-window correction and Stitch fidelity pass. Raw Stitch sources remain unchanged under `Stitch Designs/html`. A task is `[x]` only after implementation and verification evidence exist; `[~]` means implemented or partially implemented but still awaiting evidence; `[ ]` means not started. Current ledger: **94 verified, 25 evidence-partial, 0 unchecked**, recounted after the source-warning workflow on 2026-09-23. The objective is not complete: partial items still include per-app window-control coverage, real media playback, matched-viewport Stitch comparison, boot/live responsive evidence, and touch/reduced-motion acceptance.

Additional user-directed architecture slice: `plans/weru97-personal-media-and-outlook-architecture-2026-09-23.md` covers canonical root media folders, separated personal/project media manifests, the Explorer root tree, and Outlook Express/IE Mail integration.

## Phase 0 — Establish the truth

- [x] Record the current worktree and validation baseline.
- [x] Inventory the active Shell97, WindowManager97, Window97, BootSequence97, and application routes.
- [x] Inventory the twelve local Stitch HTML sources and preserve the one remaining manifest entry without an independent file.
- [x] Record browser viewport, zoom, and current visual defects from the live browser session: initial baseline 1422×702 CSS px at localhost:3001; browser-only follow-up 927×597 CSS px at `http://localhost:3000/`, devicePixelRatio 1.5, CSS zoom 1. Latest browser-extension-only check reused the existing Chrome tab at `http://localhost:3000/` (1422×644 screenshot pixels); no extra tab or native computer UI was used. The current profile restores several overlapping windows, so it is not clean-profile visual evidence.
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

- [~] Live-verify close on every active application window. Browser-only checks confirmed Explorer X/Ctrl+W, System Properties X, and Media Player X; the latter removed its window from the tree and the app reopened through Start > Programs. The per-app acceptance matrix is not complete.
- [x] Keep plain Escape from closing whichever application has focus; retain Ctrl/Cmd+W as the explicit keyboard close shortcut. Verified live in Explorer: Escape preserved the window and Ctrl+W closed it.
- [~] Verify Escape exits the screensaver without closing the underlying focused window. The desktop shortcut handler now ignores keys while the saver is active, but the screensaver-specific live interaction still needs a browser test.
- [~] Live-verify title-bar drag on every active application window. Explorer horizontal/diagonal drags and Media Player horizontal/vertical title-bar drags moved the expected rectangles; Media Player was returned to its original geometry. The per-app matrix is not complete.
- [~] Live-verify edge and corner resize on every active application window. Explorer east/north edges and Media Player east/north/south edges plus southeast corner changed the measured bounds correctly; west edge, other corners, and the per-app matrix remain open.
- [~] Live-verify minimize, taskbar restore, maximize, and restore on every active application window. Explorer and Media Player both kept taskbar buttons while minimized, restored on click, maximized above the taskbar, and returned to the saved normal rectangle; the full per-app matrix is not complete.
- [x] Preserve event guards for buttons, links, inputs, menus, and resize handles.
- [x] Preserve pointer capture and logical scaling during drag and resize.
- [x] Regression-test the shared open/move-clamp/minimum-resize/maximize-restore/minimize-taskbar-restore/close state lifecycle for all 25 app IDs rendered by `WindowContent` (`src/features/os/os-store.test.ts`). This covers store transitions, not per-app live UI controls.
- [~] Complete the multi-window focus, z-order, keyboard, pointer, touch, and taskbar matrix. The live Media Player taskbar button brought it above CD Player (measured focused z-index 271 vs. 262); a formal touch pass and remaining per-app coverage are open.

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

- [x] Treat Stitch screen `e05eddbf62974f6484f6b284b8b879ae` as the authoritative complete desktop reference; do not substitute a generic desktop. `BlissWallpaper97` uses the source's sky gradient, cloud SVG geometry, layered hill paths, colors, and black horizon gap produced by the source layer heights; the live shell remains full browser width as requested.
- [x] Match the source desktop's full-screen CRT overlay contract. The exact four-pixel scanline gradient now renders once above wallpaper, windows, and taskbar; it is click-through and remains beneath welcome, screensaver, and BSOD layers. SSR verifies it is emitted after shell content; matched-viewport visual comparison remains part of the partial desktop status.
- [~] Match desktop icon order, positions, sizes, labels, selection, and keyboard focus against the supplied desktop source. A fresh source audit corrected the earlier assumption that the source is always one column: Stitch uses column-first vertical flow and wraps according to available height. Weru now uses 40px art with an 80px row pitch. The latest app screenshot is 1422×644; opening the raw local Stitch HTML in the extension for a same-size capture was blocked by its `file://` URL policy, and no workaround was attempted. Source-to-app visual comparison is still open.
- [x] Keep the Outlook Express desktop shortcut and its label clear of neighboring icons. A fresh live DOM measurement at 1422×644 found Games and Outlook Express sharing the same second-column cell because a generated persisted position bypassed responsive flow. OS-state version 20 migrates only that known generated coordinate into the canonical responsive-flow marker, preserving other user-positioned shortcuts; the browser reload and post-fix rectangle comparison are recorded in `achievements/chapter-2-outlook-games-overlap-2026-09-23.md`.
- [x] Preserve Stitch's column-first shortcut flow with responsive wrapping rather than forcing a single column. The 80px pitch preserves the source's 16px row gap while accommodating the requested larger artwork; regression tests verify the seven-row wrap at 596px work-area height and single-column fit at 912px.
- [~] Reproduce the desktop screen's initial My Documents window state for first-time visitors. New clean first-visit sessions now seed the source-authored 560×410 window at (240,60); existing persisted windows are intentionally left untouched. A clean-profile live screenshot remains to be captured.
- [x] Replace remaining generic icons with local pixel assets where a supplied asset exists, including My Pictures and Videos.
- [x] Apply the supplied default, text, hand, busy, move, and resize cursors.
- [x] Match taskbar, Start button, tray, clock, Start menu, and context menus. Live comparison against the supplied Start/context Stitch screen verified the classic menu rows, disabled Paste states, Programs submenu, taskbar controls, and Weru branding; My Computer > Properties opens System Properties and desktop-background Properties opens Control Panel. The latest 1422×644 browser-extension screenshot confirms wallpaper and taskbar span the viewport without black side gutters; persisted windows in this browser profile obscure a clean desktop composition. Full-width shell and enlarged taskbar remain intentional production adaptations.
- [x] Prevent open-window buttons from crowding the system tray or clock. Window buttons now share a bounded, horizontally scrollable strip (48px minimum, 220px maximum); the tray is non-shrinking. At the current 1421×644 view, all four persisted window buttons and the clock remain visible after the change. Dense multi-window and narrow-screen responsive acceptance remains part of the broader matrix.
- [x] Verify hover, pressed, selected, disabled, and inactive states through the shared classic button/menu/window styles and live Start/desktop states.
- [x] Remove modern rounded cards, glass, and soft shadows from the active classic shell.

## Phase 6 — Explorer and Notepad

- [x] Match Explorer title bar, menus, labeled Back/Forward/Up/Cut/Copy/Paste/Undo toolbar, Address row, tree, file area, views, status bar, and scrollbars. The live My Documents surface was compared against the supplied Stitch Explorer and the filesystem/keyboard behavior remains functional.
- [x] Verify folder navigation, file opening, context menus, keyboard navigation, and central extension routing.
- [x] Verify Explorer windows use independent per-instance paths. The latest screenshot exposed a second persistence bug: the saved singleton `explorer` window retained `folder-my-documents` because the open-window path only refocused an existing instance. OS-state version 17 now migrates that legacy instance to the drive root; re-opening it with an explicit location repairs both the saved location and mounted Explorer route. The single Chrome-extension QA tab showed File Explorer at `C:\`, My Documents at `C:\My Documents` with only its four portfolio text files, and independent My Pictures/Videos windows.
- [x] Keep the personal media libraries separate from My Documents. The Chrome-extension tree showed My Documents with only its four portfolio files, Screenshots under `C:\Pictures`, and Videos at `C:\Videos`.
- [~] Verify automatic migration of legacy duplicate `Videos`/`Screenshots` folders on an affected persisted profile. Filesystem layout version 11 moves descendants to canonical root folders, removes only emptied duplicate records, and repairs the protected supplied reference asset; the preservation planner has nested-content regression coverage. The live browser profile had no misplaced legacy duplicates, so that data repair remains unobserved.
- [x] Match Notepad title bar, menus, typography, text area, scrollbars, and read-only state. Fixed the editor wrapper so the textarea fills the window instead of stopping after its content's intrinsic height; enlarged the monospace text from 12px to 14px. Live DOM verification measured a 427px editor wrapper and 389px textarea in the existing 1422×644 browser view; Save As, find, and close behavior remain.
- [x] Verify editing, dirty state, save, Save As, find, and unsaved-close confirmation.
- [x] Verify Explorer → Notepad → edit → save → reopen.
- [~] Compare the recovered alternate My Documents Stitch variant one-by-one. Live runtime now matches its 560×410 source geometry and authored x/y anchor within a few pixels, with separate menu/toolbar/address rows, one app-owned status strip, and scanlines crossing the window; the duplicate generic footer is removed. The source has six named sample files while the real Weru filesystem has seven different entries, so exact content parity remains partial.

## Phase 7 — Media applications

- [x] Match Internet Explorer chrome, toolbar, address bar, page viewport, and status bar at the implemented Stitch-derived surface.
- [x] Verify home, history, allowed external URLs, `case-study.url`, and visitor fallback.
- [~] Match Media Player display, controls, seek, volume, playlist, and equalizer. The Stitch-derived wireframe viewport, OSD metadata, playlist rows, transport deck, LCD readout, compact player, codec notice, and status bar are present and browser-checked, but a matched-viewport source comparison remains outstanding.
- [~] Verify real video playback, reduced motion, and media end states. Fixed project demo URLs to the actual `/media/videos/` public paths and made startup synchronize those sources into existing VFS records without clearing IndexedDB. The live Gigaclaw video loaded metadata (5:07, readyState 4, no media error) and advanced to 00:33 while playing. Reduced-motion playback and the media end state remain open.
- [~] Match CD Player LCD, controls, track list, and equalizer at the implemented Stitch-derived surface. The surface was browser-checked, but matched-viewport comparison against the raw Stitch source remains outstanding.
- [~] Verify functional audio behavior where bundled media exists. Track selection, previous/next, seek, play/pause/stop/eject, volume, repeat, shuffle, intro skip, metadata-driven times, balance, and EQ processing are wired. The browser confirmed the no-disc disabled state and preset/reset UI; no bundled audio exists, so audible processing, actual playback/end states, and reduced-motion playback remain unverified.
- [x] Make CD Player balance, preamp/bass/treble, EQ bypass, presets, and reset functional for same-origin audio using a Web Audio processing graph. Graph parameter/cleanup tests pass; live preset selection and reset updated the visible controls in the existing browser tab. External-source playback remains native/unprocessed for cross-origin safety.

Media playback implementation and evidence: `plans/weru97-media-playback-controls-2026-09-23.md`, `achievements/chapter-2-media-playback-controls-2026-09-23.md`, and `achievements/chapter-2-project-video-and-notepad-readability-2026-09-23.md`. Video playback is now verified for Gigaclaw; visual parity, media end state, reduced motion, and real audio playback remain open.

## Additional architecture — root media libraries and Outlook Express

- [x] Audit the current VFS, media seeding, Explorer tree, desktop shortcuts, IE toolbar, and contact form; record the mismatches in `plans/weru97-personal-media-and-outlook-architecture-2026-09-23.md`.
- [x] Make `C:\Pictures` and `C:\Music` canonical root folders while keeping `C:\Videos`; keep `C:\Windows\Media` distinct. VFS topology tests and the live Explorer root confirm the folders are at C:.
- [x] Preserve existing picture/Screenshots nodes and safely migrate user audio out of the old Windows Media alias; normalize legacy `C:\My Pictures` paths. Tests cover retained IDs/descendants and preserve system/project nodes; no affected legacy duplicate data was present in the live profile.
- [x] Add the separate `PERSONAL_VIDEOS`, `PERSONAL_PICTURES`, and `PERSONAL_MUSIC` manifest arrays and type/path validation. Synthetic fixtures test all three kinds; the real arrays remain empty until files are supplied.
- [x] Seed personal media only into their respective root folders with Media Player, Paint, and CD Player routing. Synthetic fixtures verify each parent folder, media metadata, and app binding; real playback remains partial under Phase 7.
- [x] Seed project-manifest media inside the matching `C:\Projects\<ProjectName>` folders; remove only generated duplicate links and never seed project media into personal folders. Synthetic AfyaTrack manifest coverage verifies the target project folder.
- [x] Update the desktop VFS shortcuts and persisted desktop shortcut targets for Videos, My Pictures → `C:\Pictures`, My Music → `C:\Music`, and Outlook Express. Store migration version 19 plus VFS tests cover targets; live My Music opened `C:\Music`.
- [x] Show My Computer (C:) with Desktop, My Documents, Projects, Videos, Pictures, Music, Program Files, and Windows as direct Explorer-tree children; remove the stale Downloads quick link. Live tree and My Documents inspection confirmed the hierarchy and four document-only children.
- [x] Create/document `public/media/pictures/` and `public/media/music/` while retaining project image/audio compatibility directories. Drop-folder READMEs and validation prefixes document separate ownership.
- [x] Add the Outlook Express desktop shortcut and a local pixel envelope icon. Desktop double-click opened the compose window in the browser.
- [x] Add the IE4 Mail toolbar button and route it to the existing Mail window. Live IE toolbar click opened Outlook Express.
- [x] Restyle Contact97 as an Outlook Express compose window with fixed recipient `weruroy347@gmail.com`, editable Subject, message body, and click-to-compose behavior. Live state showed the required recipient and editable fields; Send was not invoked.
- [x] Test topology, media ownership, legacy migration preservation, shortcut routing, and mail launch/compose behavior. Covered by filesystem/store/path tests plus existing-tab browser checks; no affected legacy duplicate profile was available.
- [x] Run TypeScript, lint, tests, production build, and `git diff --check` after this architecture slice. TypeScript/lint/build passed; all 19 files / 88 tests passed; diff check had no errors.
- [x] Verify the live tree and Mail flow in the existing browser-extension tab without clearing persisted data or opening another tab. Reused one tab, reloaded for OS-state version 19, and closed only temporary test windows.
- [x] Add a dated achievement after the implementation and evidence are complete. See `achievements/chapter-2-root-media-outlook-2026-09-23.md`.

## Phase 8 — Paint, Calculator, and Minesweeper

- [x] Match Paint menus, toolbox, palette, canvas, scrollbars, status, and pixel rendering. The Stitch cyber-engine canvas, metrics, 28-color palette, memo, and status strip are now rendered in React/CSS and live-verified.
- [x] Verify image viewing through Explorer → Pictures → Screenshots → Paint. After the non-destructive layout-version 11 reconciliation, the existing browser profile showed `windows_97_simulation_icons.jpg` at `C:\Pictures\Screenshots`; opening it launched Paint with the supplied image visible. The repair preserves all unrelated user files.
- [x] Verify required Paint drawing behavior. Live QA verified pencil drag, eraser drag, and fill behavior on the supplied image surface; pointer capture prevents hover-only drawing.
- [x] Match Calculator dimensions, display, buttons, and keyboard behavior at the implemented Stitch-derived surface.
- [x] Verify arithmetic, clear, backspace, sign, memory, and divide-by-zero handling. Browser smoke coverage and calculator regression behavior are present.
- [x] Match Minesweeper board and controls at the implemented Stitch-derived surface.
- [x] Verify generation, reveal, flagging, timer, win, loss, reset, and pressed states.

## Phase 9 — System dialogs and secondary apps

- [~] Match System Properties and Control Panel. Live comparison against the retained System Dialogs HTML verified the General tab's 80px framed monitor/tower, System/Registered to/Computer hierarchy, 21/18-cell meters, four tabs, and action buttons. The window now uses source-derived 460×420 centered geometry and My Computer > Properties launches it. All tabs support pointer and arrow/Home/End navigation; render/logic tests cover 39 meter cells. Control Panel remains a functional classic icon grid. Exact matched-viewport comparison, independent Control Panel source parity, and Recycle Bin's separate alert comparison remain open.
- [~] Complete Run and Find visual/behavior acceptance against their documented classic contracts. Existing routes/components are present; this slice did not complete a per-dialog interaction matrix or matched visual comparison.
- [x] Convert the retained Stitch Shutdown dialog interior into the active React app: pixel computer icon, three controlled radio choices with source accelerators, Yes/Cancel/Help, and source-sized 320×240 parent geometry. Component render test and live localhost screenshot confirm the composition; Help and Cancel were clicked successfully in the existing Chrome tab.
- [~] Verify Shutdown Yes behavior and compare the dialog against Stitch at a matched viewport. Restart reloads the local Weru session and shutdown enters a simulated safe-power-off state; neither Yes path was triggered during this browser check.
- [~] Match Recycle Bin and its independent empty-bin confirmation to the retained source. Restore/delete/empty functionality exists, but source-level visual and interaction comparison remains open.
- [x] Implement the retained System Warning as its own movable Weru window and connect it to the Projects desktop shortcut. Live browser testing verified Cancel leaves the desktop unchanged and Yes opens Explorer at `C:\Projects`.
- [x] Match MS-DOS Prompt and authentic output treatment.
- [x] Verify `ver`, `cls`, `crash`, and existing portfolio commands.
- [x] Verify `crash → BSOD → recovery`.
- [~] Verify every dialog's intended close and action buttons. The Shutdown Help and Cancel actions were live-tested in the current slice; the full dialog/action matrix is still incomplete.

## Phase 10 — Boot and transitions

- [x] Use BootSequence97 as the active boot path.
- [x] Keep the boot overlay fixed to the full viewport.
- [x] Remove the legacy implementation after import and visual checks; the unused `src/components/BootScreen.tsx` adapter is removed and `BootSequence97` is the only imported boot path.
- [~] Match BIOS, starting, logo, progress, skip, welcome, and desktop transition states. Source-timed BIOS lines, the 8,192K/60ms memory test, DMI success color, CRT raster overlay, local VT323, Weru branding, source flag SVG, 120ms splash segments, and 350ms transition delay are implemented. The starting text is explicitly placed bottom-left at the source's 45px inset. This pass also replaces the source's Microsoft Windows footer with Weru 97 branding and ends the splash after the source's 700ms display timeout. Fixed a confirmed CSS class collision that had reduced the outer BIOS/starting overlay from fixed z-index 2000 to absolute z-index 1; SSR regression coverage now asserts separate `boot97-stage-*` and child panel classes. In the latest browser-extension check, the initial page exposed the BIOS stage and a full-viewport black boot scene, then reached the desktop; this was not a matched-stage screenshot comparison. Live source comparison remains outstanding.
- [~] Verify preload, reduced motion, and no desktop flash before completion. Boot imagery preloads before the splash and the desktop reveal waits for local asset preload and filesystem bootstrap, preventing persisted Explorer windows from rendering empty while IndexedDB migrates. Reload reached the populated root; dedicated reduced-motion and early-skip browser checks remain outstanding.

## Phase 11 — Authenticity cleanup

- [x] Remove modern rounded-card styling and conflicting soft shadows from the classic path. Scoped classic overrides cover active window content and lazy-window states.
- [x] Preserve intentional one- and two-pixel Win97 hard shadows and bevels.
- [x] Remove generic vector replacements where pixel assets exist.
- [x] Standardize classic fonts, cursors, bevels, pressed states, and selection states.
- [x] Confirm no app inherits portfolio-card CSS or a duplicate desktop shell through scoped overrides and source extraction rules. Legacy portfolio/settings routes now resolve to classic Explorer, Notepad, Paint, Contact, MS-DOS, or Control Panel surfaces instead of the modern card-based content path.
- [x] Remove the unreferenced legacy browser and media wrapper modules after replacing the IE4 route with its dedicated implementation; TypeScript, lint, tests, and production build all pass with the active `ie4`, `media-player`, and `cd-player` routes.

## Phase 12 — Final verification and records

- [x] Establish TypeScript, lint, test, and build gates. Latest verified run on 2026-09-23 after persisted Pictures repair and boot readiness gating: TypeScript passed, full repository lint passed, 19 test files / 88 tests passed, and production build exited 0. The build notice is the existing stale Browserslist database warning.
- [x] Add behavior tests for close, minimize, maximize, drag, resize, boot skip, calculator, Minesweeper, routing, and visitor fallback. The suite covers the shared window-state lifecycle for all 25 routed app IDs, boot skip keys, calculator arithmetic/divide-by-zero, Minesweeper generation/adjacency, extension/URL routing, virtual-path canonicalization, and the no-KV visitor fallback; live browser checks cover media-unavailable status and Paint surface interaction.
- [x] Test wide, laptop, tablet, and narrow viewports. Explicit local viewport QA verified shell bounds, taskbar width/height, and document overflow at all four requested sizes.
- [~] Test mouse, pointer, touch, keyboard, reduced motion, and reload persistence.
- [~] Compare every available Stitch source and record intentional differences. The desktop source and live app were previously captured at 1280×580 and 1421×644; the latest app capture is 1422×644. The extension blocks direct `file://` navigation to the raw local HTML, so no matched-viewport capture was made and no alternate access route was attempted. One independent ID is still missing, and full-width shell, 46px taskbar, and 40px artwork remain documented user-requested adaptations.
- [x] Update the manifest verification states.
- [x] Update this task list after the verified geometry, shell, persistence, browser-control, IE4, legacy-cleanup, desktop icon-flow, and Explorer resize-hit-area slices; remaining items stay partial until their evidence exists.
- [x] Verify the email-icon caption and taskbar/clock spacing in the existing browser-extension tab after the priority polish; no extra browser tab or native computer UI was opened.
- [x] Add dated achievement entries for every completed verified slice. Current additions include the source-flow correction, first-visit desktop composition, Explorer control sample, and boot source-fidelity correction; desktop and boot visual/runtime evidence gaps remain partial.

## Definition of done

Every active window behaves correctly; every major app has a Stitch-matched surface; the desktop fills wide screens without black borders; boot fills the viewport; saved windows remain reachable; modern styling is absent from the classic path; and the task list, manifest, plans, and achievements accurately reflect verified evidence.
