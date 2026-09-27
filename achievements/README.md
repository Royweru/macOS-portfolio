# Weru 97 Achievements

This directory records verified implementation history by phase.

Each phase record includes:

- completed tasks;
- files changed;
- Stitch references used;
- behavior delivered;
- tests and build results;
- known deviations and remaining risks.

Recent Chapter 2 audit:

- `chapter-2-notepad-save-as-window-binding-2026-09-27.md` — makes Save As retarget the same Notepad-backed window and verifies supported hosts/Explorer guard; full test, type, lint, and build gates pass while live Save As acceptance remains open.
- `chapter-2-desktop-horizon-full-viewport-audit-2026-09-27.md` — confirms the apparent desktop horizon is present in the Stitch source while live shell/wallpaper geometry fills the viewport; a focused regression was added, and full matched-viewport visual parity remains open.
- `chapter-2-profile-window-policy-2026-09-26.md` — corrects the profile identity and IE X link, applies the Stitch Close-only System Properties titlebar policy including saved-state repair, and records the mailto-vs-server-delivery boundary; focused tests and TypeScript pass while visual parity and direct mail delivery remain open.
- `chapter-2-system-properties-titlebar-monitor-2026-09-26.md` — replaces the generic System Properties titlebar gear with the exact three-rectangle 14px Stitch monitor asset while preserving shared system icons elsewhere; all 329 tests, TypeScript, changed-file lint, and production build pass, while whole-window visual comparison remains partial.
- `chapter-2-boot-css-cascade-cleanup-2026-09-26.md` — removes duplicate base boot declarations while preserving the responsive BIOS override; 69 test files / 324 tests and all current project gates pass. Live stage visuals remain unverified.
- `chapter-2-paint-functional-menus-2026-09-26.md` — implements the Paint File/Edit/View/Image/Options/Help menus and validates all 323 tests, TypeScript, full lint, and production build; live Paint and matched-viewport QA remain open.
- `chapter-2-media-player-escape-dismissal-2026-09-26.md` — fixes Escape dismissal for the Open Media library; the full 319-test suite and production build pass, while live keyboard QA remains open.
- `chapter-2-repository-lint-batching-2026-09-26.md` — updates `npm run lint` to use bounded ESLint child-process batches; the latest recheck passes all 216 configured TypeScript/TSX files, while visual/runtime parity tasks remain open.

