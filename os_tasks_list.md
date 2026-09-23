# Weru OS — Execution Task List

This checklist is updated during implementation. A task is marked complete only after the relevant code or verification exists.

## Phase 0 — Baseline and preparation

- [x] Read and analyze `ideation_upgrade.md`.
- [x] Read and analyze the existing Vite/React application.
- [x] Confirm current repository state and preserve existing user changes.
- [x] Identify current architecture, reusable components, and major gaps.
- [x] Decide on Next.js App Router migration.
- [x] Decide on Zustand for OS state.
- [x] Decide on Dexie/IndexedDB for the virtual filesystem.
- [x] Decide on client-first persistence with FastAPI deferred.
- [x] Decide on theatrical but skippable lock/login.
- [x] Decide on desktop-first responsive strategy with mobile fallback.
- [x] Export the implementation plan to `os_implementation_plan.md`.
- [x] Create this execution checklist.
- [x] Normalize project data.
- [x] Fix existing lint error.
- [x] Reconfirm baseline lint and build output before migration.

## Phase 1 — Next.js foundation

- [x] Install Next.js and required runtime dependencies.
- [x] Add Next.js configuration.
- [x] Add `src/app/layout.tsx`.
- [x] Add `src/app/page.tsx`.
- [x] Add `src/app/globals.css`.
- [x] Add the client-only portfolio entrypoint.
- [x] Port existing shell styling imports.
- [x] Keep the existing portfolio windows running through the Next client entrypoint.
- [ ] Port existing portfolio windows fully into the new app registry.
- [x] Port existing assets through the existing `public/` directory.
- [x] Move analytics into the Next.js root layout.
- [x] Replace Vite scripts with Next.js scripts.
- [x] Remove Vite-only configuration.
- [x] Remove Vite-only type declarations.
- [x] Disable Tailwind v3 preflight asset loading because the app owns its reset in `src/styles/base.css` and Next's evaluator virtualizes the package path.
- [x] Verify development server.
- [x] Verify production build.
- [x] Verify lint.

## Phase 2 — OS kernel

- [x] Add Zustand dependency declaration and install it.
- [x] Define OS lifecycle types.
- [x] Define window types.
- [x] Define desktop types.
- [x] Define app registry types.
- [x] Define settings types.
- [x] Define OS command types.
- [x] Create the OS store.
- [ ] Create lifecycle slice.
- [ ] Create window slice.
- [ ] Create desktop slice.
- [ ] Create taskbar slice.
- [ ] Create settings slice.
- [ ] Create search slice.
- [ ] Create notification slice.
- [x] Add persisted-state versioning.
- [x] Add hydration state.
- [ ] Add corrupted-state fallback.
- [ ] Add storage-unavailable fallback.
- [x] Add reduced-motion state.
- [x] Add typed command dispatcher.

## Phase 3 — Window manager

- [x] Refactor the current window frame to controlled geometry.
- [x] Store window position in the OS store.
- [x] Store window size in the OS store.
- [x] Implement focus and z-order.
- [x] Persist window geometry after drag and resize.
- [x] Implement pointer dragging.
- [x] Implement pointer capture.
- [x] Implement resize handles.
- [x] Enforce minimum dimensions.
- [x] Implement viewport clamping.
- [x] Implement minimize.
- [x] Implement restore.
- [x] Implement maximize.
- [ ] Implement double-click title-bar maximize/restore.
- [x] Implement close behavior.
- [x] Preserve previous normal geometry after maximize/snap.
- [x] Create pure snap-zone calculations.
- [x] Implement left-half snap geometry.
- [x] Implement right-half snap geometry.
- [x] Implement top/bottom snap geometry.
- [x] Implement four-corner snap geometry.
- [x] Implement edge/corner snap behavior in the window UI.
- [x] Render snap preview.
- [x] Persist geometry on interaction completion.
- [ ] Add window manager unit tests.

## Phase 4 — Windows desktop shell

