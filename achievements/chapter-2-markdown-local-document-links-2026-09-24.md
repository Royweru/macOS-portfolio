# Chapter 2 — Markdown Links to Local Documents (2026-09-24)

## Delivered

- Markdown Preview can route relative `.md` and `.txt` links to sibling/nested VFS text files in Notepad.
- Same-origin linked text assets can be resolved by their VFS `contentUrl`.
- External HTTP(S) links retain the existing separate-tab behavior; unsafe schemes, non-text targets, and attempts to traverse above the document folder are rejected.
- The central OS file-opening route is passed to Notepad from the window content layer.

## Files changed

- `src/features/filesystem/markdown-link97.ts`
- `src/features/filesystem/markdown-link97.test.ts`
- `src/features/filesystem/filesystem-service.ts`
- `src/apps/notepad/MarkdownPreview97.tsx`
- `src/apps/notepad/MarkdownPreview97.test.ts`
- `src/windows/NotepadContent.tsx`
- `src/App.tsx`
- `plans/weru97-markdown-local-document-links-2026-09-24.md`
- `plans/weru97-chapter-2-task-list.md`

## Verification and remaining work

- Full test suite: 36 files, 145 tests passed.
- TypeScript, lint, and production build passed; build retains the existing stale Browserslist notice.
- Automated path and render behavior is verified. Manual in-browser clicking is still required and was not claimed; localhost remained stopped.