- `chapter-2-boot-full-viewport-guard-2026-09-26.md` — adds a source-backed regression guard against the boot overlay reverting to a fixed 1024×768 canvas; matched-stage visual QA remains open.
- `chapter-2-linked-readme-reconciliation-2026-09-26.md` — reconciles generated project README nodes with their manifest-linked Markdown assets, preserves only same-URL caches, and adds regression coverage; live migration verification on a persisted profile remains open.
- `chapter-2-project-explorer-notepad-geometry-2026-09-26.md` — aligns project-folder Explorer and project-file Notepad first-open placement, responsive widths, and instance cascades to raw Stitch CSS; full matched-viewport comparison remains open.
- `chapter-2-external-browser-tab-recheck-2026-09-26.md` — live-checks an IE directory link and a project `live-site.url` in the current worktree; the OS remained open while each destination used a separate Chrome tab. Remaining click paths and deployment parity stay partial.
- `chapter-2-media-player-source-geometry-2026-09-26.md` — aligns the WMP's first-open rectangle and internal rows to the measured Stitch window and verifies the source-positioned window/menu in the existing browser tab; full playback and pixel-parity checks remain open.
- `chapter-2-media-player-source-geometry-2026-09-25.md` — corrects the earlier mistaken 640×520 estimate to the measured 640×396 Stitch bounds and adds a narrow saved-window migration; the original inner layout still overflowed until the 2026-09-26 follow-up.
- `chapter-2-boot-fade-completion-2026-09-25.md` — finishes the full Stitch-authored 800ms splash fade instead of removing it 100ms early; live transition review remains open.
- `chapter-2-media-player-file-menu-2026-09-25.md` — recreates the Stitch File menu, safe direct-media URL input, Player Properties/Exit, and session Favorites; live interaction, playback, and matched-viewport checks remain open.
- `chapter-2-cd-player-menus-2026-09-24.md` — wires the source CD Player menus to tray, Equalizer, playback-mode, and About actions, with keyboard navigation and Escape focus return; live interaction/visual checks remain open.
- `chapter-2-ie4-keyboard-shortcuts-2026-09-24.md` — wires the advertised IE4 menu shortcuts to functional browser commands while preserving input editing shortcuts; live verification remains open.
- `chapter-2-cd-time-modes-2026-09-24.md` — corrects Track Elapsed, Track Remain, and Disc Remain calculations over the selected track and completed playlist history; live audio and visual checks remain open.
- `chapter-2-cd-tray-status-2026-09-24.md` — adds the source-backed CD tray-open/close flow and separate three-pane player status bar; full gates and matched-viewport/audio verification remain tracked separately.
- `chapter-2-cd-player-sibling-windows-2026-09-24.md` — splits the CD Player and Graphic Equalizer into independent Stitch-shaped Weru windows with shared playback/EQ state; automated gates pass, while matched-viewport and audible playback checks remain open.
- `chapter-2-production-build-drift-2026-09-24.md` — confirms the deployed Markdown asset still contains the old URL placeholder; production remains unchanged pending an authorized release and verification.
- `chapter-2-ie4-history-handoff-2026-09-24.md` — adds tested Back/Forward history for external handoffs while keeping destinations outside the Weru browser; live testing remains open.
- `chapter-2-browser-external-tab-handoff-2026-09-24.md` — removes the faux external-page view from simulated IE and leaves remote destinations to a separate browser tab; popup behavior still needs live verification.
- `chapter-2-window-resize-anchor-boundaries-2026-09-24.md` — fixes north/west resize anchoring at desktop boundaries and tests all eight handles; per-app live pointer acceptance remains open.
- `chapter-2-paint-toolbox-and-drawing-2026-09-24.md` — restores Stitch's vertical toolbox and expands core drawing tools; full tool and visual browser acceptance remain open.
- `chapter-2-paint-selection-text-2026-09-24.md` — implements Paint selection/move/clipboard, text placement, proportional image import, connected-region fill, and removes two source-visual mismatches; live interaction and matched-source visual acceptance remain open.
- `chapter-2-paint-scrollbars-zoom-2026-09-24.md` — adds source-shaped operable Paint scrollbars and fixes zoom-out scaling; live pointer/keyboard and matched-viewport checks remain open.
- `chapter-2-paint-dual-color-2026-09-24.md` — adds Paint's foreground/background color wells, left/right palette and canvas behavior, and background-color erasing; pure tests pass, live pointer validation remains open.
- `chapter-2-desktop-shortcut-keyboard-activation-2026-09-24.md` — makes Enter launch the focused desktop shortcut through the normal open-target route; live launch verification remains open.

The current source-of-truth audit is `audit-2026-09-21.md`; it supersedes optimistic ledger entries when a task is only partially implemented.

Latest Chapter 2 evidence:

