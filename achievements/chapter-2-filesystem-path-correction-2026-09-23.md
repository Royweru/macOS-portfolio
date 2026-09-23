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
- `npm test -- --run`: 16 test files, 69 tests passed.
- `npm run build`: passed. Existing stale Browserslist data notice remains.

## Remaining work

This fixes the reported filesystem/window confusion only. It does not close the broader Chapter 2 tasks for one-by-one Stitch parity, boot screenshot comparison, remaining app visual QA, or the full per-app interaction matrix.
