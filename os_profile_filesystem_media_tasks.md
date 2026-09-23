# Weru OS — Profile Filesystem, Media, and UI Modernization Tasks

This checklist is the execution ledger for the Windows-style profile hierarchy, per-browser visitor persistence, project media associations, desktop context menus, Media Player, and the removal of vibe-coded visual styling.

It complements `os_tasks_list.md`; it does not replace the broader operating-system task list.

## Completion rules

Every task is complete only when:

- The implementation exists.
- The expected user-visible behavior is verified.
- The relevant quality gate or browser scenario passes.
- Regression risk has been reviewed.
- The checkbox is updated with evidence where useful.

The simulated operating-system profile is always displayed as `Admin`. The real visitor identity is a browser-local profile ID and must never use the host machine username or host filesystem.

---

## Phase 0 — Baseline and preparation

### Repository audit

- [x] Confirm the active repository root.
  - Subsystem: repository.
  - Behavior: implementation is performed against the active Weru OS checkout.
  - Interfaces: `package.json`, `src/App.tsx`, `src/features/filesystem`, `src/windows`.
  - Verification: `pwd -P`, `test -f package.json`, `npm run lint`.
  - Risk: editing a stale or duplicate checkout.

- [x] Read the current filesystem schema and seed behavior.
- [x] Read the current Zustand persistence and hydration behavior.
- [x] Read the current Explorer, Desktop, Taskbar, Start Menu, and Window components.
- [ ] Inventory every hard-coded filesystem ID.
- [ ] Inventory every hard-coded `Visitor` path.
- [ ] Inventory every emoji and gradient used in system chrome.
- [ ] Inventory every large border radius and pill control.
- [ ] Record the current database schema version.
- [ ] Record the current profile persistence key.
- [ ] Preserve unrelated user changes in the working tree.

### Baseline gates

- [x] Run `npm run lint`.
- [x] Run `npx tsc --noEmit`.
- [x] Run `npm run build`.
- [ ] Start the dev server from the repository root.
- [ ] Confirm `GET /` returns HTTP 200.
- [ ] Record the baseline screenshots at 1280×720, 1440×900, and 1920×1080.
- [ ] Record the current filesystem tree for migration comparison.

---

## Phase 1 — Visual system cleanup

### Design token foundation

- [x] Create neutral light-theme surface tokens.
  - Subsystem: design system.
  - Behavior: system chrome uses calm neutral surfaces with restrained blue accents.
  - Interfaces: `src/styles/tokens.css`, `src/styles/windows-shell.css`.
  - Verification: inspect Start, Explorer, Taskbar, and title bars in the browser.
  - Risk: changing tokens may affect existing portfolio content.

- [ ] Create neutral dark-theme surface tokens.
- [ ] Define primary, secondary, selected, hover, pressed, disabled, danger, success, and focus colors.
- [ ] Define typography tokens using Segoe UI or system UI fallbacks.
- [ ] Define 4px/8px spacing tokens.
- [ ] Define compact control heights.
- [ ] Define title-bar metrics.
- [ ] Define taskbar metrics.
- [ ] Define context-menu metrics.
- [ ] Define icon size conventions for 16px, 20px, and 24px icons.
- [ ] Define restrained shadow levels.
- [ ] Define standard radius values of 4px, 6px, and 8px only.

### Remove vibe-coded styling

- [x] Remove purple gradients from system chrome.
- [x] Remove blue-purple gradient cards.
- [ ] Remove neon pink, orange, teal, and violet system accents.
- [x] Remove emoji from title bars.
- [x] Remove emoji from taskbar icons.
- [x] Remove emoji from Start Menu icons.
- [x] Remove emoji from Explorer system icons.
- [x] Remove emoji from context menus.
- [ ] Replace oversized rounded cards with structured rectangular surfaces.
- [ ] Replace unnecessary pill controls with standard Windows-style buttons.
- [x] Remove decorative glow effects.
- [ ] Remove ornamental backdrop effects that reduce contrast.
- [ ] Remove stacked translucent panes.
- [ ] Remove animations that do not communicate state.
- [ ] Replace generic gradient project thumbnails with restrained previews.
- [ ] Keep color only where it communicates selection, status, or portfolio content.

### Iconography