- `chapter-2-media-player-transport-fidelity-2026-09-24.md` — restores the Stitch-authored 24×24 transport-button geometry with a source-backed CSS regression; whole-screen visual and playback checks remain partial.
- `chapter-2-external-browser-links-2026-09-24.md` — standardizes safe external links across README, project details, IE4, and Contact, with an IE address-bar retry link when popup settings block handoff; automated checks pass, while deployment/popup verification remains open.
- `chapter-2-media-player-close-lifecycle-2026-09-24.md` — pauses the selected media on source change/window close; lifecycle tests pass, live playback/close verification remains open.
- `chapter-2-markdown-default-preview-2026-09-24.md` — opens project Markdown/README files as rendered Notepad previews with safe external links and keeps plain text editable; a current-worktree browser pass opened Adventures README.md in Notepad, while outbound-click and deployment parity remain open.
- `chapter-2-live-external-tab-verification-2026-09-24.md` — confirms a published IE4 link opens an external Chrome tab; direct project `.url`/README behavior remains partial because the deployment is stale and browser cleanup changed tab inventory.
- `chapter-2-notepad-caret-status-2026-09-24.md` — fixes Notepad's inaccurate line/column readout and records the existing 16px readable editor; pure tests and TypeScript pass, live caret verification remains open.
- `chapter-2-media-playback-failure-feedback-2026-09-24.md` — distinguishes media network/decode/codec/policy errors and offers a safe standalone bundled-video fallback; live playback reproduction remains open.
- `chapter-2-explorer-source-geometry-2026-09-24.md` — maps My Computer, Projects, My Documents, primary Explorer, and Notepad to their distinct Stitch source sizes; source-bound tests and all automated gates pass, while matched-viewport visual comparison remains open.
- `chapter-2-explorer-context-menu-classicization-2026-09-24.md` — removes the last modern utility-styled Explorer context/dialog surfaces, replaces generic icons, and adds render regressions; live Stitch screenshot comparison remains open.
- `chapter-2-project-video-assets-audit-2026-09-24.md` — verifies all four configured project demo URLs resolve to actual bundled MP4 files, seed into their own project folders with filenames matching the real assets, and fully decode; a 2026-09-25 current-build browser pass also confirms Gigaclaw play/pause inside Weru Media Player. Remaining project playback and controls stay partial.
- `chapter-2-media-player-satellite-surfaces-2026-09-24.md` — moves Stitch's Compact Player and Codec Notice to the desktop overlay plane, adds bounded compact drag controls, and passes the full automated gates; live visual/pointer acceptance remains open.
- `chapter-2-file-bound-media-asset-resolution-2026-09-25.md` — prevents file-bound Media Player windows from borrowing stale global media during VFS lookup; automated gates pass, while real browser playback remains unverified.
- `chapter-2-desktop-shortcut-source-order-2026-09-25.md` — pins source shortcut order, normalizes Stitch/VFS naming differences, and tests Outlook Express spacing; matched-viewport visual QA remains open.
- `chapter-2-markdown-local-document-links-2026-09-24.md` — routes relative Markdown text-file links through the OS into Notepad while leaving HTTP(S) links in separate browser tabs; automated gates pass, live click verification remains open.
- `chapter-2-persisted-notepad-title-repair-2026-09-24.md` — reconciles saved Notepad window titles with VFS filenames, with deployed-browser confirmation still open.
- `chapter-2-ie4-print-2026-09-24.md` — implements page-only IE4 printing, with native print-preview acceptance still open.
- `chapter-2-ie4-search-favorites-2026-09-24.md` — makes IE4 Search and Favorites useful with safe new-tab destinations; automated gates pass, with live-tab and visual comparison open.
- `chapter-2-recycle-bin-empty-alert-2026-09-24.md` — portals the Stitch alert onto the taskbar-safe desktop layer with safe action gating; live dismissal and matched-viewport checks remain open.
- `chapter-2-screensaver-shortcut-shield-2026-09-24.md` — suppresses manager and focused-window close/minimize shortcuts beneath the active screensaver; shared-policy tests pass, with live Escape verification still open.
- `chapter-2-touch-resize-pointer-safety-2026-09-24.md` — prevented browser touch gestures from cancelling pointer-based resize by applying `touch-action: none` to every handle; live-device touch verification remains open.
- `chapter-2-boot-desktop-transition-2026-09-24.md` — added Stitch-timed taskbar/icon entrance and first-visit welcome timing after boot; reduced-motion bypass and live transition capture remain to verify.
- `chapter-2-ie4-stitch-structure-2026-09-24.md` — restored source IE4 Quick Links, animated globe, authentic-shaped directory/odometer/badges using only real portfolio destinations; matched-viewport and live-tab QA remain open.
- `chapter-2-window-close-policy-2026-09-24.md` — fixed keyboard-close guard bypass and capability-insensitive title context actions; live app matrix remains open.
- `chapter-2-weru-branding-audit-2026-09-24.md` — removed residual active-source naming while preserving the raw Stitch references.
- `chapter-2-boot-skip-transition-2026-09-24.md` — corrected the source-stage-specific skip/fade behavior; live boot-stage comparison remains open.
- `chapter-2-find-dialog-functionality-2026-09-24.md` — added VFS search, accessible selection/open routes, stale-query protection, and empty/error states; live and Stitch checks remain open.
- `chapter-2-run-dialog-routing-2026-09-24.md` — completed tested Run aliases/path/file/HTTP(S) routing and stale-request protection; Run/Find visual and live acceptance remain open.
- `chapter-2-screensaver-motion-2026-09-24.md` — added reduced-motion support and stabilized the canvas lifecycle; live preference and exit verification remain open.
- `chapter-2-media-player-stitch-geometry-2026-09-24.md` — removed duplicated app-size values by deriving the descriptive catalog from active window configs and testing all entries; no visible sizing changed, and matched-size visual QA remains open.
- `chapter-2-media-codec-notice-2026-09-24.md` — made the Media Player codec opt-out persist with storage-safe handling; visual and browser acceptance remain open.
- `chapter-2-shutdown-action-verification-2026-09-24.md` — added regression coverage for Shutdown, Restart, and Log on confirmation routes; live Yes-click and source-comparison checks remain open.
- `chapter-2-external-link-handoff-2026-09-24.md` — removed in-OS external-site iframes, routed web links to safe top-level tabs, and replaced Adventures/MoniePal README URL placeholders; automated checks pass, live popup behavior remains to verify.
- `chapter-2-linked-documents-2026-09-24.md` — moved personal document bodies to linked public text assets and verified VFS seeding, Notepad fetch/cache handling, tests, typecheck, lint, and production build; a current-worktree browser pass confirmed about_me.txt fetches and displays as read-only Notepad content.
- `chapter-2-desktop-single-column-correction-2026-09-23.md` — historical source-order desktop correction; its always-single-column claim was superseded by the 2026-09-23 responsive source-flow audit.
- `chapter-2-desktop-source-flow-and-start-state-2026-09-23.md` — column-first responsive wrapping, source-sized My Documents first-visit window, and honest matched-viewport evidence status.
- `chapter-2-desktop-wallpaper-source-contract-2026-09-24.md` — compares the rendered Bliss clouds, hill paths, gradient stops, and layer geometry against the raw Stitch desktop; matched-viewport screenshot comparison remains open.
- `chapter-2-boot-source-contract-2026-09-24.md` — binds BIOS copy/timing, progress, flag SVG primitives, and key boot geometry to the raw Stitch source; live boot-stage captures and behavior remain open.
- `chapter-2-ie-statusbar-source-fidelity-2026-09-24.md` — moves the IE status row out of page content, restores source toolbar/status proportions, and adds layout contracts; matched-window browser QA remains open.
- `chapter-2-ie4-page-composition-2026-09-26.md` — restores the centered 672px Stitch IE content column, 4px/12px viewport inset, and layered construction banner; source-contract/full-suite/build checks pass, while visual capture and full lint remain open.
- `chapter-2-explorer-control-sample-2026-09-23.md` — live Explorer close, move, resize, minimize, maximize, and restore checks.
- `chapter-2-boot-source-fidelity-2026-09-23.md` — source-timed BIOS sequence, animated memory test, local VT323, DMI status color, and CRT overlay; visual/live verification remains partial.
- `chapter-2-window-keyboard-2026-09-23.md` — Explorer Escape/X/Ctrl+W behavior; saver-specific and all-app checks remain partial.
- `chapter-2-system-properties-source-extraction-2026-09-23.md` — source-shaped monitor/tower art, segmented meters, and a source-pinned 18px titlebar/tab strip; matched-viewport visual comparison remains partial.
- `chapter-2-titlebar-source-geometry-2026-09-25.md` — matches 18px app-window titlebars and Explorer's inactive gradient while retaining 20px desktop/IE/Media Player chrome; source coverage passes, screenshot comparison remains open.
- `chapter-2-window-routes-boot-follow-up-2026-09-23.md` — lifecycle state regression for all 25 routed app IDs, virtual-path casing fix, and source-aligned boot preload/branding; live boot and app parity remain partial.
- `chapter-2-filesystem-path-correction-2026-09-23.md` — fixed shared Explorer location state and moved Videos/Screenshots into their own media libraries with a preserving layout migration; verified in one localhost browser tab.
- `chapter-2-desktop-crt-fidelity-2026-09-23.md` — exact source CRT scanline layer restored above shell content; matched-viewport visual verification remains open.
- `chapter-2-browser-extension-smoke-2026-09-23.md` — existing-tab localhost check confirms full-width shell and System Properties close; persisted-window composition and full per-app controls remain partial.
- `chapter-2-media-playback-controls-2026-09-23.md` — real playlist/control wiring and honest no-media states; actual playback remains unverified because the project media manifest is empty.
- `chapter-2-root-media-outlook-2026-09-23.md` — canonical C: media libraries, separate personal/project media ownership, Outlook Express launch routes, and live browser verification.
- `chapter-2-persisted-picture-repair-2026-09-23.md` — repaired the persisted Pictures reference path, verified the image in Paint, and gated desktop reveal on filesystem readiness.
- `chapter-2-desktop-taskbar-spacing-2026-09-23.md` — fixed the Outlook Express label cell and prevented task buttons from crowding the tray/clock; broader multi-window responsive QA remains partial.
- `chapter-2-shutdown-dialog-2026-09-23.md` — translated the retained Stitch shutdown interior, source-sized its window, and live-tested Help/Cancel; Yes-path and matched-viewport comparison remain open.
- `chapter-2-system-warning-2026-09-23.md` — added the source warning as a movable app window on the Projects shortcut and live-tested Cancel and Yes → `C:\Projects`.
- `chapter-2-media-player-window-controls-2026-09-23.md` — live-tested Media Player close/reopen, taskbar focus, drag, edge/corner resize, minimize/restore, and maximize/restore in the existing tab.
- `chapter-2-outlook-games-overlap-2026-09-23.md` — repaired the persisted Outlook Express/Games desktop shortcut collision with a targeted OS-state migration and verified responsive separation in the existing browser tab.
- `chapter-2-project-video-and-notepad-readability-2026-09-23.md` — corrected bundled project video URLs and persisted VFS sync, browser-verified Gigaclaw playback, and enlarged/fill-sized the Notepad text editor.
- `chapter-2-boot-splash-layout-contract-2026-09-25.md` — aligned splash layout/layering, flag wrapper, and progress transition with the preserved Stitch CSS; rendered boot parity remains partial.
- `chapter-2-outlook-games-position-migration-2026-09-25.md` — adds a v21 repair for already-saved v20 Outlook/Games collisions and pairwise viewport geometry regressions; no new live screenshot was taken.
- `chapter-2-notepad-unsaved-close-guard-2026-09-25.md` — unifies nested dirty-marker detection for window close controls and adds regression coverage; live confirmation behavior remains open.
- `chapter-2-boot-legacy-style-cleanup-2026-09-25.md` — removes dead modern lock-screen and duplicate legacy boot CSS from the active bundle and guards the cleanup with source-contract tests; live boot comparison remains open.
- `chapter-2-public-deployment-parity-audit-2026-09-25.md` — confirms through the Chrome extension that the published app is stale relative to current external-link routing; records local project-video codec evidence without overclaiming playback.
- `chapter-2-notepad-menu-command-parity-2026-09-25.md` — corrects Notepad File/Edit/Search/Help actions and adds guarded clipboard, wrapped search, and focused regressions; live interaction verification remains partial.
- `chapter-2-blocked-browser-handoff-2026-09-25.md` — detects blocked scripted browser tabs, detaches opened pages from Weru, suppresses referrers, and exposes a safe retry link; live popup verification and deployment remain open.
- `chapter-2-media-player-source-route-audit-2026-09-25.md` — re-traces project video routing and refreshes all local gates without claiming playback is fixed; current-build media interaction remains open.
- `chapter-2-legacy-shell-cleanup-2026-09-25.md` — removes disconnected macOS/Aero shell/window adapters and snap compatibility after import audit; all 306 tests, TypeScript, lint, and build pass, while visual/live parity remains open.
- `chapter-2-window-resize-hit-area-2026-09-26.md` — widens the invisible resize targets without changing the visible frame; full tests (325), TypeScript, lint, and build pass, while live per-app resize acceptance remains open.
- `chapter-2-public-deployment-recheck-2026-09-26.md` — confirms the public bundle still has smaller resize handles and an unrendered placeholder README, unlike current source; publication and profile recovery remain explicitly unverified.
