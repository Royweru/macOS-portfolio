# IE4 keyboard shortcuts — 2026-09-24

## Contract

Wire the shortcuts already printed in the reconstructed Internet Explorer menus to those same commands. Keep ordinary text-editing shortcuts native when a text control has focus.

## Implementation

- Added a pure shortcut resolver for Ctrl/Command+N/L/P/A/C, Alt+Left/Right/Home/F4, and F5.
- Routed resolved commands through the existing menu-command dispatcher so keyboard and menu actions share behavior.
- Preserved Ctrl/Command+A and C for focused input, textarea, select, and contenteditable controls.

## Verification

- Focused IE regressions: 2 files / 8 tests passed.
- TypeScript and scoped ESLint passed.
- Full repository gates passed on 2026-09-24: `npx tsc --noEmit`, `npm run lint`, `npm test -- --run` (58 files / 224 tests), and `npm run build`. Build emitted the existing stale Browserslist-data warning. `git diff --check` passed with line-ending normalization warnings only. No local server or browser was started.

## Remaining

Live shortcut behavior and matched-viewport IE4 comparison remain part of the broader Chapter 2 browser acceptance.