- [ ] Evaluate and install the selected Fluent-style icon package if needed.
- [ ] Replace system emoji with vector icons.
- [ ] Define regular and filled icon states.
- [ ] Use blue only for primary or selected states.
- [ ] Use gray for secondary actions.
- [ ] Use red only for destructive actions.
- [ ] Standardize icon stroke/fill weight.
- [ ] Standardize icon alignment in buttons and list rows.
- [ ] Verify icons remain readable at browser zoom 125%.

### Shell visual review

- [ ] Restyle title bars to a compact Windows-like layout.
- [ ] Restyle window controls with predictable hit targets.
- [ ] Restyle Taskbar buttons and running indicators.
- [ ] Restyle Start Menu with an opaque legibility surface.
- [ ] Restyle Quick Settings with rectangular stateful toggles.
- [ ] Restyle Explorer command bars.
- [ ] Restyle Explorer breadcrumbs.
- [ ] Restyle context menus.
- [ ] Review all surfaces against supplied Windows screenshots.
- [ ] Capture before/after screenshots.
- [ ] Confirm no visual surface reads as a generic AI-generated SaaS card.

---

## Phase 2 — Canonical path model

### Path constants

- [x] Add a central virtual-path constants module.
  - Subsystem: filesystem path model.
  - Behavior: every feature uses the same canonical simulated Windows paths.
  - Interfaces: new `src/features/filesystem/virtual-paths.ts`.
  - Verification: search the codebase for duplicate hard-coded paths.
  - Risk: path casing and separator drift.

- [x] Define `C:` as the only supported virtual drive.
- [x] Define `C:\Users`.
- [x] Define `C:\Users\Admin`.
- [x] Define `C:\Users\Admin\Desktop`.
- [x] Define `C:\Users\Admin\Desktop\Projects`.
- [x] Define `C:\Users\Admin\Documents`.
- [x] Define `C:\Users\Admin\Downloads`.
- [x] Define `C:\Users\Admin\Pictures`.
- [x] Define `C:\Users\Admin\Videos`.
- [x] Define `C:\Users\Admin\Music`.
- [x] Define `C:\Users\Admin\Audio` as the Music alias.
- [x] Define `C:\Users\Admin\Weru Profile.json`.
- [x] Define `C:\Windows\System32`.
- [x] Change Terminal’s default cwd to `C:\Users\Admin`.
- [x] Remove user-facing `C:\Users\Visitor` output.

### Path resolution

- [ ] Implement absolute path resolution.
- [ ] Implement relative path resolution.
- [ ] Implement `.`.
- [ ] Implement `..`.
- [ ] Normalize `/` into `\\`.
- [ ] Make path matching case-insensitive.
- [ ] Reject unsupported drives.
- [ ] Normalize trailing separators.
- [ ] Generate canonical paths from parent relationships.
- [ ] Detect parent cycles.
- [ ] Handle orphaned nodes safely.
- [ ] Never use host filesystem paths as virtual paths.

---

## Phase 3 — Visitor profile persistence

### Profile contract

- [ ] Define `WeruProfileState`.
  - Subsystem: local visitor profile.
  - Behavior: each browser receives an isolated simulated Admin profile.
  - Interfaces: new profile types/service and existing `os-store.ts`.
  - Verification: profile creation, reload persistence, and malformed-state recovery tests.
  - Risk: duplicate persistence sources.

- [ ] Add profile schema version.
- [ ] Add local profile ID.
- [ ] Add display name fixed to `Admin`.
- [ ] Add created timestamp.
- [ ] Add last-opened timestamp.
- [ ] Add theme preference.
- [ ] Add accent color.
- [ ] Add wallpaper preference.
- [ ] Add taskbar alignment.
- [ ] Add reduced-motion preference.
- [ ] Add transparency preference.
- [ ] Add desktop shortcut positions.
- [ ] Add desktop sort mode.
- [ ] Add recent items.
- [ ] Add favorites.
- [ ] Add safe defaults.
- [ ] Add malformed-state validation.

### Automatic initialization

- [ ] Create a first-load profile initializer.
- [ ] Generate a stable local profile ID.
- [ ] Seed default settings.
- [ ] Seed the canonical filesystem.
- [ ] Seed desktop shortcuts.
- [ ] Hydrate Zustand after profile validation.
- [ ] Make initialization idempotent.
- [ ] Make initialization safe across multiple tabs.
- [ ] Add storage-unavailable fallback.
- [ ] Add a non-blocking recovery notification.

### Profile snapshot

