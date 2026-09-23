# Weru OS — Windows 11 Portfolio Upgrade Implementation Plan

## Objective

Transform the current Vite/macOS-inspired portfolio into a polished Windows 11-style portfolio operating system using Next.js, React, TypeScript, and a client-first architecture.

The first release will be a functional illusion: it will provide real window management, snapping, persistence, a virtual filesystem, Recycle Bin, Explorer, search, themes, wallpapers, keyboard shortcuts, portfolio applications, and Easter eggs without requiring authentication or a backend.

## Architectural decisions

- Migrate the repository from Vite to Next.js App Router.
- Keep the OS shell client-side because it depends on browser APIs, pointer events, viewport measurements, IndexedDB, and keyboard events.
- Use Zustand for OS/kernel state and selectors.
- Use Dexie + IndexedDB for the persistent virtual filesystem and Recycle Bin.
- Use `react-rnd` initially as a controlled drag/resize primitive, with a custom snap engine and Zustand-owned geometry.
- Keep Framer Motion for animation; do not introduce a second animation library.
- Reuse existing Radix UI packages for accessible menus, dialogs, context menus, toggles, and tooltips.
- Reuse `cmdk` for Start Menu and Search.
- Keep portfolio content typed and local during the first release.
- Defer FastAPI until real server-side requirements exist: contact delivery, dynamic content, analytics events, accounts, or cross-device sync.
- Make the lock/login sequence theatrical but skippable.
- Target desktop and tablet widths first; provide a deliberate simplified mobile fallback.

## Target architecture

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  features/
    os/
    window-manager/
    desktop/
    filesystem/
    apps/
    search/
  content/
  components/
  lib/
