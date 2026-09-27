# Weru 97 — Stitch Boot Skip Transition (2026-09-24)

## Source behavior

In the retained boot HTML, the logo/progress scene fades to opacity 0 over 800ms, the desktop is revealed beneath it, and the skip badge is hidden. BIOS and Starting scenes are hidden immediately when bypassed.

## Change

- Use a stage-specific skip policy: skip during the logo stage runs the existing 700ms source display timeout and fades the logo scene while revealing the shell; skip during BIOS or Starting reveals the shell immediately.
- Hide and disable the skip control during the logo fade so the transition cannot be activated repeatedly.
- Keep boot-splash content and raw Stitch HTML unchanged; the product brand remains Weru 97 per the user's instruction.

## Verification boundary

A unit test covers the stage-specific policy. Full DOM transition timing and matched-viewport visual confirmation remain open; localhost stays stopped for this code-only pass.

## Boot-to-desktop source audit (2026-09-24)

The retained HTML also has a post-splash sequence which was missing from the React shell: taskbar starts 300ms after desktop reveal, icons appear from 600ms at 90ms intervals, and first-visit welcome appears at 1600ms. These timings now live in `src/boot/boot-transition97.ts` and are applied to the actual Weru shell rather than copying the source's embedded legacy desktop. Reduced-motion settings bypass the staged entrance. Automated timing/Shell tests were added; matched-stage live verification remains open.