- [x] Create virtual `Weru Profile.json`.
- [x] Generate JSON from current profile state.
- [x] Include profile identity.
- [x] Include settings.
- [x] Include canonical path metadata.
- [x] Include filesystem counts.
- [x] Include storage provider information.
- [x] Mark the node as system-generated.
- [x] Mark the node read-only.
- [x] Prevent direct editing.
- [x] Make Terminal `cat "Weru Profile.json"` return the current snapshot.

---

## Phase 4 — Visitor-to-Admin migration

- [ ] Add a versioned Dexie migration.
  - Subsystem: persistence compatibility.
  - Behavior: existing Visitor data becomes Admin without losing user-created work.
  - Interfaces: `filesystem-db.ts`, `filesystem-service.ts`, profile migration service.
  - Verification: migration fixture and retry test.
  - Risk: orphaned nodes or duplicate folders.

- [ ] Detect the existing Visitor profile.
- [ ] Rename Visitor to Admin while preserving its ID.
- [ ] Preserve user-created files.
- [ ] Preserve user-created folders.
- [ ] Preserve Recycle Bin entries.
- [ ] Create missing Downloads folder.
- [ ] Create missing Videos folder.
- [ ] Create missing Music folder.
- [ ] Create Audio alias.
- [ ] Move seeded Projects under Desktop.
- [ ] Preserve project IDs.
- [ ] Preserve file IDs.
- [ ] Update stored parent references.
- [ ] Update default Terminal cwd.
- [ ] Record migration completion.
- [ ] Make migration safe to retry.
- [ ] Recover from partially completed migration.
- [ ] Prevent migration from duplicating nodes.

---

## Phase 5 — Filesystem schema and node operations

### Node schema

- [x] Extend node kinds to `folder`, `file`, and `shortcut`.
- [x] Add shortcut target ID.
- [x] Add shortcut target path.
- [x] Add media metadata.
- [x] Add project association ID.
- [x] Add system-node flag.
- [x] Add read-only flag.
- [ ] Preserve old file nodes during migration.
- [ ] Add migration defaults.

### Root seed

- [x] Seed `C:`.
- [x] Seed `Users`.
- [x] Seed `Admin`.
- [x] Seed `Desktop`.
- [x] Seed `Documents`.
- [x] Seed `Downloads`.
- [x] Seed `Pictures`.
- [x] Seed `Videos`.
- [x] Seed `Music`.
- [x] Seed `Audio.lnk`.
- [x] Seed `Windows`.
- [x] Seed hidden `System32`.
- [x] Seed `System32\README.txt`.
- [x] Seed `Weru Profile.json`.

### File operations

- [ ] Create folder.
- [ ] Create text file.
- [ ] Rename file.
- [ ] Rename folder.
- [ ] Move item.
- [ ] Copy item.
- [ ] Cut item.
- [ ] Paste item.
- [ ] Delete item to Recycle Bin.
- [ ] Restore item.
- [ ] Empty Recycle Bin with confirmation.
- [ ] Show Properties.
- [ ] Add collision-safe naming.
- [ ] Reject invalid names.
- [ ] Protect system nodes.
- [ ] Preserve metadata during moves.
- [ ] Preserve links during non-target operations.

### Shortcut resolution

- [ ] Resolve shortcut by target ID.
- [ ] Resolve shortcut by target path.
- [ ] Resolve shortcut folders.
- [ ] Resolve shortcut files.
- [ ] Limit shortcut recursion depth.
- [ ] Detect shortcut loops.
- [ ] Expose link target in Properties.
- [ ] Expose link target in Terminal `stat`.
- [ ] Add Show in folder behavior.
- [ ] Ensure deleting a shortcut does not delete its target.

---

## Phase 6 — Project media manifest

### Manifest

- [x] Define `MediaAsset`.
- [x] Define `ProjectMediaManifest`.
- [x] Support video assets.
- [x] Support audio assets.
- [x] Support image assets.
- [ ] Support poster images.
- [ ] Support captions.
- [ ] Support duration metadata.
- [x] Validate MIME types.
- [x] Validate bundled source paths.
- [ ] Reject unsafe external sources.
- [ ] Handle projects with no media.
- [ ] Handle missing optional assets.

### Bundled assets

- [ ] Add `public/media/videos`.
- [ ] Add `public/media/audio`.
- [ ] Add `public/media/images`.
- [ ] Add `public/media/posters`.
- [ ] Add `public/media/captions`.
- [x] Document accepted formats.
- [x] Document media naming conventions.
- [ ] Add placeholder media metadata where appropriate.