```

The OS store will own lifecycle, windows, desktops, taskbar state, settings, notifications, and command dispatch. IndexedDB will own files, folders, file contents, metadata, and Recycle Bin entries. UI components will dispatch typed actions rather than mutating storage directly.

## Implementation phases

### Phase 0 — Baseline and migration preparation

- Preserve existing user changes.
- Normalize project data.
- Fix lint issues.
- Establish the new Next.js dependency and configuration plan.
- Export and maintain the task checklist in `os_tasks_list.md`.

### Phase 1 — Next.js foundation

- Replace Vite entrypoints with App Router.
- Create the root layout and client-only OS shell.
- Move global styling into the Next.js CSS entrypoint.
- Port current portfolio content without changing its meaning.
- Fix analytics integration for Next.js.
- Remove Vite-only files and dependencies.
- Establish working lint, type-check, and production build commands.

### Phase 2 — OS kernel and window manager

- Add Zustand slices for lifecycle, windows, desktop, taskbar, settings, search, and notifications.
- Add persisted state versioning and hydration handling.
- Implement controlled window geometry.
- Implement drag, resize, focus, z-order, minimize, maximize, restore, and close.
- Implement a pure snap engine for half-screen, quarter-screen, and maximize zones.
- Persist window layouts and recover them safely after viewport changes.

### Phase 3 — Windows shell and virtual filesystem

- Build the Windows-style taskbar, Start Menu, system tray, desktop shortcuts, and context menus.
- Add Dexie schema and seed data.
- Build Explorer and Recycle Bin.
- Implement create, rename, move, copy, delete, restore, properties, and search operations.
- Persist filesystem changes across reloads.

### Phase 4 — Portfolio applications

- Add Notepad, Settings, Terminal, Photos, Mail, and Browser-style applications.
- Port existing About, Projects, Skills, Experience, and Contact content into the new app registry.
- Make the local content repository replaceable by a future FastAPI repository.

### Phase 5 — Personalization and polish

- Add Windows-style design tokens, themes, accent colors, wallpapers, time-of-day overlays, notifications, quick settings, reduced motion, accessibility, and Easter eggs.
- Add responsive mobile fallback.
- Add visual regression coverage and performance profiling.

### Phase 4A — Premium OS visual language (completed slice)

The first visual pass was intentionally revised after browser review. The original shell had Windows-like wallpaper and taskbar framing, but the primary content window still read as a macOS/Finder portfolio. This slice makes the OS model coherent at the application-surface level:

- Windows-style title-bar controls replace traffic lights and centered macOS chrome.
- OS chrome uses Lucide/vector icons, Fluent-inspired surfaces, restrained borders, and Segoe UI-oriented typography.
- The Projects app is now an Explorer workspace with a command bar, breadcrumb, search, quick access, tag filters, sorting, list/grid modes, selection, and double-click launch behavior.
- Project previews use branded gradients, grid treatments, and semantic vector glyphs instead of generic emoji thumbnails.
- Unused legacy menu-bar/dock stylesheet imports were removed from the Next entrypoint to prevent the two visual systems from competing.
- Generated `.next` output is excluded from ESLint so quality gates inspect source rather than build artifacts.

The direction is informed by [PostHog's dev-tool redesign](https://newsletter.posthog.com/p/the-companies-that-shaped-posthog): dense navigation, a persistent sidebar, command-oriented interaction, and product surfaces that feel like a tool rather than a marketing page. Windows 11's [design principles](https://learn.microsoft.com/en-us/windows/apps/design/design-principles) and [Fluent material guidance](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic) provide the visual constraints: calm hierarchy, familiar controls, personal atmosphere, and layered surfaces used sparingly.

### Phase 6 — Optional FastAPI integration

- Add FastAPI only for real server-side requirements.
- Use Pydantic models, explicit CORS origins, and background tasks for contact delivery.
- Keep anonymous desktop/filesystem state local unless cross-device sync is explicitly introduced.

## Core interfaces

The implementation will define typed interfaces for:

- `WindowInstance`
- `VirtualDesktop`
- `DesktopShortcut`
- `AppDefinition`
- `OsSettings`
- `VfsNode`
- `ContactGateway`
- `PortfolioContentRepository`
- `OsCommand`

The window manager will expose actions such as `openApp`, `closeWindow`, `focusWindow`, `minimizeWindow`, `toggleMaximize`, `moveWindow`, `resizeWindow`, `previewSnap`, `applySnap`, and `switchDesktop`.

## Quality gates

Every phase must finish with:

- TypeScript passing.
- ESLint passing.
- Production build passing.
- Relevant unit tests passing.
- Relevant Playwright flows passing.
- No regressions in existing portfolio content.
- No interaction that blocks the visitor from discovering the portfolio.

## Final acceptance criteria

- The desktop visibly and behaviorally resembles Windows 11.
- Windows support drag, resize, focus, minimize, maximize, and snapping.
- Window layouts, settings, and filesystem contents survive reloads.
- Explorer and Recycle Bin are usable.
- Search finds applications, projects, skills, and files.
- Themes and wallpapers persist.
- Keyboard shortcuts work without interfering with text inputs.
- Core portfolio applications are discoverable and functional.
- Mobile users receive a deliberate fallback.
- The first release works without FastAPI running.
- Lint, type-checking, tests, and production build pass.

## Revised senior-engineering plan after browser review

The latest screenshots reveal that the project needs a correctness and systems pass before another visual pass. The current result has the visual vocabulary of an OS, but several interaction contracts are not reliable enough: pointer behavior is not clearly observable, the title-bar controls can lose their hit target, maximization still depends on legacy offsets, Start is too transparent over dense content, and the tray chevron is decorative.

### What the screenshots tell us

1. The Start surface is visually present but not sufficiently opaque. The underlying Explorer content remains legible through it, which makes the menu feel like a glass overlay rather than a focused Windows surface.
2. The title-bar controls are visually styled, but a Windows-like control is only successful when hit testing, focus, click cancellation, and state transition are reliable.
3. The window is not using a single measured work area. The current `28px` top and `72px` bottom assumptions came from the earlier menu/taskbar layout and are not a safe maximize contract.
4. The tray is an icon row without a system flyout. The missing secondary surface makes the taskbar feel like a mockup rather than an operating-system shell.
5. The pointer/parallax behavior is coupled to a root `mousemove` handler, while window movement is delegated to a controlled `react-rnd` instance. These are separate systems with no shared pointer session, capture, or diagnostic state.

### Bug hypotheses to prove before implementation

- Pointer/cursor: `useParallax` changes wallpaper motion only; it is not a cursor system. The OS has no explicit pointer-visual layer or pointer-session diagnostics. If the complaint is “the cursor does not move,” we need to distinguish browser pointer visibility from wallpaper parallax and verify both.
- Close: the title bar is also the `react-rnd` drag handle, while the controls stop propagation only in `click`. The close action therefore needs an explicit drag-cancel boundary and a direct window-instance id test.
- Maximize: `Window.tsx` currently uses `x: 0, y: 28` and `height: calc(100% - 28px)` while the shell has a separate taskbar. This is not a measured viewport/work-area model and can leave a gap, overlap the taskbar, or be interpreted inconsistently by a controlled Rnd instance.
- Start transparency: `.windows-start-menu` uses a translucent background and backdrop blur over a dense window; it has no contrast-enforcing opaque fallback or surface-level legibility contract.
- Tray arrow: `Taskbar.tsx` renders the chevron as a button with no state, popover, or outside-click behavior.

### PostHog research and the pattern to borrow

PostHog’s public OS-style website documents a custom desktop environment, draggable/resizable/maximizable/snappable windows, centralized app state, custom OS components, Tailwind, Radix UI, MDX content, and Algolia search. It is a Gatsby/Vercel site, not a Next.js operating-system framework. [PostHog’s own architecture notes](https://github.com/PostHog/posthog.com/blob/master/WARP.md) are the useful source here.

The PostHog product repository adds a second lesson: portable domain logic should be separated from host/UI concerns, stores should hold state rather than business workflows, and commands/contributions should coordinate features. [PostHog’s product architecture](https://github.com/PostHog/code/blob/main/AGENTS.md) and [vertical product boundaries](https://github.com/PostHog/posthog/blob/master/products/README.md) support that direction.

For this project, the equivalent boundary is:

```text
OS kernel          state transitions, commands, persistence policy
Window compositor  focus, z-order, geometry, drag, resize, snap, work area
Shell              desktop, taskbar, Start, Search, Quick Settings, overlays
System apps        Explorer, Recycle Bin, Notepad, Settings, Terminal, Photos
Portfolio content  projects, skills, experience, contact, Easter eggs
Platform adapters  IndexedDB, localStorage, viewport, pointer, future FastAPI
```

### Windows/Fluent design constraints

The reference should be Windows-inspired, not a brittle pixel clone. Windows 11’s documented principles are Effortless, Calm, Personal, Familiar, and Complete/Coherent. Its signature vocabulary includes elevation/layering, purposeful iconography, materials, and geometry. [Microsoft’s Windows 11 design principles](https://learn.microsoft.com/en-us/windows/apps/design/design-principles)

The material rule is especially important for the current transparency problem: Acrylic is appropriate for transient UI, but multiple adjacent translucent surfaces create seams and visual noise; opaque surfaces are recommended for vertical panes and legibility-sensitive areas. [Microsoft’s Acrylic guidance](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic)

Motion should explain interaction rather than decorate it: functional, natural, consistent, and appealing, with short enter/exit/elevation/container transitions. [Fluent motion guidance](https://fluent2.microsoft.design/motion)

### State and library decision

The existing stack is mostly right. The upgrade is in the boundaries, not in adding many dependencies:

- Zustand remains the kernel store. Use its persist middleware only for serializable durable state and add version migration/corruption recovery. [Zustand persistence](https://zustand.docs.pmnd.rs/reference/middlewares/persist)
- Dexie remains the filesystem database. Its live queries are a good fit for Explorer and Recycle Bin because queries react to IndexedDB changes without copying the whole filesystem into React memory. [Dexie React live queries](https://dexie.org/docs/Tutorial/React)
- `react-rnd` is the current drag/resize dependency, but it should be treated as provisional. Its controlled `position`/`size` behavior and drag handle/cancel APIs are useful, yet the present integration has not established a reliable pointer contract. [react-rnd API](https://github.com/bokuweb/react-rnd)
- A custom Pointer Events controller is the preferred fallback for windows. `setPointerCapture()` ensures that a drag/resize session continues receiving pointer events after the pointer leaves the title bar or handle. [MDN pointer capture](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture)
- Use the already-installed Radix primitives for accessible popovers, menus, dialogs, context menus, and tooltips. Keep `cmdk` for the global command palette.
- Evaluate Microsoft’s `@fluentui/react-icons` for OS chrome. It is an official React wrapper for Fluent System Icons; portfolio-specific visuals can continue using a separate icon policy. [Fluent System Icons](https://github.com/microsoft/fluentui-system-icons/tree/main/packages/react-icons)
- Do not add FastAPI yet. A browser-local OS is the product. Add FastAPI only behind interfaces when a server-side requirement exists.

### Execution order after approval

1. Instrument and reproduce P0 interactions.
2. Fix window instance identity, hit testing, pointer capture, and work-area/maximize math.
3. Add snap preview and complete window lifecycle tests.
4. Implement opaque, accessible Start and a functional Quick Settings flyout.
5. Establish the command registry and global search contract.
6. Extract the shared Explorer shell and deepen filesystem interactions.
7. Add themes, wallpapers, motion preferences, icon policy, and high-contrast fallbacks.
8. Build the portfolio system apps and Easter eggs on top of the stable OS kernel.
9. Run visual, interaction, accessibility, performance, and persistence gates before calling this a premium OS release.

## Execution log

The implementation has started in the existing repository.

Completed foundation work:

- Migrated the application entrypoint from Vite to the Next.js App Router structure.
- Added the persisted Zustand OS store with lifecycle, window geometry, focus/z-order, desktop, settings, shortcuts, and command-dispatch foundations.
- Added the app registry, Windows-style taskbar, Start Menu, boot/lock/welcome flow, and shell styling.
- Converted the rendered window frame to controlled position/size props so drag and resize state can be persisted without remount drift.
- Added pure snap-zone geometry calculations for halves, top/bottom, and corners.
- Added the Dexie IndexedDB database, seeded portfolio filesystem, Recycle Bin transactions, descendant-safe folder deletion, and startup bootstrap.
- Added live Explorer and Recycle Bin windows backed by IndexedDB, including folder navigation, current-folder search, text preview, restore, and empty-trash actions.
- Connected edge/corner snap calculations to the controlled window frame while preserving the previous normal window rectangle for restore.
- Resolved the Next/Turbopack Tailwind v3 launch failure by disabling Tailwind's package-file-based preflight loader; the existing application reset remains active and Tailwind utilities continue to compile.
- Preserved existing portfolio windows and content while the OS shell is introduced around them.
- Rebuilt the Projects window as a coherent Windows Explorer-like portfolio workspace after browser visual review exposed a Finder/card hybrid.
- Replaced emoji-based OS chrome and project thumbnails with vector icons and branded project previews.
- Added a premium Explorer command/address surface, functional local filtering, list/grid switching, sorting, selection, and external project launch behavior.
- Updated the task checklist continuously and recorded the visual audit as a separate execution slice.

Current verification:

- ESLint passes cleanly.
- TypeScript passes.
- `npm run build` passes after an isolated production build.
- The development server compiles the homepage successfully and returns HTTP 200.

Immediate next implementation slice:

1. Replace the remaining react-rnd interaction dependency with a Pointer Events controller using pointer capture, while preserving the current public window contract.
2. Add snap preview feedback and complete window interaction tests.
3. Extract the Explorer command bar pattern for File Explorer and Recycle Bin.
4. Add the first Playwright smoke flows for boot, launch, drag/resize, reload persistence, and delete/restore.
5. Continue the OS shell with themes, search, keyboard navigation, and settings.

## Execution update — compositor and shell correctness slice

Implementation branch: `codex/premium-os-v2`  
Baseline commit: `8a976bd`

Completed in this slice:

- Added `useWorkArea()` so the compositor measures viewport width/height and reserves the taskbar work area instead of relying on legacy `28px`/`72px` offsets.
- Fixed the startup seeding lifecycle in `useWindowManager`; the initial Projects window no longer reopens after a user closes it.
- Added explicit control cancellation boundaries, pointer-down propagation guards, stable `data-window-control` attributes, and test IDs for title-bar controls.
- Upgraded maximize rendering to fill the measured work area while keeping the taskbar visible.
- Changed Start to a high-opacity surface with a dimming backdrop for predictable legibility over Explorer content.
- Added a functional Quick Settings flyout with Wi-Fi, Bluetooth, Focus, Night light, brightness, volume, Display, Accessibility, and Settings affordances.
- Replaced the react-rnd window interaction layer with a custom Pointer Events compositor: pointer capture, rAF-coalesced live geometry, safe cancellation, eight resize directions, and pointer-transparent snap previews.
- Verified in Chrome: Projects close, taskbar reopen, maximize/restore state, Start readability and Escape dismissal, Quick Settings open/close, and Bluetooth toggle.
- Verified in Chrome: title-bar drag, left-edge snap, and bottom-right resize using the new compositor.

Verification commands run:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run dev -- --hostname 127.0.0.1 --port 3000
```

