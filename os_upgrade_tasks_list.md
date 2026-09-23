# Weru OS — Premium Browser Operating System Task List v2

## 1. Product objective

Build a browser-based portfolio operating system that feels familiar, responsive, and coherent like Windows 11 while remaining an original Weru OS experience.

The release must provide:

- Reliable window management.
- Functional close, minimize, maximize, resize, drag, and snapping.
- A real desktop shell with Start, Search, taskbar, tray, and Quick Settings.
- A persistent virtual filesystem.
- Explorer, Recycle Bin, Notepad, Settings, Terminal, Photos, and portfolio apps.
- Search across applications, files, projects, and commands.
- Themes, wallpapers, accessibility, keyboard shortcuts, and Easter eggs.
- A premium, high-contrast visual system that does not rely on excessive transparency.
- A client-first architecture that works without FastAPI.

### Explicit non-goals

- Recreating the entire Windows operating system.
- Implementing real OS-level processes.
- Requiring authentication for the first release.
- Adding FastAPI before a real server-side requirement exists.
- Copying Microsoft branding or proprietary assets exactly.

---

# 2. Current state assessment

## Already implemented

- Next.js App Router migration.
- React and TypeScript shell.
- Zustand OS store foundation.
- Dexie/IndexedDB virtual filesystem foundation.
- Recycle Bin foundation.
- Controlled window geometry.
- Basic drag, resize, minimize, maximize, and snap calculations.
- Windows-inspired desktop and taskbar.
- Start Menu foundation.
- Project Explorer-style surface.
- Boot and guest-session flow.
- Local portfolio content.
- Tailwind/Turbopack launch workaround.
- Basic lint, type-check, and build verification.

## Known defects to resolve first

- Cursor movement is not clearly represented or diagnosed.
- Wallpaper parallax is confused with actual cursor behavior.
- Project window close button is unreliable.
- Title-bar controls share event space with the drag handle.
- Maximize uses hard-coded offsets instead of a measured work area.
- Start Menu is too transparent over dense content.
- Tray chevron does not open a Quick Settings flyout.
- Overlay layering is not centrally managed.
- Window identity uses app IDs in places where unique window IDs are required.
- Current window manager depends on controlled `react-rnd` behavior without pointer capture.
- Some system surfaces still behave like visual mockups rather than operating-system controls.

---

# 3. Phase 0 — Baseline and execution discipline

## Repository baseline

- [x] Confirm the active repository root.
- [x] Confirm Bash-based development commands.
- [x] Preserve existing user changes.
- [x] Read `ideation_upgrade.md`.
- [x] Read and update `os_implementation_plan.md`.
- [x] Read and update `os_tasks_list.md`.
- [ ] Create an implementation branch using the `codex/` prefix.
- [ ] Record the baseline commit and working-tree state.
- [ ] Confirm development server startup from the repository root.
- [ ] Confirm production build before interaction refactoring.

## Quality baseline

- [x] Run `npm run lint`.
- [x] Run `npx tsc --noEmit`.
- [x] Run `npm run build`.
- [ ] Add a browser smoke-test command.
- [ ] Add a repeatable clean-start command.
- [ ] Document the expected local development flow in the implementation plan.
- [ ] Document how generated `.next` files are handled.
- [ ] Document the stale Next/Turbopack root failure and its prevention.

## Task-list discipline

Every implementation task must include:

- The affected subsystem.
- The expected user-visible behavior.
- The files or interfaces involved.
- The verification command or browser scenario.
- A completion checkbox.
- Any known regression risk.

A task is marked complete only after both implementation and verification exist.

---

# 4. Phase 1 — OS architecture and state contracts

## Window model

Define a stable window contract containing:

- `instanceId`.
- `appId`.
- `desktopId`.
- `title`.
- `icon`.
- `mode`.
- `rect`.
- `restoreRect`.
- `snapSlot`.
- `zIndex`.
- `canClose`.
- `canMinimize`.
- `canMaximize`.
- `isFocused`.
- `isVisible`.

Rules:

