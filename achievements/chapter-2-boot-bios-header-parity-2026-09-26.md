# Chapter 2 — Boot BIOS Header Parity (2026-09-26)

- Compared the active boot CSS against the preserved Stitch boot HTML.
- Restored source-like Energy Star badge stretch and BIOS text-column spacing.
- Corrected the CRT/skip stacking order so scanlines cross the skip hint as they do in the source.
- Added a regression contract; 3 focused boot test files / 14 tests pass. Full verification passed: 69 test files / 326 tests, TypeScript, lint (216 files / 27 batches), and production build (only the stale Browserslist data warning).
- Boot parity remains partial until matched-stage runtime screenshots and preload/reduced-motion interaction are verified.
- Details: [`weru97-boot-bios-header-parity-2026-09-26.md`](../plans/weru97-boot-bios-header-parity-2026-09-26.md).
