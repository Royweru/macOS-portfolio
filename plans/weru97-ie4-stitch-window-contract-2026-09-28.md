# IE4 Stitch Window Contract — 2026-09-28

## Scope

Protect one directly observable outer-window invariant from Stitch's Internet Explorer screen while retaining the existing distinction between source/React structure tests and actual live visual comparison.

## Source and implementation

- Retained source: `Stitch Designs/html/windows_97_internet_explorer.html`.
- Stitch window dimensions: 940×680 CSS pixels (`w-[940px] ... h-[680px]`).
- Stitch window title: `case-study.url - Internet Explorer`.
- Active Weru configuration: `WINDOW_CONFIGS.ie4` currently uses the same title and 940×680 dimensions.
- Added a source-linked assertion in `src/apps/ie4/ie-source-contract97.test.ts` to fail if either the source geometry or active app configuration drifts.

## Verification

- `npx vitest run src/apps/ie4/ie-source-contract97.test.ts --pool=threads --maxWorkers=1 --no-file-parallelism`: 1 file / 4 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npx eslint src/apps/ie4/ie-source-contract97.test.ts`: passed.
- Full current-worktree suite: 71 files / 352 tests passed; full batched lint passed 222 TypeScript files; production build succeeded with only the existing stale Browserslist-data notice; `git diff --check` passed.

## Limits

This test proves the active window configuration matches the source declaration. It does not prove browser-rendered dimensions, toolbar/body pixel parity, responsive behavior, or external navigation. The Chrome extension was unavailable for this continuation, so no live screenshot comparison was attempted.
