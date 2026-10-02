# Weru 97 Boot: Direct Stitch Browser Comparison — 2026-09-29

## Scope

Compare the unchanged local Stitch boot page with the active Weru 97 `BootSequence97` using the approved Chrome browser extension. This checks only the boot composition; Stitch's embedded desktop and welcome dialog are not part of the boot component extraction.

## Method

- Reused the existing Chrome tabs: Weru 97 at `http://localhost:3001/` and the local Stitch boot HTML served temporarily at `http://localhost:3002/windows_97_boot_screen.html`.
- Both pages used the same browser viewport: 1422×702 CSS pixels at devicePixelRatio 1.35.
- Used read-only DOM geometry inspection and screenshots. The local Stitch source was not edited.
- Left all restored Weru windows and user filesystem state untouched.

## Findings

- Both the Stitch splash root (`#scene-splash`) and Weru splash (`.boot97-splash`) cover the full 1422×702 viewport.
- The source and Weru skip controls measured x=1216, y=14, 188×25.
- The source and Weru progress bars measured x=551, y=484, 320×22.
- Weru's mark wrapper measured x=646, y=197, 130×120; the Weru title measured x=597, y=337, 228×90.
- The screenshot composition retains the source's full-screen blue field, scanline treatment, centered logo/title, progress bar, and top-right skip control. Weru's green W and “Weru 97” title intentionally replace Stitch's Windows flag and Microsoft Windows 97 name per the user's direction.
- At the approximate 3.9-second DOM sample after reload, Stitch had 7 active progress segments and Weru had 4. Browser hydration and capture timing were not synchronized to a deterministic frame, so this is evidence of a timing difference to investigate—not an exact timing verdict.
- The raw Stitch page proceeds to its own desktop and centered “System Information” dialog. Those are deliberately excluded from the boot-only conversion; the application shell owns the subsequent desktop state.

## Status

Boot visual and functional parity remain partial. This comparison verifies full-screen geometry and key overlay placement, but does not close BIOS-line timing, starting-stage timing, progress cadence, splash fade, asset-preload delay, reduced-motion behavior, skip interactions from every stage, the welcome delay, or the desktop entrance animation. No phase or parity item is marked complete from this slice.

The local app and source-viewer processes were stopped after the comparison; ports 3001 and 3002 were checked with no listeners remaining.
