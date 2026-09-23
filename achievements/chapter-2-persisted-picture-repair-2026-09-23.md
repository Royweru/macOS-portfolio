# Chapter 2 — Persisted Pictures Repair and Boot Readiness (2026-09-23)

## Completed

- Raised the VFS layout to version 11 and made the app-owned `C:\Pictures\Screenshots` folder and supplied reference JPG protected system nodes.
- Added safe startup reconciliation for those two stable nodes. It repairs their parent/location on an existing profile while preserving unrelated user-created content.
- Gated the desktop reveal on filesystem bootstrap completion, so restored Explorer windows cannot flash empty while IndexedDB is seeding or migrating.
- Corrected the older architecture plan and task list: personal libraries are `C:\Videos`, `C:\Pictures`, and `C:\Music`; `C:\Windows\Media` is system-only.

## Verification

- Reused the existing Chrome extension tab at `http://localhost:3000/`; did not open another tab or clear browser data.
- Browser view confirmed `C:\Pictures` contains `Screenshots`, that folder contains `windows_97_simulation_icons.jpg`, and opening it launches Paint with the supplied reference visible.
- TypeScript, lint, all 19 test files / 88 tests, production build, and `git diff --check` passed. Git emitted only its expected LF-to-CRLF working-copy notices.

## Remaining

- This closes the persisted reference-image reachability issue only. Exact Stitch screenshot parity, boot-source comparison, reduced-motion/early-skip QA, real personal-media playback, and the broader Chapter 2 acceptance matrix remain open.