All four commands pass after the custom compositor change. The remaining high-risk gaps are automated interaction coverage, unique instance IDs for multi-window apps, and centralized overlay/focus management.

## Execution update — Terminal integration core

The first Terminal slice is implemented as a client-only, Windows Terminal-inspired application. It is deliberately a Weru OS shell rather than a bridge to the user’s machine:

- `src/features/terminal/terminal-types.ts` defines serializable terminal sessions, output lines, command contexts, and command results.
- `src/features/terminal/terminal-parser.ts` provides a quote-aware tokenizer and command completion without `eval` or shell execution.
- `src/features/terminal/terminal-commands.ts` provides filesystem, portfolio, OS, and Easter-egg commands. Filesystem work is routed through the existing Dexie-backed virtual filesystem; OS changes are returned as typed effects.
- `windows/TerminalContent.tsx` provides tabs, command history, autocomplete, keyboard navigation, output copy/clear, prompt state, cancellation, and bounded local history persistence. `src/windows/TerminalContent.tsx` supplies the existing window-surface import boundary.
- `src/App.tsx` is the only bridge from terminal effects to Zustand/window-manager actions, keeping terminal commands independent from React layout internals.
- Terminal is registered in `WINDOW_CONFIGS`, `StartMenu`, `Taskbar`, `AppIcon`, and Spotlight so it can be discovered through the shell.

