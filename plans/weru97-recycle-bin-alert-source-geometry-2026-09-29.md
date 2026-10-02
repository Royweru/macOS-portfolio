# Weru 97 Recycle Bin Alert — Source Geometry Pass

## Scope

Continue Phase 9 of `plans/weru97-chapter-2-task-list.md` by aligning the independent Recycle Bin empty alert with its retained System Dialogs Stitch region. Do not empty or permanently delete the visitor's persisted Recycle Bin contents to force a browser-only test state.

## Source measurement

The preserved HTML was served at `localhost:3002` and measured in the existing Chrome-extension tab at a 1422×702 CSS viewport. The `data-purpose="dialog-recycle-alert"` region measured 287.998×124.375 px at (1070.232, 513.854), leaving 63.771 px to the right and bottom viewport edges. Its title bar measured 17.998 px. The source classes are `right-16 bottom-16 w-72`, giving the intended 64px / 64px / 288px contract.

## Implementation

The production alert is rendered into `#shell97-dialog-layer`, whose lower edge stops above the 46px taskbar. The source's 64px viewport-bottom gap therefore translates to an 18px bottom offset inside that layer. The CSS now uses `right:64px`, `bottom:18px`, and a 288px maximum width, with small-width and short-height clamps. A source-contract regression ties the source anchor to this layout rule.

## Verification and remaining work

- Raw Stitch geometry measured in the browser and matched mathematically against the shell-layer coordinate system. Live Weru inspection confirmed the Recycle Bin is empty and Empty is disabled; the inspection window was closed afterward.
- Focused alert tests passed (1 file / 3 tests). Full suite passed with `npx vitest run --maxWorkers=2` (79 files / 383 tests); `npx tsc --noEmit`, repository lint (236 TypeScript files), production build, and `git diff --check` passed. An initial uncapped Vitest run exhausted worker memory while the local preview processes were active; after stopping both temporary servers and limiting concurrency, the full run passed. Build emitted only the existing stale Browserslist-data notice.
- Both temporary local servers were stopped and ports 3001 and 3002 were verified clear.
- Do not use Empty or permanent Delete to trigger the alert without action-time confirmation. The live alert's visible state and Close/OK/Escape dismissal remain unverified; this task and the System Dialogs manifest remain partial until a safe user-approved trigger or non-destructive test fixture is available.
- No Recycle Bin entries, portfolio files, or other persisted user content are to be removed during this work.