### Media node seeding

- [ ] Seed videos under `C:\Users\Admin\Videos`.
- [ ] Seed audio under `C:\Users\Admin\Music`.
- [ ] Seed images under `C:\Users\Admin\Pictures`.
- [ ] Attach media metadata.
- [ ] Attach project IDs.
- [ ] Set media file associations.
- [ ] Avoid storing binary content in IndexedDB.
- [ ] Keep media seeding idempotent.
- [ ] Handle removed assets gracefully.

### Project shortcuts

- [ ] Create direct video shortcuts in each project.
- [ ] Create direct audio shortcuts in each project.
- [ ] Create a `Media` shortcut folder where appropriate.
- [ ] Display link badges.
- [ ] Display canonical targets.
- [ ] Ensure target files remain single-source assets.
- [ ] Show unavailable state for broken media links.

---

## Phase 7 — Explorer and This PC

### This PC

- [ ] Open Explorer at This PC.
- [ ] Display Local Disk `(C:)`.
- [ ] Display Users.
- [ ] Display Windows.
- [ ] Display Admin profile folders.
- [ ] Use Windows-style folder icons.
- [ ] Display canonical address bar path.
- [ ] Display breadcrumb path.

### Navigation

- [ ] Navigate to `C:\Users\Admin`.
- [ ] Navigate to Desktop.
- [ ] Navigate to Desktop\Projects.
- [ ] Navigate to Documents.
- [ ] Navigate to Downloads.
- [ ] Navigate to Pictures.
- [ ] Navigate to Videos.
- [ ] Navigate to Music.
- [ ] Navigate through Audio alias.
- [ ] Navigate into project folders.
- [ ] Navigate through project shortcuts.
- [ ] Support Back.
- [ ] Support Forward.
- [ ] Support Up.
- [ ] Support Refresh.

### Display

- [ ] Distinguish folders from files.
- [ ] Distinguish shortcuts from regular files.
- [ ] Add media icons.
- [ ] Add file metadata display.
- [ ] Add target path display.
- [ ] Add loading state.
- [ ] Add empty state.
- [ ] Add storage-error state.
- [ ] Add unavailable-media state.
- [ ] Add list view.
- [ ] Add details view.
- [ ] Add grid view.
- [ ] Persist preferred view.

---

## Phase 8 — Desktop and context menus

### Desktop shortcuts

- [ ] Add `This PC` target.
- [ ] Add `Projects` target.
- [ ] Add `About Me` target.
- [ ] Add `Resume` target.
- [ ] Add Recycle Bin target.
- [ ] Persist icon positions.
- [ ] Snap icons to a predictable grid.
- [ ] Open folders on double-click.
- [ ] Open files in associated apps.
- [ ] Open media in Media Player.
- [ ] Show selected state.
- [ ] Support keyboard selection.

### Empty desktop context menu

- [ ] Add New folder.
- [ ] Add New text document.
- [ ] Add Refresh.
- [ ] Add Sort by Name.
- [ ] Add Sort by Type.
- [ ] Add Sort by Date Modified.
- [ ] Add Open Terminal here.
- [ ] Add Personalize.
- [ ] Add Display settings.
- [ ] Add Paste when available.
- [ ] Disable unavailable commands.

### Selected-item context menu

- [ ] Add Open.
- [ ] Add Open in Terminal.
- [ ] Add Show in folder.
- [ ] Add Rename.
- [ ] Add Delete.
- [ ] Add Properties.
- [ ] Target actions by node ID, never by display label.

### Accessibility and layering

- [ ] Add menu roles.
- [ ] Add menu-item roles.
- [ ] Support ArrowUp.
- [ ] Support ArrowDown.
- [ ] Support Enter.
- [ ] Support Escape.
- [ ] Close on outside click.
- [ ] Return focus to the trigger.
- [ ] Ensure closed menus do not intercept pointer input.
- [ ] Ensure menus remain inside the viewport.

---

## Phase 9 — Media Player

### Registration and launch

- [ ] Register `media-player` in the app registry.
- [ ] Add window configuration.
- [ ] Add AppIcon mapping.
- [ ] Add Start Menu entry.
- [ ] Add global Search entry.
- [ ] Add taskbar running indicator.
- [ ] Define app capabilities.
- [ ] Define an `OpenTarget` contract.
- [ ] Add typed `open-target` OS effect.
- [ ] Keep current media selection ephemeral.

