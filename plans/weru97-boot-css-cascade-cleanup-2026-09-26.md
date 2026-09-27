# Weru 97 Boot CSS Cascade Cleanup — 2026-09-26

## Goal

Keep the active boot sequence's base geometry and appearance in one authoritative rule per surface, so old cascade fragments cannot silently override the Stitch-derived boot treatment.

## Finding and change

`src/styles/boot.css` had duplicate base declarations for `.boot97`, `.boot97-skip`, its hover state, `.boot97-bios`, and `.boot97-bios-lines`. Their appearance was split across separate rules, making it difficult to tell which values were intended to win. The tenth BIOS line also had overlapping margin declarations, and the reduced-motion rule still named a retired `.boot97-cursor` class.

- Consolidated the full-viewport overlay, skip control, BIOS panel, and BIOS line container into one base rule apiece.
- Kept the explicit small-screen BIOS override; the regression checks base rules separately from responsive media rules.
- Preserved the source-matched BIOS line spacing, 800ms splash fade, and current Weru branding.
- Removed the obsolete reduced-motion cursor selector.
- Added a source-contract test for authoritative base-rule counts and the values that protect full-screen geometry and BIOS placement.

No markup, boot timing, animation behavior, or user-facing boot transition was changed in this cleanup.

## Verification

- `npm test -- --run`: 69 files, 324 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: all 216 configured TypeScript files passed in 27 batches.
- `npm run build`: passed; Next.js reported the existing stale Browserslist database warning.
- `git diff --check`: passed; Git emitted line-ending normalization notices only.
- No localhost server was started and no browser session was changed.

## Still open

The boot screen is not marked visually complete. Matched-stage Stitch screenshots, live preload/reduced-motion/skip behavior, desktop reveal, and the full user-facing browser test remain open in `plans/weru97-chapter-2-task-list.md`.
