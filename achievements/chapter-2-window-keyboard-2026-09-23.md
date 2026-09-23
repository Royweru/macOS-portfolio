# Achievement — Explorer Keyboard Close Behavior

Date: 2026-09-23

## Scope

Correct the global Escape shortcut after browser QA showed it closed the focused Explorer when Escape was intended to dismiss the screensaver. The fix is intentionally limited to keyboard dispatch; it does not claim the full window-control matrix is complete.

## Implementation

- `src/App.tsx` no longer treats plain Escape as a command to close the focused window.
- The global desktop shortcut handler ignores keyboard shortcuts while the screensaver is covering the shell.
- Ctrl/Cmd+W remains the explicit global keyboard close action.

## Browser verification

Checked only the Weru 97 page in the in-app browser at `http://localhost:3000/` (CSS viewport 927×597, devicePixelRatio 1.5, zoom 1):

- Plain Escape left the open Explorer window visible.
- The Explorer title-bar X closed the window.
- Reopening Explorer from its desktop shortcut and pressing Ctrl+W closed it.
- The first-visit wizard was completed to expose the desktop controls; no portfolio/filesystem records were edited.

## Still unverified

- Escape while the screensaver is active has not yet been exercised in the browser.
- Close, drag, resize, focus, and taskbar behavior still require the full per-application matrix. This achievement covers Explorer only.
- No claim of Stitch visual parity is made by this interaction fix.
