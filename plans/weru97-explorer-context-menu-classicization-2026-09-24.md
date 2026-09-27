# Weru 97 Explorer Context Menu Classicization — 2026-09-24

## Finding

The active `ExplorerContent` still rendered its right-click menu with a Tailwind white/slate panel, soft `shadow-lg`, and Lucide icons. The classic stylesheet also globally suppressed soft shadows, leaving the menu visually flat. The same component used generic utility markup for its empty state, errors, and create/rename/delete overlays. This contradicted the chapter's classic-path cleanup claim.

## Implementation

- Added `ExplorerContextMenu97`, a dedicated Win97 menu surface with standard file actions and blank-folder actions, separators, keyboard-native menu buttons, and a correctly disabled Paste item when the clipboard is empty.
- Replaced the Explorer address chevron's generic vector icon with a text glyph; removed the remaining Lucide import from `ExplorerContent`.
- Replaced modern utility markup for empty, error, naming, and delete-confirmation surfaces with scoped Explorer classes.
- Added gray classic surfaces, white/dark bevel borders, hard two-pixel shadows, navy selection, gray disabled state, sunken input, and classic dialog buttons in `src/styles/stitch97.css`.

## Verification

- SSR render tests cover the item context menu and folder context menu, including the disabled Paste state and absence of modern Tailwind card classes.
- TypeScript and repository lint passed.
- Full suite passed: 39 test files / 150 tests.
- Production build exited 0; it emitted the existing stale Browserslist database notice.
- `git diff --check` reported no whitespace errors (only the repository's existing LF/CRLF normalization notices).
- A new live browser screenshot was not captured; localhost remains stopped, so matched-viewport Stitch comparison remains open.

## Scope note

The repair preserves all existing action callbacks and menu placement logic. It does not claim the overall Explorer/Notepad Stitch parity task is complete.