- [x] Replace the macOS-style menu bar with a Windows-style taskbar.
- [x] Add Start button.
- [x] Add Search button.
- [x] Add pinned apps.
- [x] Add running-app indicators.
- [x] Add taskbar tooltips.
- [x] Add system tray.
- [x] Add Quick Settings flyout from the tray chevron.
- [x] Add clock/date.
- [x] Add network indicator.
- [x] Add battery indicator.
- [x] Add Start Menu backdrop.
- [x] Add pinned apps section.
- [x] Add recent/recommended section.
- [x] Add Start Menu search.
- [x] Make Start high-opacity and keyboard-dismissible with Escape.
- [ ] Add power menu simulation.
- [ ] Add desktop icon grid.
- [ ] Add desktop shortcut persistence.
- [ ] Add Windows-style desktop context menu.
- [ ] Add taskbar context menu.
- [ ] Add modal/overlay manager.

## Phase 4A — Premium OS visual language and portfolio Explorer

- [x] Audit the rendered shell for leftover macOS/Finder signals.
- [x] Replace traffic-light window controls with Windows-style title-bar controls.
- [x] Replace emoji OS chrome with a consistent Lucide/vector app icon system.
- [x] Establish Fluent-inspired ink, surface, border, shadow, and typography tokens.
- [x] Move desktop shortcuts to a Windows desktop grid treatment.
- [x] Replace the portfolio window's Finder/card hybrid with an Explorer-style workspace.
- [x] Add command bar, breadcrumb, search field, quick access, tag filters, sort menu, and list/grid modes.
- [x] Add project previews that use branded visual treatments instead of generic emoji thumbnails.
- [x] Make project selection and double-click external project launch discoverable.
- [x] Remove unused legacy menu-bar/dock stylesheet imports from the Next entrypoint.
- [x] Exclude generated `.next` output from lint input.
- [x] Verify the settled desktop visually in Chrome after boot/login.
- [x] Add snap preview feedback to complete the window interaction feel.
- [ ] Add a reusable command-bar component for Explorer, Recycle Bin, and future apps.

## Phase 5 — Virtual filesystem

- [x] Add Dexie dependency declaration.
- [x] Add `dexie-react-hooks` dependency declaration.
- [x] Create the database singleton.
- [x] Define database schema version 1.
- [x] Create filesystem node table.
- [x] Create Recycle Bin table.
- [x] Create system metadata table.
- [x] Define filesystem service.
- [x] Implement child listing.
- [x] Implement node lookup.
- [x] Implement folder creation.
- [x] Implement text-file creation.
- [ ] Implement rename.
- [ ] Implement move.
- [ ] Implement copy.
- [x] Implement delete-to-trash transaction.
- [x] Implement restore transaction.
- [ ] Implement empty-trash behavior.
- [ ] Implement properties lookup.
- [x] Seed portfolio directory structure.
- [x] Seed project folders.
- [x] Seed project README files.
- [x] Seed About/Resume files.
- [x] Seed hidden System32 files.
- [x] Add live-query-compatible service methods.
- [x] Seed the filesystem automatically during client startup.
- [x] Delete folders transactionally with their descendants.
- [ ] Add filesystem migration support.
- [ ] Add filesystem error handling.

## Phase 6 — Explorer and Recycle Bin

- [x] Build Explorer shell.
- [x] Add sidebar navigation.
- [x] Add breadcrumb navigation.
- [x] Add grid view.
- [ ] Add list view.
- [x] Add selection state.
- [ ] Add multi-select.
- [x] Add folder navigation.
- [x] Add current-folder search.
- [x] Add double-click open.
- [ ] Add context menus.
- [ ] Add New Folder.
- [ ] Add New Text Document.
- [ ] Add Rename.
- [ ] Add Delete.
- [ ] Add Copy/Cut/Paste.
- [ ] Add Properties dialog.
- [ ] Add keyboard navigation.
- [x] Build Recycle Bin view.
- [x] Add Restore.
- [x] Add Empty Recycle Bin.
- [ ] Add delete confirmation.
- [ ] Add duplicate-name handling.
- [ ] Add restore-conflict handling.

## Phase 2A — Window compositor correctness slice (implemented in `codex/premium-os-v2`)

Each task below records the subsystem, the expected user-visible behavior, the implementation surface, verification, and regression risk. This is the execution ledger for the v2 plan; broader unchecked items remain intentionally queued.