### Video player

- [ ] Render native video controls.
- [ ] Disable autoplay.
- [ ] Render posters.
- [ ] Display title.
- [ ] Display project association.
- [ ] Display canonical path.
- [ ] Support captions.
- [ ] Support keyboard controls.
- [ ] Handle loading state.
- [ ] Handle unsupported media.
- [ ] Handle missing assets.
- [ ] Handle playback errors.

### Audio player

- [ ] Render native audio controls.
- [ ] Disable autoplay.
- [ ] Render artwork where available.
- [ ] Display title.
- [ ] Display project association.
- [ ] Display canonical path.
- [ ] Support keyboard controls.
- [ ] Handle missing assets.
- [ ] Handle unsupported media.
- [ ] Handle playback errors.

### Player navigation

- [ ] Add previous-media action.
- [ ] Add next-media action.
- [ ] Limit navigation to current project media.
- [ ] Add View project.
- [ ] Add Show in folder.
- [ ] Return focus after closing.
- [ ] Respect reduced motion.

---

## Phase 10 — Project detail integration

- [ ] Add project detail view.
- [ ] Display project description.
- [ ] Display technology stack.
- [ ] Display GitHub link.
- [ ] Display live link.
- [ ] Display associated videos.
- [ ] Display associated audio.
- [ ] Display associated images.
- [ ] Display canonical media paths.
- [ ] Add Open media actions.
- [ ] Add Open containing folder.
- [ ] Add Open in Terminal.
- [ ] Show unavailable media without breaking project details.
- [ ] Keep project metadata separate from visitor filesystem state.
- [ ] Replace gradient-heavy project cards with structured Windows-style file rows/previews.

---

## Phase 11 — Terminal integration

### Path behavior

- [ ] Change default prompt to `weru@portfolio C:\Users\Admin>`.
- [ ] Update `pwd`.
- [ ] Update `ls`.
- [ ] Update `cd`.
- [ ] Update `tree`.
- [ ] Update `find`.
- [ ] Update `stat`.
- [ ] Remove all Visitor output.

### Shortcut behavior

- [ ] Display shortcuts with link indicators in `ls`.
- [ ] Resolve shortcut folders in `cd`.
- [ ] Display target paths in `stat`.
- [ ] Resolve shortcuts in `open`.
- [ ] Reject `cat` on media files with a friendly message.
- [ ] Return canonical paths from `find`.
- [ ] Add media-aware `open-target` effects.

### Safety

- [ ] Reject host filesystem paths.
- [ ] Reject unsupported drives.
- [ ] Reject arbitrary URLs.
- [ ] Confirm no process spawning exists.
- [ ] Confirm no `eval` exists.
- [ ] Confirm no network requests occur in command handlers.

---

## Phase 12 — Persistence and recovery

- [ ] Persist created folders.
- [ ] Persist created files.
- [ ] Persist renamed nodes.
- [ ] Persist moved nodes.
- [ ] Persist deleted nodes.
- [ ] Persist restored nodes.
- [ ] Persist themes.
- [ ] Persist wallpapers.
- [ ] Persist desktop icon positions.
- [ ] Persist sorting preference.
- [ ] Persist recent items.
- [ ] Throttle profile writes.
- [ ] Avoid writes during pointer movement.
- [ ] Recover malformed JSON.
- [ ] Recover missing IndexedDB records.
- [ ] Recover deleted profile root.
- [ ] Add development-only Reset Weru Profile action.
- [ ] Confirm reset cannot affect host files.

---

## Phase 13 — Automated testing

### Unit tests

- [ ] Test absolute path resolution.
- [ ] Test relative path resolution.
- [ ] Test case-insensitive lookup.
- [ ] Test slash normalization.
- [ ] Test `.` and `..`.
- [ ] Test invalid drive rejection.
- [ ] Test canonical path generation.
- [ ] Test orphan handling.
- [ ] Test parent-cycle handling.
- [ ] Test shortcut resolution.
- [ ] Test shortcut-cycle protection.
- [ ] Test Visitor-to-Admin migration.
- [ ] Test Projects reparenting.
- [ ] Test missing-folder recovery.
- [ ] Test duplicate-name generation.
- [ ] Test Recycle Bin preservation.
- [ ] Test media manifest validation.
- [ ] Test media-node creation.
- [ ] Test profile JSON serialization.
- [ ] Test corrupt-state recovery.

