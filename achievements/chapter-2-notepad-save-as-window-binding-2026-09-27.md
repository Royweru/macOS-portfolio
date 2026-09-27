# Chapter 2 — Notepad Save As Window Binding (2026-09-27)

## Verified change

Save As now moves the existing editor window to the created file and updates its title. The original file remains intact. About, Skills, and Experience are supported because those windows also render Notepad; the state action rejects unrelated windows. When no host callback exists, the standalone editor retains the source binding and dirty state rather than claiming the source was saved.

## Changed files

- `src/features/os/os-store.ts`
- `src/features/os/os-store.test.ts`
- `src/windows/NotepadContent.tsx`
- `src/apps/notepad/Notepad97.tsx`
- `src/App.tsx`
- `plans/weru97-chapter-2-task-list.md`
- `plans/weru97-notepad-save-as-window-binding-2026-09-27.md`

## Validation

- Full automated suite: 69 files / 336 tests passed.
- TypeScript: passed.
- Full lint: 217 TypeScript files passed.
- Production build: passed with the existing stale Browserslist data notice.
- Live Save As, edit-after-Save-As, and reload persistence still need browser verification; the parent Notepad workflow remains partial.
