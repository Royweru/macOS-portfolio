# Weru 97 IE4 New Window, External Link, and Stitch Geometry QA — 2026-09-28

## Scope

Continue the Chapter 2 execution in the existing Chrome-extension QA tab. Inspect the live boot skip, filesystem separation, IE4 New Window behavior, one outbound profile link, and the preserved IE4 Stitch source. Do not send email, deploy, clear profile data, or interact with unrelated browser tabs.

## Implementation

IE4's File → New Window command called the ordinary `onOpenApp('ie4')` path. That path asked the window manager to open the singleton `ie4` key, so it focused/reused the current window instead of creating another one. The callback now gives each requested IE4 window a generated unique instance ID and passes `allowMultiple: true`. The existing ID generator is exported as `createWindowInstanceId97`; a regression verifies app-prefixed IDs are unique.

## Live browser evidence

- Reused Chrome extension tab `681018304` at localhost:3001. A fresh boot displayed the Award BIOS; clicking “Click anywhere to skip” progressed through the Weru logo/progress splash and reached the restored desktop. The pre-existing Explorer, README, and media windows returned after filesystem readiness.
- Opened My Computer and observed root folders `Desktop`, `My Documents`, `Projects`, `Videos`, `Pictures`, and `Music`. My Documents showed only `Resume.txt`, `about_me.txt`, `experience.txt`, and `skills.txt`. Closed the temporary My Documents verification window; did not alter any VFS file.
- Opened IE4 File → New Window. The accessibility tree showed two independent `case-study.url - Internet Explorer` windows and two taskbar entries. Closed only the newly-created instance; the original IE4 window remained.
- A single click on the IE directory's X link created exactly one external tab at `https://x.com/RoyWeru`, and the Weru tab stayed at localhost. The destination's accessible page reports the account `@roy_weru` is suspended. The browser extension rejected the request to close this externally-created tab; it remains open. No other browser tabs were controlled.

## Stitch comparison evidence and limit

The retained `Stitch Designs/html/windows_97_internet_explorer.html` was served read-only on a temporary localhost port and compared sequentially in the same browser tab at a 1422×644 CSS viewport. Raw Stitch's `#ie-window` measured 939.99×562.99 at (281.11, 27.72). The first app measurement was an older persisted Weru IE4 rectangle (939.99×597.99 at (240.99, 0)); it was intentionally preserved. Follow-up source analysis and a dedicated geometry helper now reproduce the raw 940×563 first-open rectangle. A later live File → New Window measurement confirmed the new instance's 940×563 size; its position included the normal multi-window cascade. See `plans/weru97-ie4-source-window-geometry-2026-09-28.md`. Whole-page pixel parity remains open. The production IE4 page intentionally replaces Stitch's fictional sample identities and links with the current Weru portfolio manifest.

The temporary source server (3002) and dev server (3001) were stopped after testing. The external X tab is the sole browser-tab side effect; the extension would not allow the close request.

## Verification

- Focused tests: 2 files / 53 tests passed.
- Full suite: 73 files / 362 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: passed all 226 TypeScript files.
- `npm run build`: passed; the existing stale Browserslist database notice remains.
- `git diff --check`: passed with repository LF/CRLF warnings only.

## Still open

The owner must confirm whether `https://x.com/RoyWeru` is the intended profile or supply the active profile URL. IE4 initial outer geometry is now source-aligned; page typography, full-window visual parity, visitor fallback, blocked-popup recovery, `case-study.url`, Print preview, the full window matrix, other Stitch sources, reduced motion, touch, and production deployment parity remain incomplete. This report does not complete the IE4 or Stitch parity phases.
