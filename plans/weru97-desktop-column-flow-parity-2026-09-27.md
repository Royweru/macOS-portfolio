# Weru 97 Desktop Column-Flow Parity — 2026-09-27

## Finding

At a matched 1280×576 browser viewport, the preserved Stitch desktop showed seven shortcuts in its first column (My Computer through Internet). Weru 97 used an 80px row pitch, which wrapped Internet into the second column after six items and shifted Games, Recycle Bin, and Outlook Express down one row. The existing helper unit tests did not cover the effective 530px desktop work-area height shown by the live browser.

## Change

- Changed the active shortcut pitch from 80px to 72px, preserving Stitch's source order and column-first flow while retaining the user-requested 40px icon art.
- Set the clickable icon cell to 60px high, leaving 12px between cells at the 72px pitch; the existing 96px column pitch and 88px tile width preserve horizontal separation for labels.
- Kept the saved legacy 88px coordinate recognition in place so default seeded shortcuts continue to use responsive placement rather than being mistaken for user-custom positions.
- Added source/layout regressions at the observed 530px work area and other short/tall heights, including pairwise shortcut collision checks.

## Visual verification

- Rendered the unmodified raw `windows_97_os_desktop.html` from a temporary loopback static server rooted only at `Stitch Designs/html`.
- Captured the Stitch desktop and the live app in the same Chrome extension tab at 1280×576.
- After the fix, the live desktop shows My Computer, My Documents, Projects, Videos, My Music, My Pictures, and Internet down the first column; Games, Recycle Bin, and Outlook Express begin in the second column. The app remains full-width.
- Reopened My Documents and compared its live first-open frame with the source screen: both align near (240,60) at roughly 560×410. The Weru taskbar remains 46px tall by user request; source chrome is shorter. The app uses larger 40px artwork than Stitch's 32px art, also by user request.

## Validation and limits

- Focused layout/source tests: 2 files / 8 tests passed after updating one stale 80px assertion.
- Full suite: 69 files / 336 tests passed with `npm test -- --pool=threads --maxWorkers=1 --no-file-parallelism`. The first concurrently launched default run reported one worker-start error after 327 tests passed; the bounded serial retry completed without errors.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: passed all 217 TypeScript files in 28 batches.
- `npm run build`: passed; only the existing stale Browserslist data notice was emitted.
- The task remains partial: exact asset scale, selected/focus outline, keyboard-focus appearance, and the other Stitch screens still need comparison. This pass made no pixel-diff artifact.
