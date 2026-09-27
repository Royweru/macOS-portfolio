# Explorer source-specific geometry — 2026-09-24

## Finding

The retained Stitch screens define different first-open rectangles, but active `WINDOW_CONFIGS.explorer` was 560×410 for every Explorer. That accidentally used the My Documents variant size for the primary Explorer and could not express the two-window composition.

## Implementation

- Set the general Explorer default to 620×430, matching `window-explorer` in `windows_97_project_explorer_and_notepad_view.html`.
- Keep Notepad at its source size of 580×450.
- Route `C:\` / My Computer to the dual-screen background rectangle `(60,40; 440×320)`.
- Route `C:\Projects` to its foreground rectangle `(240,90; 660×440)`.
- Preserve the first-visit and direct My Documents rectangle `(240,60; 560×410)`.
- Leave other folder windows on the general Explorer default; window-manager viewport clamping remains authoritative.
- Add a regression that reads the unmodified local Stitch HTML and checks source dimensions, active defaults, and location-to-rectangle routing.
- Mark the affected Stitch manifest rows visually partial until a matched-viewport browser capture verifies the rendered result.

## Verification

- Focused Explorer geometry, app registry, and OS-store tests: 3 files / 43 tests passed.
- Full test suite: 40 files / 153 tests passed.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; emitted only the existing stale Browserslist database notice.
- No localhost server was started and no live screenshot was captured; visual manifest states therefore remain partial.