- `instanceId` identifies an individual window.
- `appId` identifies the application type.
- Multiple instances must never collide.
- UI event handlers must dispatch using `instanceId`.
- The taskbar may group by `appId`, but window actions must target `instanceId`.

## Work-area model

Define a measured work-area contract:

- Viewport width.
- Viewport height.
- Taskbar height.
- Safe top inset.
- Safe bottom inset.
- Browser zoom scale.
- Device pixel ratio.
- Minimum usable width.
- Minimum usable height.

Rules:

- Maximize must use the measured work area.
- No hard-coded `28px` or `72px` offsets.
- The taskbar must not be covered by maximized windows.
- Resize and snapping must react to viewport changes.
- Mobile and tablet work areas must be calculated separately.

## Zustand state boundaries

Split state into durable and ephemeral categories.

### Durable state

Persist:

- Window rectangles.
- Window mode where safe.
- Desktop shortcuts.
- Theme.
- Accent color.
- Wallpaper.
- Taskbar alignment.
- Reduced-motion setting.
- Startup-sequence preference.
- Virtual desktop metadata.
- Recent items.
- Favorites.
- Filesystem data through Dexie.

### Ephemeral state

Do not persist:

- Pointer sessions.
- Current drag operation.
- Current resize operation.
- Snap preview.
- Hover state.
- Open overlays.
- Focus traps.
- Animation progress.
- Temporary notifications.
- Search input text.
- Start Menu open state.
- Quick Settings open state.

## Kernel slices

Create or formalize slices for:

- Lifecycle.
- Windows.
- Desktop.
- Taskbar.
- Settings.
- Search.
- Overlays.
- Notifications.
- Virtual desktops.
- Commands.

## Command registry

Define typed commands for:

- Open application.
- Close focused window.
- Minimize focused window.
- Maximize focused window.
- Restore focused window.
- Snap focused window.
- Open Start.
- Open Search.
- Open Quick Settings.
- Switch wallpaper.
- Switch theme.
- Open file.
- Open folder.
- Empty Recycle Bin.
- Trigger Easter egg.

## Persistence safety

- [ ] Add storage schema migrations.
- [ ] Add corrupted-state recovery.
- [ ] Add storage-unavailable fallback.
- [ ] Add localStorage write throttling.
- [ ] Prevent rapid drag events from writing continuously.
- [ ] Persist window geometry on interaction completion.
- [ ] Preserve default state if stored data is invalid.
- [ ] Add a reset-OS-state command for development.

---

# 5. Phase 2 — Window compositor and interaction correctness

## Diagnostic pass before refactor

- [ ] Add temporary development diagnostics for focused window.
- [ ] Add temporary diagnostics for z-order.
- [ ] Add temporary diagnostics for active pointer session.
- [ ] Add temporary diagnostics for active overlay.
- [ ] Verify whether “cursor not moving” means browser cursor, wallpaper parallax, or custom pointer feedback.
- [ ] Confirm that all visible buttons receive pointer events.
- [ ] Confirm that no hidden overlay remains mounted over the desktop.
- [ ] Remove diagnostics after the interaction contract is verified.

## Pointer-based drag controller

Use Pointer Events and pointer capture rather than relying entirely on mouse events.

- [ ] Add `pointerdown` handling to title-bar drag regions.
- [ ] Call `setPointerCapture(pointerId)` at drag start.
- [ ] Track pointer movement until `pointerup` or `pointercancel`.
- [ ] Handle `lostpointercapture`.
- [ ] Cancel drag with Escape.
- [ ] Cancel drag if the window unmounts.
- [ ] Prevent drag from starting on buttons, inputs, links, menus, and resize handles.
- [ ] Use `touch-action: none` only on actual drag/resize surfaces.
- [ ] Keep normal text and scrolling behavior elsewhere.
- [ ] Update live geometry using `requestAnimationFrame`.
- [ ] Commit geometry to Zustand on pointer-up.

Pointer capture is appropriate here because it keeps the active element receiving pointer events after the pointer leaves its original bounds. [MDN pointer capture](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture)

## Close behavior

