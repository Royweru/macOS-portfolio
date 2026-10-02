# Weru 97 Window Layer and Icon-Safe Placement — 2026-09-28

## Purpose

Fix two live-shell issues discovered while continuing Chapter 2: a maximized window could cover the taskbar, and a source-positioned My Computer Explorer could cover desktop shortcuts. The change must preserve source window dimensions on wide screens, retain the full-width shell, and avoid resetting the user's saved filesystem/profile state.

## Implementation

- Give `.window-manager97` a definite work-area height below the 46px taskbar and its own stacking layer below shell chrome. The taskbar is above windows; menus/dialog layers retain their existing higher levels.
- Add `positionWindowClearOfShortcuts97()` at the common first-open boundary. On wide viewports, newly opened source-positioned windows move to at least x=240, to the right of both desktop shortcut columns. If there is not enough width for the original window plus that rail, reduce only the window width as necessary while respecting the 240px minimum; preserve source sizes when they fit.
- Do not rewrite existing saved window rectangles. User-positioned windows remain under user control.
- Add geometry and stylesheet regressions for shortcut-rail avoidance and taskbar/window layer ordering.

## Browser verification

Used only the existing Chrome browser-extension QA tab at `http://localhost:3001/` with a 1422×702 viewport. No native computer UI or extra browser tab was used.

- Opened a disposable My Computer Explorer. It appeared at x=240, retained its 440×320 source size, and did not cover the desktop shortcut columns.
- Maximized it, reloaded the page, and confirmed the taskbar remained visible; restored from the title-bar context menu.
- Minimized it, restored it from the taskbar, dragged by the title bar, resized from the southeast corner, and closed with X.
- Opened Outlook Express from its desktop shortcut. The compose window did not overlap the shortcut; its X closed it. No message was sent.
- Closed only the temporary Explorer and compose windows, preserving the previously open Adventures, README.md, and skills-used.txt windows.
- Stopped the temporary development server after the browser pass.

## Validation

- `npx tsc --noEmit --incremental false`: passed.
- `npm test -- --run --pool=threads --maxWorkers=1 --no-file-parallelism`: 71 files / 349 tests passed.
- `npm run lint`: passed for all 222 TypeScript files.
- `npm run build`: passed. Next reported the repository's existing stale Browserslist/caniuse-lite data notice.
- `git diff --check`: passed (Git emitted its existing LF-to-CRLF working-copy notices).
- Confirmed port 3001 has no listening process after the browser pass.
- Full app-specific window-control and touch matrices remain open; this evidence does not establish per-app Stitch parity.
