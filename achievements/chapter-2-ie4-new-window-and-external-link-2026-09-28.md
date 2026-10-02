# Chapter 2 — IE4 New Window and External Link Verification

Fixed IE4 File → New Window so it creates an independent window instance instead of focusing the singleton. Live verification showed two IE4 windows at once and confirmed that closing the test window preserved the original. Also verified boot skip to the populated desktop and checked that personal media folders live at the C: root while My Documents contains only personal text files.

The subsequent IE4 geometry slice added a source-derived first-open rectangle and live-checked its 940×563 size at a 1422×644 viewport; it is documented separately in [the geometry achievement](chapter-2-ie4-source-window-geometry-2026-09-28.md).

A single X-profile click opened one separate browser tab and left Weru 97 open. The destination currently reports `@roy_weru` as suspended, so the owner must confirm the intended profile URL. The browser extension declined the close request for that test tab; no other browser tabs were touched.

Verification: 73 test files / 362 tests passed, TypeScript passed, lint passed for 226 TypeScript files, production build passed, and `git diff --check` passed. The full IE4 visual parity comparison and the broader Chapter 2 checklist remain partial.
