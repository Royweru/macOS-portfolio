# Weru 97 CD Player Stitch Audit — 2026-09-28

## Scope

Audit the retained Stitch CD Player screen and its React extraction, then remove a stale legacy style that could undermine the classic surface.

Source: `Stitch Designs/html/windows_97_cd_player.html`  
Screen ID: `47dfc46a772046c183e86027164941c5`  
Implementation: `CdPlayer97`, `CdEqualizer97`, and the shared window manager.

## Source contract reviewed

- The source contains two independent sibling windows, capped at 540px (CD Player) and 390px (Graphic Equalizer).
- Both authored title bars are 18px high. The CD Player exposes a disabled Maximize control; the Equalizer has no Maximize control.
- The player surface includes its Disc/View/Options/Help menu, LCD, three time modes, transport buttons, metadata/track selectors, playlist, balance/volume/mode controls, and three-part status strip.
- The Equalizer includes a seven-band segmented meter, Preamp/Bass/Treble controls, Presets/Reset, EQ Active, and processor footer.
- The source's surrounding desktop and taskbar are not part of either extracted app window.

## Live evidence

Using only the existing Chrome-extension tab, the current Weru app rendered both CD windows together at a 1422×644 browser viewport. The CD Player exposed its complete control and status structure; the companion Equalizer exposed all seven bands, three controls, actions, and footer. Disc → Eject displayed the yellow “CD-ROM TRAY OPEN” notice; Close Tray restored `No Disc` and disabled media controls. Only the temporary CD windows were closed after the check.

The browser extension rejects local `file:` navigation. I did not route the raw HTML through another browser/server path; the source was audited statically instead. Therefore this is not a matched raw-source pixel comparison and the Stitch visual status remains partial.

## Change and verification

- Removed the obsolete `.win97-cd-player` navy-background/padding rule from `src/styles/window97.css`; the active Stitch-specific gray rule remains the single source of truth.
- Added a source-style regression in `src/apps/cd-player/cd-source-contract97.test.ts` to prevent that legacy rule from returning.
- CD focused suite: 5 files / 19 tests passed.
- Full suite: 75 files / 369 tests passed.
- TypeScript: `npx tsc --noEmit --incremental false` passed.
- Lint: all 230 TypeScript files passed.
- Production build passed; the only notice was the existing stale Browserslist database warning.
- After the final manifest and tracker note update, TypeScript and the focused CD suite (5 files / 19 tests) passed again. `git diff --check` passed with only existing LF-to-CRLF conversion notices.
- Localhost:3001 was stopped after browser testing.

## Still open

- Matched-viewport comparison with the rendered raw Stitch HTML remains unavailable in this browser session; keep this screen's visual parity partial.
- `PERSONAL_MUSIC` is empty and there is no bundled real personal audio, so audible playback, EQ processing against actual audio, track-end behavior, and reduced-motion playback remain unverified.
- Remaining CD menu keyboard edge cases and the all-app window-control matrix remain open.

The live chapter checklist remains the source of truth: `plans/weru97-chapter-2-task-list.md`.
