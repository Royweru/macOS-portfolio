# Weru 97 — Find Files Dialog Functionality (2026-09-24)

## Goal

Make Find: All Files usable as a keyboard- and pointer-accessible search dialog over the virtual C: filesystem.

## Delivered behavior

- Trim the query and search through the shared VFS search service.
- Support Find Now and Enter-to-search.
- Present loading, no-results, and recoverable filesystem-error states.
- Allow result selection, explicit Open, double-click opening, and Enter-to-open from a focused result.
- Route selected results through `targetForNode` so folders, documents, shortcuts, and media retain their normal open behavior.
- Invalidate stale searches when the user edits the query or starts a new search; New Search clears and refocuses the input.
- Use a visible classic selection state and keyboard focus outline.

## Verification boundary

Tests cover query normalization, empty-query behavior, and the initial dialog's accessible controls. Full interactive browser testing and matched-viewport Stitch visual comparison remain open because the independent System Dialogs source artifact is missing. This slice does not claim the whole Run/Find acceptance task complete.
