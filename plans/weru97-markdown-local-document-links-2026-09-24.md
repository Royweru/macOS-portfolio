# Weru 97 — Markdown Links to Local Text Documents (2026-09-24)

## Behavior contract

- HTTP(S) links in Markdown Preview continue opening in a separate top-level browser tab.
- Same-folder and nested relative `.md`/`.txt` links resolve to text files in the current VFS folder and open through the normal OS target router, which presents the target in Notepad.
- Same-origin public text assets can also resolve by their `contentUrl` and open as their VFS-backed Notepad file.
- Fragment-only links remain in the current document. Missing targets, unsafe URL schemes, encoded traversal, parent-folder traversal, and non-text targets are not opened.
- The original Markdown source and the target document content remain separate files; the README does not need to embed the linked document's contents.

## Implementation

- Added a pure VFS resolver for Markdown text links and an async filesystem-service wrapper.
- Passed the central OS `onOpenTarget` route through `App` into Notepad.
- Added active local-text anchors to Markdown Preview only when a Notepad routing callback is available.
- Preserved the existing HTTP(S) new-tab path and existing restrictions on unsafe or remote image content.

## Verification

- Resolver tests cover sibling files, nested paths, same-origin linked text assets, and rejection of external, unsafe, traversal, missing, and non-text targets.
- Markdown Preview tests cover routing-enabled and routing-disabled rendering.
- Full validation: 36 test files / 145 tests passed; `npx tsc --noEmit`, `npm run lint`, and `npm run build` passed. The build still reports the existing stale Browserslist database notice.
- No localhost server was started, no deployment was performed, and no manual browser click is claimed; that interaction remains open in Chapter 2 acceptance.
