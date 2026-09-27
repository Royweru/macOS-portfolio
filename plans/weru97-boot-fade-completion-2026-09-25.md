# Weru 97 Boot Fade Completion — 2026-09-25

## Finding

The preserved Stitch boot screen sets the splash transition to `opacity 0.8s ease-in-out`, but its `transitionToDesktop()` handler sets `display: none` after 700ms. The React implementation had copied the 700ms removal timer, cutting the CSS fade short.

## Change

- Keep the Stitch-authored 800ms CSS transition unchanged.
- Wait 800ms before removing the React splash, for both normal boot completion and logo-stage skip.
- Keep BIOS/Starting-stage skip immediate.
- Add a source-contract regression that records the Stitch 700ms script timer separately from its 800ms CSS duration and requires Weru to wait for the full CSS duration.

This intentionally corrects an internal Stitch timing inconsistency to avoid a visible fade snap; product branding and all other boot timings are unchanged.

## Verification

- Focused boot source/transition suites: 3 files / 12 tests passed.
- Full Vitest suite: 67 files / 306 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; the existing stale Browserslist data warning remains.
- `git diff --check`: passed; Git printed existing LF-to-CRLF normalization notices.
- No browser or localhost session was started; live visual transition verification remains open.