Verification completed for this slice:

```bash
npm run lint
npx tsc --noEmit
npm run build
curl.exe -I http://127.0.0.1:3000/
```

The next engineering slice is not FastAPI. It is to complete the app renderer contract for Notepad, Settings, and Photos, then add parser/command tests and Playwright flows for terminal launch, filesystem persistence, tab behavior, cancellation, and effect dispatch. Browser click-flow verification was attempted but the available computer-use runtime could not load its kernel assets in this execution.

The expanded Windows-profile, project-media, and visual-modernization execution ledger is maintained in [os_profile_filesystem_media_tasks.md](C:/Users/Admin/OneDrive/Desktop/weru_os/os_profile_filesystem_media_tasks.md). It supersedes the narrower next-slice description above for the filesystem/media/UI workstream while preserving the broader OS plan.

## Execution update — profile hierarchy and visual restraint slice

The next implementation slice is now underway on `codex/premium-os-v2`.

Completed:

- Added a central canonical virtual-path model for `C:\Users\Admin`, Desktop, Projects, Documents, Downloads, Pictures, Videos, Music, the Audio alias, and `C:\Windows\System32`.
- Seeded the virtual filesystem with the canonical hierarchy, hidden system nodes, a read-only `Weru Profile.json`, and a versioned layout marker.
- Added a retry-safe Visitor-to-Admin migration path that preserves the existing legacy profile ID and user-created child nodes instead of rewriting parent references.
- Added dynamic profile snapshot generation so `Weru Profile.json` reflects local settings, canonical paths, storage scope, node counts, and Recycle Bin counts without storing binary or host files.
- Updated Explorer’s address display and quick locations to use canonical Windows-style paths.
- Replaced the first layer of saturated gradients, glass surfaces, emoji system icons, and oversized rounded controls with neutral Windows-inspired surfaces and restrained blue/gray state colors.
- Replaced the desktop’s legacy macOS-style context-menu labels with Windows-style actions and wired New folder, New text document, and Open Terminal here to the virtual desktop model.
- Updated Terminal’s default session and `whoami` output from Visitor to Admin.
- Added the typed project-media manifest contract, bundled-media path validation, and the documented `public/media` asset layout without placing binary media in IndexedDB.
- Removed another active macOS/glass styling residue from command search and shared content surfaces, including saturated selection colors and large pill/card radii.

