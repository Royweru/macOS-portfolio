# Weru 97 System Properties Titlebar Monitor — 2026-09-26

## Goal

Match the System Properties window titlebar icon to the retained Stitch screen without changing the generic system icon used by Settings or Control Panel.

## Source evidence and implementation

- Raw source: `Stitch Designs/html/windows_97_system_dialogs_properties.html`, under `data-purpose="dialog-system-properties"`.
- The source labels the titlebar icon as 16×16 viewBox geometry rendered at `w-3.5 h-3.5` (14×14 CSS pixels).
- The source glyph consists of three rectangles: a silver monitor body with white edge, navy display, and gray stand.
- Added `public/assets/win97/icons/system-properties.svg` and registered it separately in `WIN97_ASSETS` / `AppIcon` as `system-properties-titlebar`.
- `Window97` selects the dedicated 14px asset only for the System Properties titlebar; it leaves other app titlebars at their established 13px and keeps the normal generic system icon map for Control Panel/Settings.
- Added one source-contract test comparing rectangle attributes and a rendered-window test asserting the dedicated asset and 14×14 output.

## Verification

- Focused tests: `src/wm/Window97.test.ts` and `src/apps/system/SystemProperties97.test.ts` — 2 files, 36 tests passed.
- Full suite: 69 files, 329 tests passed.
- `npx tsc --noEmit` passed.
- ESLint passed on the changed TypeScript files.
- `npm run build` passed, including production compilation and static page generation.
- The raw Stitch HTML was not modified.

## Remaining limitation

This proves the titlebar icon's source geometry and rendered size, not the whole System Properties window's matched-viewport appearance or Control Panel's independent Stitch parity. The broader Phase 9 task remains partial.
