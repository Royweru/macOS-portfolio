# Chapter 2 — Browser-Extension Smoke Check (2026-09-23)

## Scope

Used only the existing Chrome browser-extension tab. No native app, desktop-wide UI control, or additional browser tab was opened.

## Observations and checks

- Loaded `http://localhost:3000/` in the existing tab. The page initially exposed the Weru BIOS stage, then transitioned to the desktop.
- Captured the live desktop at 1422×644 screenshot pixels. Wallpaper and taskbar span the browser viewport without black side gutters; this confirms the full-width shell in this session, not matched-viewport Stitch parity.
- The active browser profile restores File Explorer, My Documents, My Pictures, Videos, and System Properties windows. Their saved positions overlap, so this is not evidence of the clean first-visit Stitch composition.
- Closed the front System Properties window with its title-bar X and confirmed its window and taskbar entry disappeared from the accessibility tree.
- Did not clear or rewrite browser storage and did not close the other persisted windows.
- Attempted to open the raw local Stitch HTML in the same tab for a matched-viewport capture; the browser extension's URL policy blocked `file://`. Stopped immediately and did not try a workaround, so the source/app screenshot comparison remains open.

## Status

This is a narrow live smoke check. It does not complete the all-app close/drag/resize matrix, clean-profile desktop comparison, or boot-stage source comparison. Those tasks remain partial in `plans/weru97-chapter-2-task-list.md`.
