# Weru 97 Legacy Shell Cleanup — 2026-09-25

## Goal

Remove disconnected macOS/Windows 11 shell components and the obsolete snap-window adapter so the repository has one clear active desktop/window architecture: Weru 97's `Shell97` and shared `Window97` manager.

## Audit and changes

- Searched source imports and runtime style imports before deleting. No active imports referenced the old Dock, MenuBar, Spotlight, Sidebar, parallax hook, old Desktop/Window, ViewControls, old Windows taskbar/Start/Quick Settings, or old snap engine/work-area hook.
- Deleted those unused UI modules, the snap engine, and the unimported legacy `dock.css`, `menubar.css`, `window.css`, and `windows-shell.css` stylesheets. `src/app/globals.css` already loads the active Weru 97 stylesheet set and did not reference those files.
- Removed the unused `snapWindow` bridge and its `SnapSlot` type, obsolete menu-bar window metadata, and legacy dock/sidebar/menu data types/config fields. Kept `useWindowManager` because `src/App.tsx` still uses it to bridge the persisted OS store to active windows.
- Updated the root README and marked the initial Windows 11/macOS snapshot in the original architecture blueprint as historical; the Chapter 2 checklist remains authoritative.

## Verification

- Reference audit: no deleted module names, snap API, or removed legacy types/config keys remain in `src/` or the root README.
- `npm test -- --run`: 67 files / 306 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; Next.js emitted only its existing stale Browserslist-data notice.

## Boundaries

This is repository architecture cleanup, not proof of rendered fidelity. No live browser was started, no deployment was made, and no Stitch screenshot parity or per-app live pointer coverage is claimed. Those remain tracked as partial in `plans/weru97-chapter-2-task-list.md`.