Verification completed:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The next slice is to make the desktop context menu node-aware, finish shortcut resolution for the Audio/media links, add the typed media manifest and bundled asset folders, and then register the Media Player application before returning to the remaining visual audit.

## Execution update — project workspaces and media playback

The project workspace slice is implemented on `codex/premium-os-v2`:

- Project activation now opens an in-OS Project Details window instead of navigating directly to GitHub or a live site.
- Window instances now carry project identity, allowing multiple different project detail windows while focusing an existing window for the same project.
- Project Details presents the canonical `C:\Users\Admin\Desktop\Projects\<Project Name>` path, project metadata, thumbnail fallback, media entries, and explicit external links.
- Manifest assets are represented once in canonical Videos/Music/Pictures nodes and exposed inside project folders through non-copying shortcuts.
- Shortcut resolution supports target IDs and paths with recursion protection.
- Media Player is registered as a Weru OS application and uses native video/audio controls without autoplay.
- Explorer navigation now has independent scrolling regions and a dedicated status bar to prevent item-count overlap.
- Project actions can open the associated virtual project folder in Explorer and set Terminal to the project’s canonical virtual cwd.

Quality gates pass:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Browser/Playwright interaction verification and real media fixtures remain the next quality slice.

## Execution update — browser verification completed for the project workspace slice

