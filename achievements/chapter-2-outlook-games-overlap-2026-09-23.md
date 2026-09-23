# Chapter 2 — Outlook Express / Games Desktop Collision (2026-09-23)

## Defect

The live `http://localhost:3000/` desktop rendered Games and Outlook Express in the same cell. At the captured 1422×644 viewport, their icon buttons both began on row 1 in column 2 (Games at approximately x=108, Outlook Express at x=104); their 88px-wide button rectangles overlapped by 84px. This disproved the earlier claim that enlarging the label cell alone had eliminated all shortcut overlap.

## Correction

- Moved Outlook Express's canonical persisted default to the existing responsive-flow marker used by built-in shortcuts.
- Added OS-state version 20 migration that repairs only the generated legacy Outlook position `(104, 12)` and preserves other user-customized shortcut coordinates.
- Added a regression test for the version-19 collision and custom-coordinate preservation.
- Updated the Chapter 2 tracker with the measured cause and verification requirement.

## Verification

- Before: read-only live DOM measurements showed Games and Outlook Express overlapping in the same cell.
- After: reloaded the existing Chrome extension tab at 1422×644. Games measured at `(108, 12)` and Outlook Express at `(108, 172)`; both cells are 88×72 logical pixels and have no rectangle intersection (8px vertical clearance).
- Targeted tests: `src/features/os/os-store.test.ts` and `src/shell/desktop-layout97.test.ts` passed, 40/40 tests.
- TypeScript: `npx tsc --noEmit` passed.
- Lint: currently fails on an unrelated pre-existing `no-useless-escape` at `src/data/stitch-screen-manifest.ts:29:1155` (`\\P`); this fix did not touch that file.
