# Chapter 2 — IE4 Stitch Structure Follow-up (2026-09-24)

## Delivered

- Compared `RetroBrowser97` with `Stitch Designs/html/windows_97_internet_explorer.html` and found the implementation omitted the Quick Links strip, animated globe badge, directory heading/protocol row, and Notepad badge.
- Added the source-sized Quick Links row and a locally drawn, animated SVG globe beside the toolbar. Reduced-motion users retain the site's global reduced-motion behavior.
- Rebuilt the home-page directory as a beveled two-column card area with real profile and live-project URLs from `PROFILE` and `PROJECTS`, plus the source-inspired visitor odometer and compatibility labels.
- Routed the Email card to the existing Outlook Express app and preserved the explicit Mail toolbar control.
- Avoided copying fictitious email/profile/demo URLs from the Stitch sample. Raw source HTML was left unchanged.
- Downgraded the IE manifest's visual state to partial because no matched-viewport live capture was taken.

## Verification

- Focused IE4 render tests: 1 test file, 3 tests passed.
- TypeScript: `npx tsc --noEmit` passed.
- Lint: `npm run lint` passed.
- Full suite: 29 test files, 124 tests passed.
- Production build: `npm run build` passed; Next emitted only the existing stale Browserslist-data notice.
- Browser popup behavior and matched-viewport visual comparison: not run; localhost remains stopped as requested.
