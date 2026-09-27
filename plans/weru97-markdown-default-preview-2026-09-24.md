# Weru 97 Markdown Documents Open Rendered — 2026-09-24

## Goal

Make linked project README files useful immediately: opening a `.md` document should display its rendered headings, formatting, and links, not an intimidating wall of Markdown syntax.

## Change

- Notepad now identifies Markdown by MIME type or `.md` extension and initializes that document in the rendered Preview surface.
- The `Source` control switches back to the editable Markdown text area; plain `.txt` documents continue to open as ordinary text.
- Rendered external HTTP(S) links continue to use safe `_blank`/`noopener noreferrer` attributes, while relative Markdown document links remain routed through Weru's VFS handler.
- Added server-render regressions confirming the default Markdown presentation/link contract and preserving the plain-text surface.
- Kept both the editable Notepad textarea and rendered Markdown preview at a readable 16px baseline; a source-CSS regression prevents accidental shrinkage.

## Verification

- Focused Notepad initial-view and caret tests: 5 passed; the current CSS-size contract is covered in `MarkdownPreview97.test.ts`.
- Fresh full suite: 65 files / 285 tests passed; direct TypeScript validation, `npm run lint`, and `npm run build` passed. Build emitted the existing stale Browserslist data warning.
- `git diff --check` passed before the final documentation-only updates; Git reports repository LF-to-CRLF normalization warnings.
- The published site was observed serving an older README and older `.url` behavior; do not claim deployment parity until the updated build is published and checked.
- No local server was started.
