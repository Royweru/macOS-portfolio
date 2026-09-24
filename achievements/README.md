# Weru 97 Achievements

This directory records verified implementation history by phase.

Each phase record includes:

- completed tasks;
- files changed;
- Stitch references used;
- behavior delivered;
- tests and build results;
- known deviations and remaining risks.

The current source-of-truth audit is `audit-2026-09-21.md`; it supersedes optimistic ledger entries when a task is only partially implemented.

Latest Chapter 2 evidence:

- `chapter-2-linked-documents-2026-09-24.md` — moved personal document bodies to linked public text assets and verified VFS seeding, Notepad fetch/cache handling, tests, typecheck, lint, and production build; browser-level display remains unverified with localhost stopped.
- `chapter-2-desktop-single-column-correction-2026-09-23.md` — historical source-order desktop correction; its always-single-column claim was superseded by the 2026-09-23 responsive source-flow audit.
- `chapter-2-desktop-source-flow-and-start-state-2026-09-23.md` — column-first responsive wrapping, source-sized My Documents first-visit window, and honest matched-viewport evidence status.
- `chapter-2-explorer-control-sample-2026-09-23.md` — live Explorer close, move, resize, minimize, maximize, and restore checks.
- `chapter-2-boot-source-fidelity-2026-09-23.md` — source-timed BIOS sequence, animated memory test, local VT323, DMI status color, and CRT overlay; visual/live verification remains partial.
- `chapter-2-window-keyboard-2026-09-23.md` — Explorer Escape/X/Ctrl+W behavior; saver-specific and all-app checks remain partial.
- `chapter-2-system-properties-source-extraction-2026-09-23.md` — source-shaped monitor/tower art and segmented System Properties meters; live visual comparison remains partial.
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
