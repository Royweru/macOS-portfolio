# Chapter 2 — Desktop Shortcut and Taskbar Spacing (2026-09-23)

## Completed in this slice

- Widened desktop shortcut cells from 72px to 88px while preserving the existing 96px icon-column pitch and responsive column-first flow. Outlook Express now fits on one line without colliding with the neighboring desktop icon.
- Constrained taskbar window buttons to a 48px minimum and 220px maximum inside a flexing, horizontally scrollable strip. The quick-launch area and system tray/clock remain fixed-size so additional app buttons cannot paint over the time display.
- Added narrow-screen rules that keep the Start control, at least one quick-launch action, open-window strip, and clock visible while reducing nonessential quick-launch/status content.
- Inspected the supplied screenshot and current live browser view: the Explorer window starts to the right of the email shortcut, so no unverified window movement was introduced. The cramped caption cell was the visible desktop-icon issue.

## Evidence

- Reused the existing Chrome extension tab at `http://localhost:3000/`; no new browser tab or native computer UI was opened.
- Live screenshot at 1421×644 after CSS hot reload showed Outlook Express on one line, the adjacent My Computer shortcut unobstructed, all four restored task buttons visible, and the system clock in its own space.
- Follow-up after refreshing the same tab on 2026-09-23 again showed the Outlook Express caption in its own desktop cell and the restored task buttons ending before the fixed tray/clock. Opening and cancelling the Shutdown dialog did not displace desktop shortcuts or cover the clock.

## Correction logged 2026-09-23

A later live DOM audit found that the persisted Outlook Express button itself still overlapped Games despite the caption-cell width improvement above. The earlier “non-overlapping icon cell” verification was incomplete. The dedicated version-20 position migration and fresh browser measurements now verify the two icons are in separate rows; see `chapter-2-outlook-games-overlap-2026-09-23.md`.
- TypeScript passed (`npx tsc --noEmit`).
- ESLint passed (`npm run lint`).
- Vitest passed: 19 files / 88 tests (`npm test -- --run`).
- Production build passed (`npm run build`). Build emitted the existing stale Browserslist data notice only.

## Remaining

- The screenshot proves the current four-window layout; densely populated taskbar and narrow viewport interactions still require the Chapter 2 responsive/multi-window matrix.
- The icon sizing/caption correction is not a matched-viewport Stitch comparison. Desktop visual parity remains partial, and app/boot/source-by-source parity remains open.

Plan and active tracker: `plans/weru97-desktop-stitch-implementation-2026-09-23.md`, `plans/weru97-chapter-2-task-list.md`.