- [ ] Give every close button a stable `data-testid`.
- [ ] Give every close button a stable `data-window-control="close"` attribute.
- [ ] Stop pointer-down propagation on controls.
- [ ] Prevent controls from initiating title-bar dragging.
- [ ] Dispatch close using `instanceId`.
- [ ] Remove the window from `windowsById`.
- [ ] Remove the window from z-order.
- [ ] Select the next eligible focused window.
- [ ] Return focus to the desktop if no windows remain.
- [ ] Verify close works while the window is focused.
- [ ] Verify close works while the window is inactive.
- [ ] Verify close works after maximize.
- [ ] Verify close works after snapping.
- [ ] Verify close works from keyboard.
- [ ] Verify close works while Start or Search is open.

## Minimize behavior

- [ ] Mark the window minimized.
- [ ] Remove it from visible window rendering.
- [ ] Preserve its rectangle.
- [ ] Keep it in the taskbar.
- [ ] Restore it by clicking the taskbar item.
- [ ] Restore it through keyboard navigation.
- [ ] Preserve focus behavior.
- [ ] Avoid leaving an invisible minimized window intercepting clicks.

## Maximize behavior

- [ ] Calculate the current work area.
- [ ] Store the exact normal rectangle in `restoreRect`.
- [ ] Set mode to maximized.
- [ ] Position at the work-area origin.
- [ ] Fill the entire work area.
- [ ] Keep the taskbar visible.
- [ ] Disable normal drag and resize while maximized.
- [ ] Restore the exact pre-maximize rectangle.
- [ ] Support double-click title-bar maximize/restore.
- [ ] Support keyboard maximize/restore.
- [ ] Recalculate on viewport resize.
- [ ] Verify at 1280×720, 1440×900, and 1920×1080.
- [ ] Verify at 125% browser zoom.

## Resize behavior

- [ ] Implement eight resize directions.
- [ ] Add visible but subtle resize hit areas.
- [ ] Set correct cursor styles.
- [ ] Enforce minimum dimensions.
- [ ] Enforce maximum dimensions based on work area.
- [ ] Prevent resizing below title-bar usability threshold.
- [ ] Prevent resize handles from being covered by content.
- [ ] Support pointer capture.
- [ ] Commit final dimensions only after resize completion.
- [ ] Cancel safely on pointer cancellation.

## Snap behavior

- [ ] Define left-half snap.
- [ ] Define right-half snap.
- [ ] Define top maximize snap.
- [ ] Define four-corner snap.
- [ ] Define bottom snap if retained.
- [ ] Add snap preview rendering.
- [ ] Update preview while dragging.
- [ ] Do not commit preview geometry until pointer-up.
- [ ] Preserve restore geometry.
- [ ] Restore from snapped mode.
- [ ] Recalculate snap zones when the viewport changes.
- [ ] Add snap tests for edges and corners.
- [ ] Test dragging a window from maximized state.

## Focus and z-order

- [ ] Focus a window on pointer-down.
- [ ] Focus a window on taskbar activation.
- [ ] Bring restored windows to front.
- [ ] Dim inactive windows subtly.
- [ ] Ensure dialogs sit above windows.
- [ ] Ensure Start/Search/Quick Settings sit above windows.
- [ ] Prevent desktop icons from receiving events through open modal overlays.
- [ ] Add focus-visible styling.
- [ ] Return focus to the triggering element when transient surfaces close.

---

# 6. Phase 3 — Overlay manager

Create one shared overlay system for:

- Start Menu.
- Search palette.
- Quick Settings.
- Desktop context menu.
- Taskbar context menu.
- Window context menu.
- Dialogs.
- Notifications.
- Power menu.
- Properties panels.

Each overlay must define:

- Overlay ID.
- Owner.
- Z-index layer.
- Whether it blocks the desktop.
- Whether outside click closes it.
- Whether Escape closes it.
- Trigger element.
- Focus-return target.
- Mobile behavior.

Required behavior:

- Only one primary transient surface opens at a time unless explicitly nested.
- Closed overlays must not intercept pointer events.
- Escape closes the topmost closable overlay.
- Outside click closes surfaces that allow it.
- Keyboard focus remains inside dialogs and menus.
- Overlay transitions must not block interaction after completion.

