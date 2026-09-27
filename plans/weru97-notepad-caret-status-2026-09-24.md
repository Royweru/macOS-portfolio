# Weru 97 Notepad Caret Status — 2026-09-24

## Goal

Make the Notepad status bar useful while reading or editing README and other text files by showing the caret's actual one-based line and column.

## Finding

The editor displayed the document's total number of lines as `Ln` and always showed `Col 1`, regardless of where the caret was. That made the status readout misleading. The editor itself is already styled at 16px monospace for readability; the active checklist had stale text claiming 14px.

## Implementation

- Added a pure caret-position helper that clamps selection offsets and handles LF, CRLF, and standalone CR line endings.
- Wired textarea selection, keyboard, click, and edit events to the helper; Notepad now displays the current `Ln` and `Col` values with an accessible label.
- Kept the existing 16px Courier-style editing surface unchanged.
- Corrected the Chapter 2 checklist's stale font-size statement and recorded this separately verifiable caret fix.

## Verification

- Focused helper tests: 3 passed, covering one-based positions, LF/CRLF/CR, and offset clamping.
- Full suite: 50 files / 199 tests passed.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build`: passed. Build emitted only the existing stale Browserslist data warning.
- `git diff --check`: passed; Git reported repository line-ending normalization warnings only.
- Live keyboard/pointer behavior was not separately exercised; it remains part of the Chapter 2 manual acceptance matrix.
- No local preview server was started.
