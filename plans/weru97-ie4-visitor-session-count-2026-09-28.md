# Weru 97 IE4 Visitor Session Counting — 2026-09-28

## Problem

`useVisitorCount()` posted to `/api/visitors` every time an IE4 React window mounted. That made File → New Window and development remounts count the same portfolio tab as new visitors.

## Implementation

- Added `createVisitorCountSessionLoader97()` and made all IE4 instances share one module-level in-flight request and result.
- The first call in a browser-tab session marks the session before sending one `POST`; later IE mounts and same-tab reloads issue `GET` to display the latest global count.
- If a `POST` fails ambiguously, the loader does not retry a potentially processed increment; it switches to `GET` instead.
- Session storage failures degrade to one increment per running page module, without preventing the portfolio from rendering.
- Added unit coverage for concurrent windows, remount/reload deduplication, and ambiguous POST failure.

## Live browser evidence

Reused the existing Chrome extension tab `681018304` at localhost:3001. The local no-KV route logged one `POST /api/visitors` during the initial page visit. Opening a second IE4 through File → New Window produced two windows both displaying `0000001`, with no additional visitor request in the dev-server log. The test-created IE window was closed; the original remained. Reloading the same browser tab logged `GET /api/visitors` and restored the same number, `0000001`. No other browser tabs were opened or touched.

The local preview had no KV credentials and used the route's in-memory fallback. The dev process was stopped after the test, so its local counter state was discarded.

## Verification

- Focused visitor tests: 2 files / 4 tests passed.
- Full suite: 75 files / 368 tests passed.
- TypeScript: `npx tsc --noEmit --incremental false` passed.
- Full lint: all 230 TypeScript files passed.
- Production build: passed; existing stale Browserslist-data warning only.
- `git diff --check`: passed; existing LF-to-CRLF working-copy notices only.
- No user files, external accounts, or deployment state were changed.

## Remaining

This verifies once-per-tab counting and the local no-KV behavior only. Published KV behavior, API outages, cross-tab semantics, and full IE4 visual parity remain separate checks.