- [x] **Measured work area** — Subsystem: compositor/shell geometry. Behavior: maximize and snap use the current browser viewport and reserve the 58px taskbar work area. Interfaces: `useWorkArea`, `WorkArea`, `Window`. Verification: browser screenshot shows maximized Projects reaches the viewport edges without covering the taskbar. Risk: mobile/tablet taskbar density still needs a dedicated responsive pass.
- [x] **Close lifecycle loop** — Subsystem: window manager bootstrap. Behavior: closing the initial Projects window leaves the desktop clear instead of immediately reopening it. Interfaces: `useWindowManager` seed guard and `useOsStore.getState()`. Verification: close button removed Projects and the taskbar reopened it on demand. Risk: virtual-desktop-specific startup policies are not yet modeled.
- [x] **Title-bar hit testing** — Subsystem: window chrome. Behavior: close/minimize/maximize controls do not begin a drag session and expose stable automation hooks. Interfaces: `Window.tsx`, `data-window-control`, `data-testid`, react-rnd `cancel`. Verification: semantic maximize/restore and coordinate close flows passed in Chrome. Risk: react-rnd remains provisional until pointer-capture replacement is complete.
- [x] **Opaque Start surface** — Subsystem: shell overlays. Behavior: Start content remains readable over dense Explorer windows and the desktop is visibly de-emphasized. Interfaces: `windows-shell.css`, Start backdrop. Verification: Start AX tree exposed all pinned/recommended controls and the visual surface was inspected in Chrome. Risk: a centralized overlay manager is still queued.
- [x] **Quick Settings flyout** — Subsystem: taskbar/tray. Behavior: tray chevron opens a readable flyout with Wi-Fi, Bluetooth, Focus, Night light, brightness, volume, display, accessibility, and settings affordances. Interfaces: `QuickSettings.tsx`, `Taskbar.tsx`, `windows-shell.css`. Verification: flyout opened from the tray, Bluetooth toggled to `Value: 1`, and the flyout closed through the tray control. Risk: settings are currently session-local; durable settings integration is queued.
- [x] **Start keyboard dismissal** — Subsystem: transient shell surfaces. Behavior: Escape closes Start while focus is in its search field. Interfaces: `StartMenu.tsx`. Verification: Chrome keyboard flow removed the Start menu from the accessibility tree. Risk: Escape priority across multiple overlay types still needs the overlay manager.
- [x] **Pointer capture controller** — Subsystem: compositor input. Behavior: drag/resize remains active after leaving the title bar or resize handle. Interfaces: Pointer Events session in `Window.tsx`, `setPointerCapture`, `lostpointercapture`, cancellation handlers, rAF geometry publishing. Verification: Chrome drag moved Projects across the desktop and resize changed the frame using the custom handles. Risk: mobile touch gestures need responsive policy before release.
- [x] **Snap preview** — Subsystem: compositor feedback. Behavior: edge/corner preview is calculated during drag and geometry commits only on pointer-up. Interfaces: `snapPreview` state, `getSnapSlot`, `getSnapRect`, `.window-snap-preview`. Verification: Chrome drag to the left edge committed the expected half-screen layout; preview is pointer-transparent. Risk: corner preview needs a dedicated visual pass.
- [x] **Drag/resize persistence boundary** — Subsystem: durable window geometry. Behavior: live pointer feedback stays local and only final geometry reaches Zustand. Interfaces: `publishLiveRect`, `onMove`, `onResize`, `updateWindowRect`. Verification: drag and resize completed without render-loop errors; lint/typecheck/build passed. Risk: reload persistence still needs automated coverage.

## Phase 0 implementation record

- [x] Created branch `codex/premium-os-v2`.
- [x] Recorded baseline repository commit `8a976bd` before this interaction slice.
- [x] Preserved the existing dirty worktree; no reset, checkout, or broad cleanup was used.
- [x] Verified `npm run lint` and `npx tsc --noEmit` after the compositor/shell changes.
- [x] Verified `npm run build` after the Pointer Events compositor change.
- [x] Verified the development server from `/c/Users/Admin/OneDrive/Desktop/weru_os` with `npm run dev -- --hostname 127.0.0.1 --port 3000`.
- [ ] Add automated Playwright/Vitest commands and a clean-start script.

## Phase 7 — Start Menu and Search

