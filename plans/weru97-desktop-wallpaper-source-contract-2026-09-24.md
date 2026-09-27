# Weru 97 Desktop Wallpaper Source Contract (2026-09-24)

## Goal

Prevent the desktop wallpaper from drifting away from the supplied Stitch OS Desktop (`e05eddbf62974f6484f6b284b8b879ae`) while preserving the requested full-width Weru shell.

## Implementation

- Added `src/shell/BlissWallpaper97.test.ts`, which reads the unchanged local Stitch HTML and the active shell stylesheet.
- Compared all 12 cloud ellipses by authored `cx`, `cy`, opacity, and radii against the rendered React SVG.
- Compared all three rolling-hill path definitions and their gradient stop colors against the source.
- Asserted the source's 65% sky/cloud layers, 48% hill region, blur treatment, full-width wallpaper rule, and sky gradient colors.
- Kept the full-width browser desktop, larger taskbar, and enlarged icons as intentional user-directed adaptations; this contract does not attempt to force the old fixed wrapper back into production.

## Verification

- `BlissWallpaper97.test.ts`: 2 source-contract tests pass.
- Full suite: 47 test files / 190 tests pass; `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass. Build prints the existing stale Browserslist-data notice.
- `git diff --check` passes with only the repository's existing LF-to-CRLF normalization notices.
- Matched-viewport browser screenshot comparison is still required; the user-requested stopped localhost runtime was not started.

## Remaining

The exact HTML/SVG/CSS geometry is now regression-checked, but this is not pixel-diff proof for the complete desktop. Icon layout, taskbar, active windows, CRT overlay, and responsive composition retain their own visual-evidence requirements.