---

# 7. Phase 4 — Windows desktop shell

## Desktop

- [ ] Build a predictable desktop icon grid.
- [ ] Persist shortcut positions.
- [ ] Snap dragged shortcuts to grid coordinates.
- [ ] Add single-click selection.
- [ ] Add double-click launch.
- [ ] Add keyboard selection.
- [ ] Add desktop context menu.
- [ ] Add Sort by Name.
- [ ] Add Sort by Type.
- [ ] Add Sort by Date.
- [ ] Add Refresh.
- [ ] Add New Folder.
- [ ] Add Personalization shortcut.
- [ ] Add Clean Up icons.
- [ ] Ensure icons remain readable against every wallpaper.

## Taskbar

- [ ] Add Start button.
- [ ] Add Search button.
- [ ] Add pinned applications.
- [ ] Add running indicators.
- [ ] Add active-window indicator.
- [ ] Add taskbar tooltips.
- [ ] Add taskbar context menu.
- [ ] Add taskbar alignment setting.
- [ ] Add taskbar responsive behavior.
- [ ] Add restore behavior for minimized windows.
- [ ] Add window grouping policy.
- [ ] Add active-window preview surface.
- [ ] Keep the taskbar above maximized windows.

## Start Menu

- [ ] Use a high-opacity or opaque surface.
- [ ] Ensure text and icons remain readable over all backgrounds.
- [ ] Add search field.
- [ ] Add pinned apps.
- [ ] Add Recommended items.
- [ ] Add All apps.
- [ ] Add user/account footer.
- [ ] Add power menu.
- [ ] Add Settings shortcut.
- [ ] Add keyboard navigation.
- [ ] Add focus-visible states.
- [ ] Close on Escape.
- [ ] Close on outside click.
- [ ] Preserve focus on trigger after close.
- [ ] Prevent background windows from receiving clicks through Start.

## Quick Settings

Implement the tray chevron as a real flyout.

Controls:

- Wi-Fi.
- Network status.
- Volume.
- Bluetooth.
- Brightness.
- Battery saver.
- Night light.
- Focus mode.
- Accessibility.
- Project/display mode.
- Settings shortcut.

Each control must support:

- Active state.
- Inactive state.
- Disabled state.
- Hover state.
- Keyboard activation.
- Screen-reader label.
- Tooltip.
- Local persistence where appropriate.

---

# 8. Phase 5 — Search and command palette

## Search sources

Index:

- Applications.
- Projects.
- Skills.
- Experience.
- Contact.
- Explorer files.
- Recycle Bin entries.
- Settings.
- Commands.
- Easter eggs.

## Search behavior

- [ ] Open from taskbar.
- [ ] Open from Start.
- [ ] Open with Ctrl+K.
- [ ] Open with Cmd+K.
- [ ] Support Escape.
- [ ] Support ArrowUp/ArrowDown.
- [ ] Support Enter.
- [ ] Group results.
- [ ] Rank exact matches higher.
- [ ] Rank recent items higher.
- [ ] Highlight matching text.
- [ ] Support no-result state.
- [ ] Support loading state.
- [ ] Support error state.
- [ ] Open applications directly.
- [ ] Open files in associated applications.
- [ ] Open project details.
- [ ] Trigger commands.

Use `cmdk` for the interaction primitive and keep ranking/search indexing in a dedicated service.

---

# 9. Phase 6 — Virtual filesystem and Explorer

## Filesystem operations

- [x] List children.
- [x] Get node.
- [x] Create folders.
- [x] Create text files.
- [x] Delete to Recycle Bin.
- [x] Restore from Recycle Bin.
- [ ] Rename.
- [ ] Move.
- [ ] Copy.
- [ ] Cut.
- [ ] Paste.
- [ ] Empty Recycle Bin.
- [ ] Properties.
- [ ] Duplicate-name handling.
- [ ] Restore-conflict handling.
- [ ] Migration support.
- [ ] Error handling.