- [x] Create application registry.
- [x] Register system apps.
- [x] Register portfolio apps.
- [x] Register utility apps.
- [ ] Add application search.
- [ ] Add project search.
- [ ] Add filesystem search.
- [ ] Add skills/experience search.
- [ ] Add recent-item search.
- [ ] Add Easter egg search.
- [ ] Add grouped results.
- [ ] Add keyboard navigation.
- [ ] Add search ranking.
- [ ] Add `Ctrl+K`.
- [ ] Add `Cmd+K`.
- [ ] Add taskbar search launch.
- [ ] Add Start Menu search launch.
- [ ] Add app launch from results.
- [ ] Add file launch from results.

## Phase 8 — Portfolio applications

### Notepad

- [ ] Build Notepad app.
- [ ] Open text files from Explorer.
- [ ] Display About Me.txt.
- [ ] Display Resume.txt.
- [ ] Display README files.
- [ ] Support editing.
- [ ] Save edits to IndexedDB.
- [ ] Track unsaved changes.

### Settings

- [ ] Build Settings app.
- [ ] Add personalization section.
- [ ] Add theme selection.
- [ ] Add accent selection.
- [ ] Add wallpaper selection.
- [ ] Add taskbar alignment setting.
- [ ] Add reduced-motion setting.
- [ ] Add startup-sequence setting.
- [ ] Add filesystem reset.
- [ ] Add About Portfolio OS.

### Terminal

- [x] Build the Windows Terminal surface and connect it to the existing controlled window compositor.
- [x] Add quote-aware, non-evaluating command parser.
- [x] Implement `help`, `clear`, `pwd`, `ls`, `dir`, `cd`, `tree`, `cat`, `find`, and `stat`.
- [x] Implement `open`, `mkdir`, `touch`, `rm`, `recycle`, `trash`, and `restore` against the virtual filesystem service.
- [x] Implement portfolio commands: `projects`, `about`, `experience`, `skills`, `contact`, `resume`, `github`, and `hire-weru`.
- [x] Implement OS commands: `apps`, `theme`, `wallpaper`, `settings`, `neofetch`, and `systeminfo` as typed OS effects or safe terminal output.
- [x] Implement Easter eggs: `matrix`, `sudo hire-weru`, `whoami`, `fortune`, `konami`, `secret`, and `exit`.
- [x] Add persistent command history with a bounded localStorage record and corrupt-history recovery.
- [x] Add terminal tabs, tab switching, new-tab, close-tab, output copy, clear output, autocomplete, and history navigation.
- [x] Add terminal keyboard behavior for Enter, Tab, ArrowUp/ArrowDown, Ctrl+L, Ctrl+C, Ctrl+Shift+T, and Ctrl+Shift+W.
- [x] Add Terminal to the central window registry, Start Menu, taskbar, app icon map, and global Spotlight search.
- [x] Keep command handlers isolated from React and host APIs; all filesystem operations route through the Weru OS service.
- [ ] Add a dedicated Notepad/Settings/Photos window surface so every registered app command has a concrete renderer.
- [ ] Add cancellable streamed animation for `matrix` while respecting reduced motion.
- [ ] Add Vitest/component/Playwright terminal coverage.

## Phase 4B — Terminal integration execution ledger

Each item records the subsystem, user-visible behavior, implementation surface, verification, and regression risk.