The local browser verification pass is complete for the currently implemented surfaces:

- Projects closes from the title-bar X and reopens from the taskbar.
- Clicking a project opens `Project details — Adventures` inside Weru OS rather than navigating externally.
- The project detail surface shows the canonical `C:\Users\Admin\Desktop\Projects\Adventures` path, description, technology stack, empty-media state, and repository link.
- Project detail maximize fills the browser work area above the taskbar and restore returns the prior geometry.
- The Folder action opens Explorer at the project’s canonical virtual folder and shows `README.md`.
- Terminal launches from the taskbar, accepts `help`, and lists the sandboxed canonical Admin filesystem with `ls`.
- Quick Settings opens from the tray chevron and exposes Wi-Fi, Bluetooth, Focus, Night light, brightness, volume, display, accessibility, and settings controls.
- Start opens as a readable surface and filters pinned apps when searching for `terminal`.

The live browser also confirms that the boot/guest layer can be dismissed before interacting with the desktop. No host navigation, process execution, or host filesystem access was involved.

Remaining quality work is intentionally explicit: add real media fixtures and manifest entries, verify native video/audio playback, test multiple project detail instances, add automated Playwright coverage, and run the responsive viewport/accessibility matrix.

## Final consistency contract

Weru OS now treats the virtual filesystem as the source of truth for portfolio navigation. Desktop shortcuts, Explorer, Start, Search, Taskbar, and Terminal must resolve the same `OpenTarget` contract. Projects are folders under `C:\Users\Admin\Desktop\Projects`; portfolio documents are protected Notepad-backed files on the Desktop; media lives in the profile Videos, Music, and Pictures folders; and Settings/Profile JSON remains browser-local through IndexedDB and localStorage. FastAPI is intentionally not required for this client-first release.

The detailed execution ledger is maintained in `os_final_consistency_tasks.md`. It must be updated alongside implementation and verification rather than treated as a static design document.

## Execution update — final consistency slice

- Added a shared target contract so Desktop, Explorer, Start, Search, Taskbar, and Terminal resolve the same folders, files, applications, media, and links.
- Projects now opens Explorer at `C:\Users\Admin\Desktop\Projects`; project folders contain README and Project Overview files; README files open in Notepad with their canonical paths.
- Portfolio documents are generated from a typed manifest and seeded as protected Desktop files: About Me, Skills, Experience, and Resume.
- Added browser-local profile namespacing for IndexedDB, OS settings, and terminal history, plus a layout migration path for older filesystem data.
- Added AppData and dynamic `Settings.json`, Desktop `.lnk` nodes, Notepad, Settings, and Explorer details-pane support.
- Fixed a reload-only Dexie failure by ensuring live query functions never invoke migrations or other readwrite transactions.
- Corrected the PostCSS plugin shape so both the normal Turbopack production build and the explicit Webpack production build complete successfully.
- Added protected filesystem mutations for Explorer, including in-OS naming/delete dialogs, collision-safe rename/copy/move, Recycle Bin protection, and Notepad Save As.
- Bumped the virtual layout migration to version 5 so older browser profiles regain missing project folders and project files.
- Added explicit Repository.url and Live Site.url nodes for project links, with an allowlist before external navigation.
- Added Vitest contract coverage for path normalization, terminal parsing/autocomplete, and external-target safety.

Verification completed on an isolated local port:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The final verification run completed successfully with Next.js 16.3.4. The only build output was the existing Browserslist freshness notice; it does not affect compilation or runtime behavior. `npm test` reports 3 test files and 6 passing tests.

Browser verification covered Desktop Projects → Explorer, project folder navigation, README → Notepad, protected About Me → Notepad, Settings, Start, Quick Settings, Terminal `projects`, maximize/restore, close, and reload recovery. The mutation and migration code now has production-build coverage; the remaining ledger items are a dedicated automated test runner, supplied media fixtures, and the final visual/accessibility matrix.