### Component tests

- [ ] Test This PC rendering.
- [ ] Test canonical breadcrumbs.
- [ ] Test Desktop navigation.
- [ ] Test Projects navigation.
- [ ] Test Videos navigation.
- [ ] Test Music navigation.
- [ ] Test Audio alias navigation.
- [ ] Test New Folder.
- [ ] Test New Text Document.
- [ ] Test Rename.
- [ ] Test Delete and Restore.
- [ ] Test context-menu keyboard behavior.
- [ ] Test shortcut badges.
- [ ] Test Properties target display.
- [ ] Test Open in Terminal.
- [ ] Test video launch.
- [ ] Test audio launch.
- [ ] Test missing media state.
- [ ] Test profile snapshot display.
- [ ] Test neutral visual states.

### Playwright flows

- [ ] Clear browser storage.
- [ ] Load the portfolio.
- [ ] Confirm automatic Admin profile creation.
- [ ] Open This PC.
- [ ] Navigate to `C:\Users\Admin`.
- [ ] Confirm standard folders.
- [ ] Confirm Projects is under Desktop.
- [ ] Create a desktop folder.
- [ ] Reload and confirm persistence.
- [ ] Rename the folder.
- [ ] Delete the folder.
- [ ] Restore the folder.
- [ ] Open a project.
- [ ] Open a project video shortcut.
- [ ] Confirm Media Player opens.
- [ ] Confirm canonical path display.
- [ ] Open project audio.
- [ ] Open Terminal from a folder.
- [ ] Confirm Terminal cwd.
- [ ] Run `tree` and `find`.
- [ ] Attempt a host path and confirm rejection.
- [ ] Open desktop context menu.
- [ ] Create a New Folder from the menu.
- [ ] Open Personalize.
- [ ] Close the menu with Escape.
- [ ] Confirm no invisible overlay blocks the desktop.
- [ ] Test a second browser context and confirm profile isolation.
- [ ] Test Visitor-to-Admin migration fixture.

---

## Phase 14 — Responsive and accessibility verification

- [ ] Test 1920×1080.
- [ ] Test 1440×900.
- [ ] Test 1280×720.
- [ ] Test 125% browser zoom.
- [ ] Test tablet width.
- [ ] Test mobile width.
- [ ] Keep Explorer usable on narrow screens.
- [ ] Keep context menus inside the viewport.
- [ ] Keep Media Player usable on narrow screens.
- [ ] Add keyboard alternatives for desktop actions.
- [ ] Verify visible focus rings.
- [ ] Verify correct menu ARIA roles.
- [ ] Verify media control labels.
- [ ] Verify reduced-motion behavior.
- [ ] Verify contrast over every wallpaper.
- [ ] Verify system chrome uses no emoji.
- [ ] Verify system chrome uses no purple gradients.

---

## Phase 15 — Final quality gates

- [ ] Run `npm run lint`.
- [ ] Run `npx tsc --noEmit`.
- [ ] Run `npm run build`.
- [ ] Run unit tests.
- [ ] Run component tests.
- [ ] Run Playwright tests.
- [ ] Review visual screenshots.
- [ ] Review migration behavior.
- [ ] Review storage recovery behavior.
- [ ] Review host-access security boundary.
- [ ] Review existing Window drag, resize, maximize, minimize, and snap behavior.
- [ ] Review existing Explorer behavior.
- [ ] Review existing Recycle Bin behavior.
- [ ] Review existing Terminal behavior.
- [ ] Update `os_tasks_list.md`.
- [ ] Update `os_implementation_plan.md`.
- [ ] Record deferred backend, upload, sharing, and cross-device-sync work.

## Final acceptance criteria