- [x] **Contracts** — Subsystem: terminal kernel. Behavior: UI and command handlers communicate through `TerminalSession`, `TerminalLine`, `CommandResult`, and `OsCommand` contracts. Interfaces: `src/features/terminal/terminal-types.ts`, `src/features/os/os-types.ts`. Verification: `npx tsc --noEmit`. Risk: future command effects must remain serializable.
- [x] **Parser** — Subsystem: command parsing. Behavior: quoted arguments and escaped characters are preserved; empty input is ignored; command names are normalized. Interfaces: `src/features/terminal/terminal-parser.ts`. Verification: type-check and static review; unit tests remain queued. Risk: shell syntax is intentionally limited and must not grow into host-shell semantics.
- [x] **Virtual filesystem adapter** — Subsystem: sandboxed storage. Behavior: `pwd`, `ls`, `cd`, `tree`, `cat`, `mkdir`, `touch`, `rm`, `trash`, `restore`, `find`, and `stat` operate only on IndexedDB-backed Weru nodes. Interfaces: `src/features/terminal/terminal-commands.ts`, `src/features/filesystem/filesystem-service.ts`. Verification: production build and service-level code path review. Risk: restore conflicts and permanent deletion confirmation remain queued.
- [x] **OS/portfolio effects** — Subsystem: OS orchestration. Behavior: terminal commands emit typed effects for app launch, theme, wallpaper, and focused-window actions; React state is changed only by the app-level effect bridge. Interfaces: `src/features/terminal/terminal-commands.ts`, `src/App.tsx`. Verification: type-check/build. Risk: app IDs that have registry entries but no renderer need to be completed in the application phase.
- [x] **Terminal surface** — Subsystem: UI. Behavior: dark high-contrast terminal with prompt, output roles, tabs, copy, clear, autocomplete, keyboard history, and cancellation. Interfaces: `windows/TerminalContent.tsx`, `src/windows/TerminalContent.tsx`, `src/styles/window.css`. Verification: lint/type-check/build; browser click-flow blocked by unavailable computer-use runtime in this execution. Risk: one legacy window file currently bridges from `src/windows` to the new surface and should be consolidated during cleanup.
- [x] **Shell discovery** — Subsystem: app discovery. Behavior: Terminal is launchable from Start, taskbar, and Spotlight/global search. Interfaces: `src/constants/index.ts`, `src/features/desktop/StartMenu.tsx`, `src/features/desktop/Taskbar.tsx`, `src/components/Spotlight/index.tsx`, `src/components/AppIcon.tsx`. Verification: registry references compile cleanly. Risk: end-to-end click coverage remains queued.
- [x] **Safety boundary** — Subsystem: security. Behavior: no `eval`, process spawning, arbitrary network, host filesystem, environment, cookie, or secret access is present in the command subsystem; paths resolve only through the virtual filesystem. Interfaces: command registry and filesystem service. Verification: source audit plus build. Risk: future commands must be reviewed against the same boundary.
- [x] **Quality gates** — Subsystem: release verification. Behavior: repository remains buildable after terminal integration. Verification: `npm run lint`, `npx tsc --noEmit`, `npm run build`, and dev `GET /` on `127.0.0.1:3000` all pass. Risk: automated interaction tests are not yet configured.

### Photos

- [ ] Build Photos app.
- [ ] Add project gallery.
- [ ] Add image detail view.
- [ ] Add zoom.
- [ ] Add previous/next navigation.
- [ ] Add project metadata.
- [ ] Add external links.

### Mail

- [ ] Port contact form.
- [ ] Add validation.
- [ ] Add loading state.
- [ ] Add simulated local success.
- [ ] Add error state.
- [ ] Add replaceable contact gateway.

### Browser

- [ ] Build lightweight browser shell.
- [ ] Add address bar.
- [ ] Add curated bookmarks.
- [ ] Add project links.
- [ ] Open external pages safely.

## Phase 9 — Themes and visual fidelity

- [ ] Define Windows 11 design tokens.
- [ ] Define acrylic surfaces.
- [ ] Define Mica-style surfaces.
- [ ] Define elevation levels.
- [ ] Define radius scale.
- [ ] Define typography scale.
- [ ] Add Bloom Light theme.
- [ ] Add Bloom Dark theme.
- [ ] Add Developer Night theme.
- [ ] Add Kenyan Sunrise theme.
- [ ] Add Terminal Green theme.
- [ ] Add wallpaper registry.
- [ ] Add time-of-day overlays.
- [ ] Persist theme choice.
- [ ] Persist wallpaper choice.
- [ ] Add reduced-motion styling.
- [ ] Add desktop/tablet responsive behavior.
- [ ] Add mobile fallback.

## Phase 10 — System behavior and Easter eggs

- [x] Add lock screen.
- [x] Add skippable login screen.
- [x] Add welcome animation.
- [ ] Add sleep simulation.
- [ ] Add restart simulation.
- [ ] Add shutdown simulation.
- [ ] Add notification center.
- [ ] Add dismissible notifications.
- [ ] Add quick settings.
- [ ] Add Wi-Fi visual toggle.
- [ ] Add Bluetooth visual toggle.
- [ ] Add brightness control.
- [ ] Add volume control.
- [x] Add `System32/README.txt` Easter egg.
- [ ] Add `matrix` command.
- [ ] Add `hire-weru` command.
- [ ] Add hidden project metadata.
- [ ] Add Konami-code unlock.
- [ ] Add secret theme.
- [ ] Add harmless blue-screen visual mode.

