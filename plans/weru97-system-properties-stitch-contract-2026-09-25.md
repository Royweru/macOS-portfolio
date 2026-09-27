# Weru 97 System Properties — Stitch Contract

## Scope

Extract only the System Properties dialog from the combined System Dialogs Stitch screen. Keep its source-defined scale and classic chrome, preserve functional tabs, and do not import the embedded desktop or unrelated dialogs into this window.

## Changes

- Keep the 460×420 window config, four-tab hierarchy, 64px CRT/tower artwork in its 80px frame, 21/18-cell resource meters, and OK/Cancel actions.
- Match the source tab strip: 4px tab gaps, 1px white baseline, 11px type, gray inactive tabs with white/black bevel edges, and the raised gray active tab with source padding.
- Match the app titlebar's 18px height, padding, and blue gradient without changing other apps' shared titlebars.
- Preserve Weru branding and portfolio identity in place of Stitch placeholder product/person details.

## Verification

- `SystemProperties97.test.ts` compares the selected HTML region, active window dimensions, React structure, resource cell count, tab CSS, and scoped titlebar rules.
- Focused tests pass 3/3; full suite, TypeScript, lint, and production build pass (65 files / 285 tests). Build emits only the existing stale Browserslist-data advisory.
- Matched-viewport visual comparison is still required; source assertions do not replace screenshot QA.
