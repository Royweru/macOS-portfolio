# Weru 97 Visual Fidelity and Interaction Task List

> Historical planning record. The active execution ledger is `plans/weru97-chapter-2-task-list.md`, which supersedes this checklist for current status and completion claims.

## Objective

Make the production Weru 97 shell visually and behaviorally faithful to the local Stitch references and the supplied pixel-art reference. The production viewport fills the browser at its actual width and height; Stitch's 1024×768 desktop composition is only a source for authored positions, never a fixed or uniformly scaled runtime frame.

> Supersession note (2026-09-22): the earlier Phase 3 fixed-stage checklist below is historical. The user explicitly rejected a 1024×768 rendered desktop. The active full-viewport requirement and evidence are in `plans/weru97-chapter-2-task-list.md`.

## Execution Rules

- Raw Stitch HTML remains unchanged under `Stitch Designs/html`.
- Stitch is a visual source, not production iframe content.
- Embedded desktop backgrounds are extracted only for the desktop shell; app windows keep their own content.
- Every phase is marked complete only after typecheck, lint, tests/build, and targeted manual verification pass.
- `tasks_list_windows97_upgrade.md`, `plans/`, and `achievements/` are updated after each verified phase.

## Live Checklist Status

`[x]` verified complete · `[~]` partially implemented or awaiting manual/reference verification · `[ ]` not started.

Last synchronized: 2026-09-21 after asset-pipeline, app-surface, Start-menu, CSS-boundary, and browser QA updates.

## Phase 0 — Baseline and Safety

- [x] Record the current worktree and validation baseline.
- [x] Preserve raw Stitch sources and existing migration history.
- [x] Inventory active shell, window, boot, wallpaper, and icon imports.
- [x] Create this execution plan and link it from the implementation plan.
- [x] Add an achievement entry for the visual-fidelity pass.

## Phase 1 — Stitch Source Audit

- [~] Audit all local Stitch screens and classify desktop, window, app, dialog, boot, and duplicate regions. Desktop source is audited; application-by-application audit remains.
- [~] Extract canonical dimensions, colors, bevels, typography, spacing, and interaction states. Desktop values are extracted; remaining screens remain.
- [x] Update the Stitch manifest with source, scope, target component, and verification state.
- [x] Record missing independent Stitch artifacts without fabricating source provenance.

## Phase 2 — Pixel Asset Pipeline

- [x] Create `public/assets/win97/icons`, `cursors`, `wallpaper`, `boot`, and `apps` directories with local bucket documentation.
- [~] Create individual transparent pixel assets from the supplied icon reference. Initial local SVG assets exist; complete reference coverage remains.
- [x] Add desktop, file, application, folder, media, executable, and system icons.
- [x] Add default, busy, text, hand, move, and resize cursor assets with documented hotspots.
- [x] Add an asset manifest and nearest-neighbor rendering rules.
- [~] Replace generic Lucide icons in the classic shell with the local asset map. Core shell mappings exist; unmapped fallback icons remain.

## Phase 3 — Canonical Desktop Canvas

- [x] Introduce a 1024x768 logical desktop stage.
- [x] Scale it uniformly without stretching or changing internal geometry.
- [x] Keep the taskbar inside the logical desktop work area.
- [x] Constrain windows and icons to the logical canvas.
- [~] Add deliberate compact behavior for very small screens. Existing responsive behavior remains under visual review.
- [x] Remove competing viewport sizing rules from the active shell import path.

## Phase 4 — Bliss Wallpaper

- [x] Remove the broken `/assets/wallpaper/bliss.jpg` dependency.
- [x] Recreate the Stitch blue sky, cloud banks, layered green hills, and scanlines locally.
- [~] Keep the wallpaper behind the shell only. Desktop isolation is implemented; all app screens remain to be compared.
- [x] Preload the actual local wallpaper during boot.
- [~] Ensure application windows never inherit or duplicate the desktop wallpaper. Core shell is isolated; full app verification remains.

## Phase 5 — Desktop Icons

- [~] Replace generic vector shell icons with pixel assets. Core desktop mappings are local; fallback coverage remains.
- [x] Add Internet Explorer to the default desktop shortcuts.
- [~] Match Stitch icon order, positions, visual size, label shadows, and selection state. Initial visual match exists; screenshot comparison remains.
- [~] Preserve double-click, right-click, keyboard focus, and drag positioning. Double-click and runtime routing were verified; full keyboard/right-click coverage remains.
- [x] Make coordinates correct under logical-canvas scaling.

## Phase 6 — Taskbar and Start Menu

- [~] Match Stitch's 30px logical taskbar geometry. Logical sizing exists; final screenshot comparison remains.
- [x] Increase the visible physical scale through the canonical canvas.
- [~] Match Start button, task buttons, pressed states, tray, and clock. Focus/minimized task state and retro tray indicators are now wired; exact cross-viewport Stitch comparison remains.
- [x] Match the Stitch Start menu proportions and vertical banner.
- [x] Keep modern search/quick-settings surfaces out of the primary classic shell.

## Phase 7 — Window Interaction Repair

