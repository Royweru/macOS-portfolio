# Chapter 2 — Persisted Notepad Title Repair (2026-09-24)

## Delivered

- Reconciled persisted Notepad window titles against filenames returned by the VFS once filesystem bootstrap completes.
- Existing keyed windows now refresh explicitly supplied file metadata when reopened.
- Only window metadata is changed; the file contents, filesystem records, positions, and unrelated profile state are preserved.

## Verification

- Focused tests: 2 files, 38 tests passed.
- TypeScript and lint passed.
- Full suite: 35 test files, 140 tests passed.
- Production build: passed; existing stale Browserslist database notice remains.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.

## Still open

- Verify in the deployed/browser runtime that an already-restored README window displays `README.md` consistently in its title bar and taskbar after deployment.