Dexie remains the correct local-first choice because its live queries can keep React views synchronized with IndexedDB changes. [Dexie React documentation](https://dexie.org/docs/Tutorial/React)

## Explorer

- [x] Basic shell.
- [x] Breadcrumb.
- [x] Sidebar.
- [x] Folder navigation.
- [x] Search current folder.
- [x] Grid view.
- [ ] List/details view.
- [ ] Multi-select.
- [ ] Keyboard navigation.
- [ ] Context menu.
- [ ] New Folder.
- [ ] New Text Document.
- [ ] Rename.
- [ ] Delete confirmation.
- [ ] Copy/Cut/Paste.
- [ ] Properties dialog.
- [ ] File associations.
- [ ] Loading state.
- [ ] Empty state.
- [ ] Error state.

## Recycle Bin

- [x] Display deleted entries.
- [x] Restore entries.
- [x] Empty Recycle Bin.
- [ ] Confirm permanent deletion.
- [ ] Show deletion metadata.
- [ ] Handle restore conflicts.
- [ ] Support keyboard actions.
- [ ] Use the same Explorer command bar.

---

# 10. Phase 7 — Portfolio system applications

## Home

- [ ] Create an OS welcome/home application.
- [ ] Explain the portfolio metaphor briefly.
- [ ] Show recent projects.
- [ ] Show available actions.
- [ ] Show contact call-to-action.
- [ ] Make the app keyboard navigable.

## Projects

- [x] Explorer-style layout.
- [x] Search.
- [x] Filtering.
- [x] Sorting.
- [x] Grid/list switching.
- [x] Project selection.
- [x] External project opening.
- [ ] Project detail view.
- [ ] Project file associations.
- [ ] Screenshots/gallery.
- [ ] Tech-stack metadata.
- [ ] GitHub/live links.
- [ ] Recent/starred persistence.

## About and Resume

- [ ] Open About Me.txt in Notepad.
- [ ] Add Resume.txt.
- [ ] Add metadata and modified dates.
- [ ] Add print/download behavior.
- [ ] Add clear contact CTA.

## Notepad

- [ ] Open text files.
- [ ] Edit text.
- [ ] Save to IndexedDB.
- [ ] Track unsaved changes.
- [ ] Add Save/Save As.
- [ ] Add close confirmation for unsaved content.
- [ ] Add keyboard shortcuts.
- [ ] Add monospace document mode.

## Settings

- [ ] Add Personalization.
- [ ] Add themes.
- [ ] Add accent colors.
- [ ] Add wallpapers.
- [ ] Add taskbar alignment.
- [ ] Add reduced motion.
- [ ] Add transparency toggle.
- [ ] Add startup-sequence toggle.
- [ ] Add Reset OS state.
- [ ] Add About Weru OS.

## Terminal

- [ ] Add terminal window.
- [ ] Add command parser.
- [ ] Implement `help`.
- [ ] Implement `clear`.
- [ ] Implement `pwd`.
- [ ] Implement `ls`.
- [ ] Implement `cd`.
- [ ] Implement `cat`.
- [ ] Implement `open`.
- [ ] Implement `projects`.
- [ ] Implement `contact`.
- [ ] Implement `theme`.
- [ ] Implement `wallpaper`.
- [ ] Implement `matrix`.
- [ ] Implement `hire-weru`.
- [ ] Add command history.
- [ ] Add autocomplete.
- [ ] Add Easter egg output.

## Photos

- [ ] Build project gallery.
- [ ] Add image detail view.
- [ ] Add zoom.
- [ ] Add previous/next.
- [ ] Add project metadata.
- [ ] Add external links.

## Mail/Contact

- [ ] Port contact form.
- [ ] Add validation.
- [ ] Add loading state.
- [ ] Add simulated success state.
- [ ] Add future FastAPI gateway interface.
- [ ] Keep first release functional without a backend.

---

# 11. Phase 8 — Visual design system

## Design principles

Use Windows-inspired principles:

- Effortless.
- Calm.
- Personal.
- Familiar.
- Complete.
- Coherent.

Microsoft documents these as Windows 11’s core design principles. [Windows 11 design principles](https://learn.microsoft.com/en-us/windows/apps/design/design-principles)

## Tokens

Define tokens for:

- Background.
- Surface.
- Surface elevated.
- Surface selected.
- Surface inactive.
- Border.
- Border strong.
- Text primary.
- Text secondary.
- Text disabled.
- Accent.
- Danger.
- Success.
- Focus ring.
- Shadow.
- Radius.
- Spacing.
- Typography.
- Motion duration.

## Materials

- [ ] Use opaque surfaces for high-density navigation.
- [ ] Use acrylic only for transient surfaces.
- [ ] Add solid fallback when transparency is disabled.
- [ ] Avoid adjacent translucent panes.
- [ ] Verify text contrast over every material.
- [ ] Add high-contrast mode.
- [ ] Add reduced-transparency setting.

## Icons

- [ ] Evaluate `@fluentui/react-icons`.
- [ ] Use consistent regular/filled icon states.
- [ ] Separate system icons from portfolio illustrations.
- [ ] Remove remaining emoji from system chrome.
- [ ] Define icon sizing conventions.
- [ ] Define icon color conventions.

## Motion

- [ ] Use motion for interaction feedback.
- [ ] Keep durations short.
- [ ] Add window enter/exit.
- [ ] Add focus elevation.
- [ ] Add snap preview transitions.
- [ ] Add Start/Search/Quick Settings transitions.
- [ ] Add reduced-motion fallback.
- [ ] Avoid animating every content card unnecessarily.

Fluent recommends motion that is functional, natural, consistent, and appealing. [Fluent motion principles](https://fluent2.microsoft.design/motion)

---

# 12. Phase 9 — Accessibility and responsive behavior

## Keyboard

- [ ] Tab through taskbar.
- [ ] Tab through Start.
- [ ] Tab through Quick Settings.
- [ ] Escape closes topmost overlay.
- [ ] Ctrl+K/Cmd+K opens Search.
- [ ] Alt+Tab-style window switching.
- [ ] Ctrl+W closes focused window.
- [ ] Window maximize/restore shortcut.
- [ ] Explorer arrow-key navigation.
- [ ] Enter opens selected file.
- [ ] Delete moves selected file to Recycle Bin.

## Accessibility

- [ ] Add semantic buttons and links.
- [ ] Add dialog roles.
- [ ] Add menu roles.
- [ ] Add listbox behavior where appropriate.
- [ ] Add screen-reader labels.
- [ ] Add focus-visible indicators.
- [ ] Ensure color is not the only status signal.
- [ ] Verify contrast.
- [ ] Respect reduced motion.
- [ ] Test keyboard-only usage.
- [ ] Test with screen-reader-friendly DOM order.

## Responsive behavior

Desktop:

- Full OS shell.
- Draggable windows.
- Snapping.
- Multi-window layout.

Tablet:

- Touch-friendly handles.
- Simplified window controls.
- Reduced taskbar density.
- Larger hit targets.

Mobile:

- Replace floating windows with app navigation.
- Use full-screen app surfaces.
- Keep Start/Search/Quick Settings accessible.
- Preserve the OS metaphor without forcing desktop geometry.
- Disable desktop dragging where it harms usability.

---

# 13. Phase 10 — Performance and reliability

- [ ] Keep pointer updates out of React render loops where possible.
- [ ] Use `requestAnimationFrame` for geometry.
- [ ] Persist only on interaction completion.
- [ ] Lazy-load large applications.
- [ ] Avoid rendering hidden windows unnecessarily.
- [ ] Avoid multiple global mouse listeners.
- [ ] Avoid excessive backdrop filters.
- [ ] Add fallback for low-performance devices.
- [ ] Add wallpaper image optimization.
- [ ] Profile eight simultaneous windows.
- [ ] Test browser zoom.
- [ ] Test slow CPU mode.
- [ ] Test reduced transparency.
- [ ] Test IndexedDB failure.
- [ ] Test localStorage failure.
- [ ] Add error boundaries per application.
- [ ] Add recoverable error UI.

---

# 14. Phase 11 — Automated testing

## Unit tests

Add Vitest tests for:

- Work-area calculations.
- Window clamping.
- Maximize/restore transitions.
- Minimize/restore transitions.
- Focus and z-order.
- Snap-zone detection.
- Snap rectangle calculation.
- Pointer-session cleanup.
- Search ranking.
- Command dispatch.
- Filesystem operations.
- Recycle Bin transactions.
- Persistence migrations.
- Settings updates.

## Component tests

Test:

- Close button.
- Minimize button.
- Maximize button.
- Double-click title bar.
- Start Menu.
- Quick Settings.
- Taskbar restore.
- Search keyboard navigation.
- Explorer selection.
- Explorer folder navigation.
- Recycle Bin restore.
- Notepad save and unsaved state.

## Playwright flows

### Boot

- Load page.
- Wait for boot.
- Enter guest session.
- Confirm desktop becomes interactive.
- Confirm startup sequence can be skipped if enabled.

### Window controls

- Open Projects.
- Close Projects.
- Reopen Projects.
- Minimize Projects.
- Restore Projects.
- Maximize Projects.
- Restore Projects.
- Resize Projects.
- Drag Projects.
- Snap Projects left.
- Snap Projects right.
- Snap Projects to a corner.

### Shell

- Open Start.
- Confirm content is readable.
- Search for an app.
- Launch the app.
- Close Start with Escape.
- Open Quick Settings.
- Toggle Bluetooth.
- Toggle volume.
- Close Quick Settings.
- Confirm background windows remain inactive while flyouts are open.

### Persistence

- Move a window.
- Reload.
- Confirm position persists.
- Change theme.
- Reload.
- Confirm theme persists.
- Create a file.
- Reload.
- Confirm file persists.
- Delete file.
- Reload.
- Restore from Recycle Bin.

### Accessibility

- Complete core flow using keyboard only.
- Verify focus return after overlay closure.
- Verify reduced-motion behavior.
- Verify readable contrast.

---

# 15. Phase 12 — FastAPI seam

Do not add FastAPI until needed.

When required:

- [ ] Define `PortfolioContentRepository`.
- [ ] Define `ContactGateway`.
- [ ] Define `AnalyticsGateway`.
- [ ] Define Pydantic-compatible schemas.
- [ ] Add explicit CORS origins.
- [ ] Add contact delivery endpoint.
- [ ] Add server-side content endpoint only if content becomes dynamic.
- [ ] Keep IndexedDB as the anonymous local fallback.
- [ ] Keep UI independent from backend availability.
- [ ] Add loading, retry, and offline states.

---

# 16. Final acceptance criteria

The release is complete only when:

- The cursor and pointer interactions are reliable.
- Project windows close reliably.
- Maximize fills the actual application viewport.
- Restore returns the exact previous geometry.
- Dragging and resizing work across pointer boundaries.
- Snap previews appear before snap commit.
- Start is readable and functionally interactive.
- Tray Quick Settings opens and closes correctly.
- Taskbar items restore minimized windows.
- Search finds apps, files, projects, and commands.
- Explorer and Recycle Bin survive reloads.
- Themes and wallpapers persist.
- Keyboard shortcuts work without interfering with text inputs.
- Mobile receives a deliberate layout.
- No hidden overlay intercepts clicks.
- Reduced motion and high-contrast fallbacks work.
- Lint passes.
- TypeScript passes.
- Production build passes.
- Unit tests pass.
- Playwright smoke tests pass.
- The experience feels like a coherent operating system rather than a portfolio placed inside a window.

# 17. Recommended execution order

1. Reproduce and instrument the interaction bugs.
2. Fix window identity and event hit testing.
3. Implement pointer capture and measured work-area geometry.
4. Fix close, minimize, maximize, restore, resize, and snapping.
5. Add snap previews.
6. Build the overlay manager.
7. Make Start opaque and accessible.
8. Implement Quick Settings.
9. Implement global Search and command dispatch.
10. Deepen Explorer and filesystem operations.
11. Build Settings, Notepad, Terminal, Photos, and Home.
12. Add themes, wallpapers, motion settings, and Fluent iconography.
13. Add accessibility and responsive behavior.
14. Add automated tests.
15. Run final quality gates and visual review.
