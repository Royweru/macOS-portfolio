# Weru 97 Screensaver Motion and Exit Regression — 2026-09-28

## Scope

Harden the existing screensaver motion/input lifecycle and add focused tests. This is a narrow Chapter 2 reliability slice; it does not claim the boot/screensaver phase or Stitch visual-parity work is complete.

## Implementation

- Extract starfield advancement into `src/boot/screensaver-motion97.ts` so reduced motion can be verified independently: stars remain unchanged when enabled, while normal motion advances depth and respawns stars at the near plane.
- Extract input listener setup/cleanup into the same helper. Pointer-down, mouse movement, or keyboard input exits at most once, removes sibling listeners immediately, and supports cleanup when the component unmounts before input.
- Wire `Screensaver97.tsx` to those helpers while retaining its full-viewport canvas, resize listener, and requestAnimationFrame lifecycle. The helper uses a distinct filename from `Screensaver97.tsx` to avoid case-insensitive Windows filename collisions.

## Verification

- Focused: `npx vitest run src/boot/screensaver-motion97.test.ts` — 1 file, 4 tests passed.
- Full suite: `npm test -- --run --pool=threads --maxWorkers=1 --no-file-parallelism` — 72 files, 356 tests passed.
- `npx tsc --noEmit --incremental false` — passed.
- `npm run lint` — passed all 224 TypeScript files in 28 batches.
- `npm run build` — passed; Next.js printed only the existing stale Browserslist database notice.
- `git diff --check` — passed; Git emitted existing LF-to-CRLF working-copy notices.

## Remaining acceptance

- A browser-extension attempt loaded the current worktree at localhost:3001 and left the desktop idle for approximately the configured five-minute timeout. The extension disconnected before the final capture; after reconnect the desktop was visible. Because reconnect may itself have generated input, this result is inconclusive, not a pass or confirmed implementation failure.
- Live browser verification that Escape/input dismisses the actual saver without closing or altering the covered window.
- Live verification of reduced-motion preference in the rendered overlay and inspection of its full-viewport appearance against available references.
- Broader boot/saver sequence, touch, and reload/persistence checks remain tracked as partial in `plans/weru97-chapter-2-task-list.md`.

## Files

- `src/boot/Screensaver97.tsx`
- `src/boot/screensaver-motion97.ts`
- `src/boot/screensaver-motion97.test.ts`
- `plans/weru97-chapter-2-task-list.md`
- `achievements/chapter-2-screensaver-motion-and-exit-2026-09-28.md`
