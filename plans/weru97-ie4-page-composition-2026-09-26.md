# IE4 Stitch Page Composition — 2026-09-26

## Scope

Continue the Chapter 2 one-screen-at-a-time comparison for Stitch screen `0de14a31211048eca172e442e500ec10`, the Internet Explorer page. Preserve the full-width Weru shell and the 940×680 source window contract; this correction applies only to the content viewport inside IE.

## Source evidence and discrepancy

The retained HTML `Stitch Designs/html/windows_97_internet_explorer.html` defines:

- A 940×680 IE window, constrained by `max-width: 98%` and `max-height: 96%`.
- A sunken page viewport with `m-1 p-3`: 4px outer margin and 12px content padding.
- A centered `max-w-2xl` column, which is 672px at the source's default Tailwind scale.
- A diagonal construction stripe with 12px color bands and a raised gray label nested inside the sunken stripe surface.

The React page had omitted the centered inner column and let its banner and link directory span the full available window width. Its generic page rule also used 8px margin and 14px padding, while the construction callout had a single text layer and a 10px stripe cadence.

## Implemented correction

- Added `.win97-ie-page-content` around the page content with a 672px maximum width, auto horizontal margins, centered alignment, and the source vertical flow.
- Set the IE page viewport to 4px margin and 12px padding, retaining its flex sizing and scroll behavior.
- Restored the source's nested raised construction label and 12px diagonal stripe cadence.
- Kept current Weru copy, real link destinations, application behaviors, and full-width outer desktop intact; raw Stitch HTML remains unchanged.
- Extended `ie-source-contract97.test.ts` to compare raw source markers, React structure, and CSS dimensions/appearance.

## Verification

- IE focused tests: 3 files / 10 tests passed.
- Complete Vitest suite: 68 files / 317 tests passed with `npx vitest run --maxWorkers=1`.
- `npx tsc --noEmit --incremental false`: passed.
- Targeted ESLint on the changed TSX and test files: passed.
- `npm run build`: passed.
- Fresh repository-wide `npm run lint`, `npx eslint src`, and the sequential 18-file source batches exhausted Node memory (the batch run reached 126 of 210 files). This is not recorded as a pass. The default parallel Vitest attempt also exhausted worker memory, then passed with one worker.
- No browser tab or localhost server was opened for this source-level correction. Matched-viewport screenshot comparison remains unverified.

## Remaining IE parity work

Keep the manifest's visual and functionality status partial until a matched-viewport browser comparison and remaining IE behavior checks (history/home/visitor fallback, typed-address handoff and popup-block recovery, and print preview) have evidence. This source geometry correction alone does not complete IE or Chapter 2 parity.
