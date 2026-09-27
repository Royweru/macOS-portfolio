# Persisted Notepad Title Reconciliation (2026-09-24)

## Observed defect

The deployed desktop restored a Markdown README body as `README.md` while its saved window title still said `README.txt`. The body and VFS identity were current; the title was stale persisted OS metadata.

## Change

- After filesystem bootstrap, resolve `fileId` values for restored Notepad windows and compare their current VFS filenames with the saved window titles.
- Update only mismatched Notepad window titles; do not modify file nodes, content, positions, or other persisted profile data.
- When an already-open keyed window is reopened, refresh explicitly supplied metadata (title, file ID, path, and read-only state) before focusing it.
- Keep media and non-file window titles outside this repair.

## Verification

- Pure planner test confirms only stale Notepad titles are repaired.
- OS-store test confirms reopening a keyed Notepad window refreshes its filename and read-only metadata.
- Full project tests, TypeScript, lint, and production build are recorded in the achievement after verification.
- Live browser confirmation is still needed after deploying the workspace change; no localhost runtime is started for this pass.
