# Weru 97 Boot Readiness Gate and Splash Fade — 2026-09-27

## Finding

The boot completion callback runs after the BIOS, starting screen, and splash progress. If filesystem bootstrap is still incomplete at that point, the prior logic moved to `Starting Weru 97`, marked the boot skipped, then called `finish(false)` as soon as readiness changed. That could bypass the source-sized Weru logo splash and its 800ms transition, making the startup sequence depend on IndexedDB timing.

## Change

- Record whether the pending completion requested an animated exit.
- When completion reaches the logo stage before filesystem readiness, freeze progress at 100% and keep the splash visible instead of replacing it with the starting screen.
- When filesystem readiness arrives, honor the pending animated exit so the desktop is revealed under the full 800ms fade.
- Preserve the existing immediate skip semantics for BIOS/starting stages; those wait on the starting screen when readiness is pending.
- Add a pure waiting-stage regression and a source contract tying the pending animation intent to the component's ready callback.

## Verification

- Focused boot-sequence/source-contract tests and TypeScript passed during implementation; a complete test/lint/build rerun is recorded in the Chapter 2 tracker.
- Browser-extension review in one Chrome tab showed the full-screen BIOS, `Starting Weru 97`, and populated desktop. On 2026-09-28, a fresh QA load captured the splash at 9/18 segments with the Weru mark visible; the existing Adventures Explorer and README/skills windows were then restored in the shell.
- The readiness-lag branch was not naturally triggered with the already-populated local filesystem, so its runtime behavior is covered by helper/source regressions rather than a forced browser simulation. Exact splash fade timing, preload behavior, and reduced-motion transition still need dedicated live checks. Chrome blocks direct `file://` navigation; source geometry is therefore verified with the retained-HTML contract tests, not a same-tab raw-source screenshot.
- The temporary localhost:3001 server will be stopped after verification; browser-origin VFS data was not cleared or modified.

## Files

- `src/boot/BootSequence97.tsx`
- `src/boot/boot-skip.ts`
- `src/boot/boot-sequence97.test.ts`
- `src/boot/boot-source-contract97.test.ts`
- `src/data/stitch-screen-manifest.ts`
- `plans/weru97-chapter-2-task-list.md`
- `achievements/chapter-2-boot-ready-gate-fade-2026-09-27.md`