- [x] Make title-bar drag ignore buttons, links, inputs, and resize handles.
- [x] Ensure close, minimize, and maximize events stop propagation correctly.
- [x] Increase resize hit zones to 8–12px and keep them above content.
- [x] Add pointer capture and safe cleanup for drag/resize.
- [x] Constrain movement and resizing to the logical work area.
- [~] Verify multi-window focus, z-order, taskbar restore, and keyboard controls. Central focus/minimize/restore state is wired and single-window close/resize was verified; full multi-window matrix remains.

## Phase 8 — Window Chrome Fidelity

- [~] Match title bars, bevels, controls, menu bars, toolbars, status bars, scrollbars, and inactive states. Shared classic chrome and app-specific treatments are verified; full Stitch comparison remains.
- [~] Remove modern rounded-card styling and conflicting shadows from the classic path. Core shell, Explorer, Notepad, and Recycle Bin overrides are applied; remaining app surfaces and formal visual audit remain.
- [~] Preserve reduced-motion behavior without changing static geometry.

## Phase 9 — Boot and Loading Screen

- [~] Make `BootSequence97` the only active boot implementation. It is the active path; legacy source cleanup remains.
- [x] Remove conflicting legacy boot styles from the active path.
- [x] Force a full fixed viewport overlay with correct z-index and overflow behavior.
- [~] Match BIOS, starting, logo, progress, skip, and transition states to Stitch. Runtime sequence verified; final Stitch comparison remains.
- [x] Ensure no shell flash or disconnected boot shapes appear in the verified runtime path.

## Phase 10 — Stitch Application Extraction

- [~] Match Explorer and Notepad window layouts and preserve filesystem behavior. Classic CSS isolation and Explorer runtime hygiene are verified; final Stitch screenshot extraction remains.
- [~] Match Internet Explorer while retaining navigation and visitor behavior. Functional launch/runtime exists; final Stitch extraction remains.
- [~] Match CD Player and Media Player with real audio/video controls. Functional controls exist; final visual comparison remains.
- [~] Match Paint, Calculator, and Minesweeper with functional interactions. Functional foundations exist; final visual comparison remains.
- [~] Match documented System Properties, Control Panel, Run, Find, and Shutdown dialogs. Shared classic layout and close/open contracts are verified; final Stitch comparison and full manual matrix remain.
- [~] Keep duplicate wallpapers and embedded shell chrome out of app windows. Core shell path is isolated; all app screens remain to be checked.

## Phase 11 — Cursor and Interaction Polish

- [x] Apply local pixel cursors to the shell and applications.
- [x] Use hand, text, busy, move, and resize states consistently.
- [~] Prevent accidental desktop text selection while preserving editor selection.
- [~] Verify cursor rendering under canvas scaling and reduced motion. Runtime shell scale is verified; full cursor matrix remains.

## Phase 12 — CSS and Architecture Cleanup

- [~] Make Win97 token, shell, window, boot, wallpaper, and CRT styles authoritative. Active path is wired; legacy files remain outside the active import path and final dead-file audit remains.
- [x] Remove or isolate unused modern shell imports after reference checks. The active path no longer imports modern tokens, Windows shell, Spotlight, or portfolio-card CSS; retained legacy components are not reachable from classic app routing.
- [x] Ensure every active window uses `WindowManager97` and central OS state.
- [x] Ensure file opening continues through central extension routing.

## Phase 13 — Automated Verification

- [x] Run `npx tsc --noEmit`.
- [x] Run `npm run lint`.
- [x] Run `npm test -- --run`.
- [x] Run `npm run build`.
- [~] Add tests for close, minimize, maximize, drag, resize, boot skip, calculator, Minesweeper, routing, and visitor fallback. Logical geometry and calculator runtime smoke coverage exist; the remaining matrix is pending.
- [~] Confirm there are no missing local asset requests or uncaught browser errors. Root and initial local assets were smoke-tested; complete asset matrix remains.

## Phase 14 — Manual Visual QA

- [~] Compare desktop at 1024x768 against Stitch. Runtime desktop was inspected; formal comparison remains.
- [~] Compare Explorer, Notepad, IE, CD Player, Media Player, Paint, Calculator, Minesweeper, and dialogs. IE was runtime-checked; remaining screens remain.
- [~] Verify wallpaper, icon scale, taskbar scale, boot coverage, cursors, window controls, and resize behavior. Boot, wallpaper, taskbar, close, and resize were verified; cursor/full matrix remains.
- [ ] Test wide desktop, laptop, and narrow mobile viewports.

## Phase 15 — Final History Update

- [~] Mark only verified tasks complete in the live task list. Summary tables are synchronized; this detailed checklist is now synchronized.
- [x] Record phase evidence in `achievements/`.
- [~] Update the Stitch manifest verification states. Existing manifest is present; final visual verification statuses remain.
- [~] Record intentional differences and final validation commands. Initial evidence is recorded; final comparison record remains.

## Definition of Done

The pass is complete only when the Stitch-style desktop, wallpaper, pixel icons, cursors, taskbar, boot screen, window controls, application layouts, and interactions are present and verified by automated and manual checks.
