# Weru 97 Screensaver Idle Timer — 2026-09-28

## Scope

Make the actual application inactivity timer independently testable without changing the user's configured timeout or adding a debug bypass.

## Implementation

- Extracted the existing `mousemove`, `keydown`, and `pointerdown` timer behavior from `App.tsx` into `attachScreensaverIdleTimer97`.
- Preserved the configured timeout in seconds, activation callback, activity callback that dismisses a saver, and cleanup when the setting is disabled or the app effect unmounts.
- Added fake-timer tests for the exact timeout boundary, each of the three reset events, and idempotent cleanup.

## Verification

- Focused screensaver tests: 2 files / 9 tests passed.
- Full suite: 73 files / 361 tests passed.
- `npx tsc --noEmit --incremental false` passed.
- `npm run lint` passed all 226 TypeScript files in 29 batches.
- `npm run build` passed with only the existing stale Browserslist-data notice.
- `git diff --check` passed with the repository's existing LF-to-CRLF working-copy notices.

## Remaining acceptance

The Chrome-extension live idle observation was inconclusive after the extension disconnected during the configured delay. The active worktree's rendered screensaver appearance, actual idle activation, Escape/pointer dismissal, and preservation of the covered window still require a stable live browser session.

## Files

- `src/App.tsx`
- `src/boot/screensaver-idle97.ts`
- `src/boot/screensaver-idle97.test.ts`
- `plans/weru97-chapter-2-task-list.md`
- `achievements/chapter-2-screensaver-idle-timer-2026-09-28.md`
