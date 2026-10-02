# Weru 97 Boot Brand Mark — 2026-09-27

## Direction

The raw Stitch boot page identifies itself as Windows 97 and uses the Windows four-color flag. The user has explicitly directed that the product is Weru 97 and that the Windows logo must not ship in the active experience. Keep the raw Stitch file unchanged as historical/reference input; treat the product identity as an intentional adaptation.

## Change

- Replaced the active boot splash's four-color flag component with a custom pixel-beveled green Weru `W` mark, visually aligned with the green Start-button wordmark.
- Preserved the source wrapper dimensions and shadow, splash composition, source-derived Weru 97 typography, and loading bar.
- Renamed the component and CSS classes from flag terminology to brand-mark terminology.
- Updated the boot source-contract regression to assert the Weru mark's W/green treatment and ensure it does not reproduce the Stitch flag SVG.
- Did not modify the retained raw Stitch HTML or its original logo.

## Verification

- `npm test -- --run src/boot/boot-source-contract97.test.ts` — 1 file, 9 tests passed.
- `npx tsc --noEmit` — passed with no diagnostics.
- On 2026-09-28, a fresh Chrome-extension QA load captured the full-viewport splash at 9/18 progress with the custom W mark visible. The mark reads as the intended Weru identity at the normal desktop viewport; mobile rendering and frame-by-frame pixel parity remain unverified. The browser blocks `file://` navigation, so the retained raw source was compared through the source-contract test rather than by opening it in the live tab. No exact pixel-parity claim is made.

## Files

- `src/boot/BootSequence97.tsx`
- `src/styles/boot.css`
- `src/boot/boot-source-contract97.test.ts`
- `plans/weru97-chapter-2-task-list.md`
- `achievements/chapter-2-boot-brand-mark-2026-09-27.md`
