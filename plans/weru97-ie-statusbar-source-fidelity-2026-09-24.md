# Weru 97 Internet Explorer Status Bar and Toolbar — 2026-09-24

## Goal

Keep IE4's page viewport and its browser chrome separate, matching the preserved Stitch screen's toolbar and bottom status strip while preserving external links as native browser handoffs.

## Source discrepancy found

Stitch defines a 40px toolbar row with 32px buttons and a distinct 22px status row below the scrollable page. The React version used a 34px toolbar, allowed the page to grow without a bounded flex viewport, and placed a generic two-label status footer *inside* page content. That meant `View > Status Bar` toggled content that was in the wrong visual layer and external-navigation feedback looked like part of the remote webpage.

## Changes

- Sized the toolbar to 40px and its controls to 32px, preserving flexible natural widths for the added Mail action and globe badge.
- Made the IE window a bounded vertical flex layout: menus/toolbars stay in their chrome rows and the page alone takes and scrolls through remaining space.
- Moved the live `Done`/external-tab feedback into an app-owned, source-shaped 22px status strip after the page viewport.
- Added three segmented panes: flexible Ready/status, fixed 128px Internet zone, and fixed 64px SSL/Protected Connection.
- Kept the existing status-bar menu toggle, safe external anchors, and separate-tab address submission behavior.
- Added `src/apps/ie4/ie-source-contract97.test.ts` to bind the toolbar and status geometry/placement to raw Stitch source and active CSS/markup.
- Updated the Chapter 2 task list and Stitch manifest, retaining partial visual status until a matched-size browser capture exists.

## Verification

- Focused IE tests: 2 files, 7 tests passed (including 2 new source-contract cases).
- Full suite: 49 files, 196 tests passed.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build`: passed.
- `git diff --check`: passed; line-ending normalization warnings only.
- No local preview server or browser runtime was started in this slice.

## Still open

Confirm the actual 940×680 IE window in the browser against the Stitch viewport, including toolbar overflow, status toggle, and separate-tab behavior. Keep the manifest's visual/functionality statuses partial until live acceptance is recorded.
