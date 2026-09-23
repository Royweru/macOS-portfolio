# Chapter 2 — Explorer and Filesystem Path Correction (2026-09-23)

## Verified issue

The user's screenshot showed the generic “File Explorer” and “My Documents” windows at the same `C:\My Documents` path. The active renderer used a global `explorerFolderId` fallback, so a folder opened in one window could be rendered in another instance that had no persisted `locationId`. The active seed also placed `Videos` and `Screenshots` under My Documents even though the shell presents them as separate libraries.

## Changes

- Removed the global Explorer folder fallback. Each window reads its own `locationId`; generic File Explorer opens `C:\`.
- Moved the `Videos` folder to `C:\Videos` and created `C:\My Pictures\Screenshots`.
- Kept My Documents limited to its four portfolio text files.
- Added the My Pictures VFS shortcut and made the desktop My Pictures icon open that folder.
- Bumped filesystem layout version to 8. Existing library folders are reparented by stable node IDs; their descendants and user-created content are preserved.
- Migrated persisted Videos and My Pictures shell shortcuts to their canonical targets.

## Evidence

- Live browser accessibility tree at `http://localhost:3000/` showed:
  - File Explorer address: `C:\`
  - My Documents address: `C:\My Documents`, with `Resume.txt`, `about_me.txt`, `experience.txt`, and `skills.txt`
  - My Pictures address: `C:\My Pictures`, containing `Screenshots`
  - Screenshots address: `C:\My Pictures\Screenshots`, containing the existing `windows_97_simulation_icons.jpg`
  - Videos address: `C:\Videos`
- After the newly reported screenshot, a normal reload of that same localhost tab retained the corrected layout. Its accessibility tree again showed File Explorer at `C:\` and My Documents at `C:\My Documents` with four text files; no browser storage was cleared. The attached image shows the pre-correction state, not the current rendered state.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm test -- --run`: 16 test files, 69 tests passed at the time of this original correction.
- `npm run build`: passed. Existing stale Browserslist data notice remains.

## Remaining work

This fixes the reported filesystem/window confusion only. It does not close the broader Chapter 2 tasks for one-by-one Stitch parity, boot screenshot comparison, remaining app visual QA, or the full per-app interaction matrix.

## Follow-up correction — persisted Explorer and legacy library folders (2026-09-23)

The later screenshot contradicted the earlier statement that the issue was fully resolved. Source review identified two remaining migration gaps:

- Persisted OS state was still schema version 16. The singleton window id `explorer` could retain `locationId: folder-my-documents`; reopening it only focused the saved instance.
- The filesystem migration corrected canonical folder IDs but did not move contents out of additional legacy `Videos`/`Screenshots` folder records under My Documents.

Fixes now in the worktree:

- Bumped the persisted OS state schema to 17 and migrate the singleton File Explorer to the drive root while preserving the separate My Documents window.
- Reopening the singleton Explorer with an explicit location now refreshes its saved location, and the keyed Explorer content remounts when that externally requested location changes.
- Bumped the filesystem layout version to 9. Legacy duplicate library folders are merged into the canonical Videos/Screenshots locations; all descendants retain their IDs and data, and only emptied duplicate folder records are deleted.
- Added regression tests for the saved-window migration, reopen behavior, and nested filesystem-content preservation.

Follow-up verification:

- Chrome browser-extension accessibility tree at `http://localhost:3000/` showed File Explorer at `C:\`, My Documents at `C:\My Documents` with four portfolio documents, My Pictures at `C:\My Pictures` with Screenshots, and Videos at `C:\Videos`.
- `npx tsc --noEmit`: passed; `npm run lint`: passed.
- `npm test -- --run`: 16 test files, 75 tests passed.
- `npm run build`: passed. The existing stale Browserslist-data warning remains.
- No browser storage was cleared. Browser verification used a single localhost tab through the extension.
- The active browser profile already had no duplicate Videos/Screenshots folders inside My Documents, so the IndexedDB branch that merges such duplicates was not directly exercised with affected data. Its pure migration planner is covered by nested-content preservation tests; keep that migration acceptance partial until an affected-profile integration fixture or naturally affected profile verifies it.