## Phase 11 — Keyboard, accessibility, and performance

- [ ] Add global shortcut dispatcher.
- [ ] Add Alt+Tab behavior.
- [ ] Add Explorer keyboard navigation.
- [ ] Add Search keyboard navigation.
- [x] Ignore shortcuts while typing.
- [ ] Add focus rings.
- [ ] Add ARIA labels.
- [ ] Add dialog roles.
- [ ] Add screen-reader labels.
- [ ] Respect `prefers-reduced-motion`.
- [ ] Avoid full-shell rerenders during drag.
- [ ] Persist only at interaction completion.
- [ ] Lazy-load applications.
- [ ] Profile eight simultaneous windows.
- [ ] Test browser zoom.
- [ ] Test storage-disabled behavior.

## Phase 12 — FastAPI seam

- [ ] Define TypeScript repository interfaces.
- [ ] Define future Pydantic-compatible schemas.
- [ ] Define future content endpoints.
- [ ] Define future contact endpoint.
- [ ] Define future analytics endpoint.
- [ ] Define future sync endpoint.
- [ ] Document CORS requirements.
- [ ] Document deployment topology.
- [ ] Keep local implementations behind interfaces.

## Phase 13 — Verification

- [ ] Add Vitest configuration.
- [ ] Add store unit tests.
- [ ] Add snap engine tests.
- [ ] Add filesystem service tests.
- [ ] Add search tests.
- [ ] Add command parser tests.
- [ ] Add Playwright configuration.
- [ ] Test boot and desktop entry.
- [ ] Test opening applications.
- [ ] Test dragging and resizing.
- [ ] Test snapping.
- [ ] Test minimize/restore.
- [ ] Test reload persistence.
- [ ] Test filesystem persistence.
- [ ] Test delete/restore.
- [ ] Test search.
- [ ] Test themes/wallpapers.
- [ ] Test keyboard shortcuts.
- [ ] Test mobile fallback.
- [ ] Add visual snapshots.
- [x] Run lint.
- [x] Run type-check.
- [x] Run production build.
- [ ] Run unit tests.
- [ ] Run Playwright smoke tests.

## Current execution status