- [ ] The simulated profile consistently displays as `C:\Users\Admin`.
- [ ] Every browser profile receives isolated local Weru state.
- [ ] The canonical filesystem hierarchy is consistent across Explorer, Desktop, Terminal, and project views.
- [ ] Projects live under `C:\Users\Admin\Desktop\Projects`.
- [ ] Videos live under `C:\Users\Admin\Videos`.
- [ ] Audio is available under `C:\Users\Admin\Music` and the `Audio` alias.
- [ ] Users can create, rename, delete, restore, and navigate virtual files and folders.
- [ ] Desktop right-click menus work.
- [ ] Project media uses non-copying virtual shortcuts.
- [ ] Media opens inside Weru Media Player.
- [ ] Terminal understands canonical Windows-style paths.
- [ ] `Weru Profile.json` reflects the local profile state.
- [ ] Visitor-to-Admin migration preserves existing data.
- [ ] No host filesystem, process, network, cookie, secret, or environment access is possible.
- [ ] Purple gradients, emoji system icons, excessive rounded cards, and decorative vibe-coded styling are removed.
- [ ] Lint, type-check, build, unit tests, component tests, Playwright tests, and visual review pass.

---

## Execution update — project workspaces and Explorer fidelity

Implemented in the current execution slice:

- Reconciled the interrupted `project-detail` registration and completed the missing vector icon mapping.
- Added project-aware window instances so different projects can remain open simultaneously while reopening the same project focuses its existing detail window.
- Changed project activation from external `window.open` behavior to an in-OS Project Details window.
- Added Project Details content with canonical project paths, descriptions, technology metadata, thumbnail fallback behavior, media sections, repository/live links, and project actions.
- Added a dedicated in-OS Media Player with native video/audio controls and canonical virtual path display.
- Added manifest-driven media node seeding and non-copying project shortcut nodes.
- Added recursive shortcut resolution with target-ID/path support, depth limits, and broken-link protection.
- Updated Explorer to use the central virtual-node IDs, separate navigation/content scrolling, and a dedicated full-width status bar so item counts do not overlap the navigation pane.
- Wired Project Details actions to open the project folder in Explorer and the project path in Terminal.
- Added project-detail entries to the running taskbar surface and Media Player to Start/Search registration.

Verification completed:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Still pending before marking the interaction tasks complete:

- Browser verification of single-click project opening and multiple detail windows.
- Browser verification of Explorer status-bar placement at the supplied viewport sizes.
- Playwright coverage for media playback, shortcut navigation, taskbar focus, and project-folder/Terminal actions.
- Real bundled media fixtures under `public/media` so video/audio playback can be exercised end to end.

## Execution update — browser verification of the project workspace slice

Verified in the running local browser at `http://localhost:3000/`:

- [x] Close the Projects window from its title-bar control.
  - Result: the window is removed from the desktop and its running taskbar item disappears.
- [x] Reopen Projects from the taskbar.
  - Result: the Explorer-style Projects window returns without navigating away from Weru OS.
- [x] Open a project from the Projects surface.
  - Result: a `Project details — Adventures` window opens inside the OS; no external page navigation occurs.
- [x] Render the canonical project path.
  - Result: `C:\Users\Admin\Desktop\Projects\Adventures` is visible in the project window and Explorer.
- [x] Verify project detail content.
  - Result: description, category, technology stack, empty-media state, and repository link are visible.
- [x] Maximize and restore the project detail window.
  - Result: maximize fills the browser work area above the taskbar; restore returns the prior window geometry.
- [x] Open the containing project folder.
  - Result: Explorer opens at `C:\Users\Admin\Desktop\Projects\Adventures` and shows `README.md`.
- [x] Launch Terminal from the taskbar.
  - Result: Terminal opens as an in-OS window, focuses its command field, and displays the sandbox notice.
- [x] Execute sandboxed Terminal commands.
  - Result: `help` returns the registered command groups and `ls` returns the canonical Admin folders without host access.
- [x] Verify the canonical profile hierarchy in Terminal.
  - Result: `C:\Users\Admin` lists Desktop, Documents, Downloads, Music, Pictures, Videos, Audio, and `Weru Profile.json`.
- [x] Open Quick Settings from the tray chevron.
  - Result: the flyout exposes Wi-Fi, Bluetooth, Focus, Night light, Brightness, Volume, Display, Accessibility, and All settings.
- [x] Open Start and search for Terminal.
  - Result: the Start surface is readable and filters pinned apps to Terminal.

Browser verification notes:

- The local dev server was started from the repository root and served the updated application.
- The first browser observation was still on the boot/guest layer while desktop controls were already mounted; activating the guest session removed the boot layer correctly. This is existing boot behavior, not a project-window regression.
- The current manifest contains no real bundled media assets, so the browser pass verified the empty media state and player wiring, not native video/audio playback.
- Multiple-project window behavior, shortcut media navigation, responsive viewport matrix, and automated Playwright coverage remain pending.
