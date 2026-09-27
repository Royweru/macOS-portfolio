# Weru 97 Recycle Bin Empty Alert — Stitch Conversion

## Source contract

The retained System Dialogs Stitch source (`Stitch Designs/html/windows_97_system_dialogs_properties.html`) contains a distinct bottom-right `Recycle Bin` alert: gray hard-beveled panel, blue title bar with a Close control, blue information icon, 11px message “The Recycle Bin is empty. Make better life choices.”, and a centered OK button. It is an informational state, not permission to skip confirmation for permanent deletion.

## Implementation

- Added the source-shaped floating alert to a dedicated shell-level dialog layer at the bottom-right of the desktop work area, above windows and clear of the taskbar. It is portaled out of the Recycle Bin window so it is not clipped by that app, and has Close, OK, and Escape dismissal.
- Kept the existing destructive confirmation dialog as the first step for Empty Recycle Bin and permanent delete.
- Show the informational alert only after a successful Empty action or permanent deletion of the final trash entry.
- Retained the normal initial empty-bin listing; it does not force a modal on first open.

## Verification

- `src/apps/recycle-bin/RecycleBinEmptyAlert97.test.ts` checks the reference title, message, info icon, and dismissal controls; `src/shell/Shell97.test.ts` checks that the desktop dialog layer exists between window content and the taskbar.
- Focused after the layer correction: Shell97 and Recycle alert tests passed (2 files, 3 tests).
- The action policy is tested for emptying a non-empty bin, emptying zero entries, deleting the final entry, and deleting when entries remain.
- Full gates passed after implementation: TypeScript, lint, 32 test files / 131 tests, and production build. The build reports the existing stale Browserslist database notice.
- Fresh full validation after the shell-layer correction: `npx tsc --noEmit` passed; `npm run lint` passed; `npm test -- --run` passed (32 files, 131 tests); `npm run build` exited 0 with the existing stale Browserslist database notice.
- Matched-viewport comparison and live click/Escape dismissal remain unverified; the Chapter 2 visual/functionality status therefore remains partial.