- Current phase: Phase 4B — Terminal integration core complete; application-depth and automated coverage remain queued
- Last completed task: Added the sandboxed Windows Terminal subsystem, connected command effects to the OS shell, and passed lint, type-check, production build, and local HTTP startup verification.
- Next task: Add concrete Notepad/Settings/Photos renderers, then add terminal unit/component/Playwright coverage and consolidate the temporary window-file bridge.
- Blocking issue: None for the reported launch error.
- Verification: Dev `GET /` returns 200; `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass. Browser click-flow verification was blocked because the computer-use runtime failed to load its kernel assets.
- Backend status: Deliberately deferred
- Existing user changes: Preserved

## Revised plan — interaction correctness and premium OS architecture

This section is the live execution plan. Completed items below are linked to the implementation ledger above; remaining items stay queued and are not represented as finished merely because the shell looks correct.

### P0 — Interaction correctness audit

- [ ] Add deterministic browser smoke coverage for boot → desktop → click → keyboard → reload.
- [ ] Verify the pointer is a real browser pointer, remains visible over every shell layer, and that pointer movement drives the intended wallpaper/cursor affordances.
- [x] Verify close works from title-bar X and taskbar reopen.
- [ ] Verify minimize removes a window from the work area but keeps it restorable from the taskbar.
- [x] Verify maximize fills the application viewport from `(0, 0)` to the work-area bottom, with no legacy 28px top offset.
- [ ] Verify restore returns the exact pre-maximize rectangle.
- [ ] Verify Start, Search, context menus, quick settings, and windows do not create invisible hit-test layers over one another.
- [ ] Add temporary interaction diagnostics in development builds: focused window id, z-order, pointer capture state, and active overlay.
- [ ] Remove diagnostics or gate them behind a development-only flag before release.

### P1 — Replace fragile window interaction plumbing

- [ ] Make every `WindowInstance.id` the source of truth in rendering and event dispatch; do not use app ids as window ids.
- [x] Define an explicit work-area measurement contract for viewport dimensions and taskbar inset.
- [x] Replace hard-coded maximize geometry with measured work-area geometry.
- [x] Add a window interaction controller based on Pointer Events and `setPointerCapture()` for drag and resize.
- [x] Use `requestAnimationFrame` for live geometry updates and commit the final rectangle to Zustand on pointer-up.
- [x] Add pointer-cancel, lost-pointer-capture, and window-unmount cleanup paths.
- [x] Use explicit drag regions and explicit `data-window-control` cancel regions so X/minimize/maximize never begin a drag.
- [x] Define resize handles with minimum/maximum constraints and correct cursor styles for all eight directions.
- [x] Render a snap preview before commit; commit the snap only on pointer-up.
- [x] Remove `react-rnd` from the active window frame in favor of the purpose-built controller; dependency cleanup is deferred until the migration is complete.

### P2 — Shell layering and native-feeling surfaces

- [ ] Define a single shell z-index ladder: desktop, windows, taskbar, menus, Start, Search, quick settings, dialogs, and boot.
- [ ] Define one overlay manager so every transient surface registers its owner, escape behavior, focus return, and outside-click policy.
- [x] Make Start a high-opacity Mica/fallback surface with a solid legibility layer; transparency must never reduce content contrast.
- [x] Add a real Quick Settings flyout from the tray chevron.
- [ ] Include Wi-Fi/network, volume, Bluetooth, brightness, battery saver, night light, focus mode, accessibility, projection, and Settings entry points.
- [ ] Add visual state for connected/disconnected, muted/unmuted, Bluetooth on/off, charging, and focus mode.
- [ ] Close tray flyouts on outside click or Escape and return focus to the triggering control.
- [ ] Add taskbar context menu, window previews, running/open indicators, and a reliable restore path.
- [ ] Make the taskbar responsive without hiding core controls behind overflow.

### P3 — OS kernel and state boundaries

- [ ] Split persisted domain state from ephemeral UI state.
- [ ] Persist only serializable OS state: settings, desktop shortcuts, window geometry, selected wallpaper/theme, and filesystem data.
- [ ] Keep pointer sessions, open menus, hover state, drag previews, focus traps, and animation state in memory only.
- [ ] Normalize window state into `windowsById`, `zOrder`, `focusedWindowId`, and `activeDesktopId`.
- [ ] Add versioned migrations and corrupted-storage recovery for Zustand.
- [ ] Add a command registry with typed commands for window, shell, Explorer, search, theme, and Easter eggs.
- [ ] Add an app registry with capabilities: `canOpen`, `canClose`, `canMinimize`, `canMaximize`, `supportsMultipleInstances`, and `preferredSurface`.
- [ ] Keep cross-feature orchestration in services/hooks; stores hold state and transitions, not filesystem/network workflows.

### P4 — Search, Start, and portfolio-as-OS experience

- [ ] Implement one global command/search palette for apps, projects, skills, experience, files, and actions.
- [ ] Use `cmdk` for keyboard navigation and grouped results; add ranking and recent-item weighting.
- [ ] Support Ctrl+K/Cmd+K, taskbar Search, Start search, and Escape consistently.
- [ ] Add empty, loading, no-result, and error states separately.
- [ ] Make Start pinned apps, Recommended items, All apps, and power controls functional rather than decorative.
- [ ] Add a portfolio “Home” app that explains the operating-system metaphor in one sentence and directs users to Projects, About, Skills, Experience, and Contact.
- [ ] Treat portfolio applications as first-class system apps, not content cards placed inside a shell.

### P5 — Explorer and filesystem depth

- [ ] Extract a shared Explorer command bar used by Projects, File Explorer, and Recycle Bin.
- [ ] Replace emoji filesystem glyphs with a consistent system icon/thumbnail policy.
- [ ] Add list/details view, keyboard selection, multi-select, context menu, rename, move, copy, cut, paste, properties, and delete confirmation.
- [ ] Add duplicate-name and restore-conflict handling.
- [ ] Keep Dexie as the local-first filesystem source and use live queries for reactive views.
- [ ] Add a Notepad surface that opens About, Resume, README, and project files from Explorer.
- [ ] Add persistent file associations: `.txt` → Notepad, project folders → Explorer/Projects, images → Photos.

### P6 — Visual system and premium polish

- [ ] Establish a compact token system for light/dark themes, accent colors, surface elevation, focus, selection, and disabled states.
- [ ] Adopt Fluent System Icons for OS chrome where they materially improve Windows familiarity; keep Lucide or custom icons for portfolio-specific content.
- [ ] Use opaque or near-opaque surfaces for high-density controls; reserve blur/acrylic for transient surfaces and wallpaper-connected shell areas.
- [ ] Use one primary material per surface; do not stack multiple translucent panes edge-to-edge.
- [ ] Define focus, hover, pressed, selected, inactive, and disabled states for every interactive primitive.
- [ ] Add reduced-motion behavior and short, functional transitions for open/close, focus, snap, and menu elevation.
- [ ] Add dark mode, high-contrast fallback, and readable contrast checks.
- [ ] Add intentional wallpapers with safe contrast zones behind desktop icons and shell controls.
- [ ] Replace generic project cards with portfolio-specific previews, metadata, and narrative detail views.

### P7 — Quality gates

- [ ] Add Vitest tests for geometry, window transitions, snap zones, command ranking, and persistence migrations.
- [ ] Add Playwright tests for boot, close, maximize, restore, drag, resize, snap preview, Start, Search, quick settings, Explorer, and reload persistence.
- [ ] Test at 1280×720, 1440×900, 1920×1080, browser zoom 125%, and narrow tablet width.
- [ ] Test mouse, touch/pen pointer events, keyboard-only navigation, reduced motion, and storage-disabled behavior.
- [ ] Test no invisible overlay intercepts clicks when Start/Search/Quick Settings are closed.
- [ ] Track first interactive desktop time and avoid blocking the portfolio behind the boot sequence.
- [ ] Keep `npm run lint`, `npx tsc --noEmit`, `npm run build`, unit tests, and browser smoke tests green.

### Recommended technology decisions

- Next.js App Router + React + TypeScript: keep as the application/runtime boundary.
- Zustand: keep for the OS kernel, but split domain transitions from ephemeral UI state and add migrations.
- Dexie + IndexedDB: keep for the persistent virtual filesystem and Recycle Bin; this is the correct browser-local primitive.
- Pointer Events + custom interaction controller: preferred for window drag/resize because pointer capture directly addresses the current cursor and lost-drag problems.
- Radix UI: use the already-installed Popover, Dropdown Menu, Context Menu, Dialog, and Tooltip primitives for accessible transient surfaces.
- `cmdk`: keep for the command/search palette.
- Framer Motion: use for entry/exit and elevation choreography, not as the source of truth for pointer geometry.
- Fluent System Icons: evaluate `@fluentui/react-icons` for system chrome to align better with the Windows reference.
- FastAPI: defer until contact delivery, dynamic content, server analytics, authentication, or cross-device sync is genuinely required.

## Related execution ledger

The detailed profile, canonical filesystem, project media, context-menu, Media Player, and visual-modernization checklist is maintained separately in [os_profile_filesystem_media_tasks.md](C:/Users/Admin/OneDrive/Desktop/weru_os/os_profile_filesystem_media_tasks.md).

## Execution update — project workspace browser verification

The current implementation slice has been exercised in the local browser:

- [x] Projects close and reopen from the taskbar.
- [x] A project opens in an in-OS Project Details window instead of external navigation.
- [x] Project Details exposes the canonical Windows-style project path, metadata, technology, links, and empty-media fallback.
- [x] Maximize fills the measured browser work area above the taskbar; restore returns the previous geometry.
- [x] The project Folder action opens Explorer at the canonical project path.
- [x] Terminal launches from the taskbar and executes sandboxed `help` and `ls` commands.
- [x] Terminal output confirms the Admin hierarchy: Desktop, Documents, Downloads, Music, Pictures, Videos, Audio, and `Weru Profile.json`.
- [x] Quick Settings opens from the tray chevron with Wi-Fi, Bluetooth, Focus, Night light, brightness, volume, display, accessibility, and settings controls.
- [x] Start opens as a readable surface and filters to Terminal when searched.

Still pending: real media fixtures and playback verification, multiple-project-instance coverage, automated Playwright flows, shortcut/media navigation tests, and responsive/accessibility matrix review.
