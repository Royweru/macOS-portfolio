# Weru 97 Desktop Stitch Implementation — 2026-09-23

## Goal

Use Stitch screen `e05eddbf62974f6484f6b284b8b879ae` (`windows_97_os_desktop.html`) as the visual source of truth for the desktop shell. The desktop must not be replaced with a generic Bliss approximation. Keep the user's product decisions: full browser width/height, no centered 1024×768 stage, Weru 97 naming, and a taller taskbar with larger icons.

The full-width and size requirements intentionally differ from Stitch's original 30px taskbar and source-sized 32px artwork. Therefore, source composition and shapes should be reproduced, while those explicit Weru 97 sizing changes remain documented adaptations. Do not describe the final result as pixel-identical while those adaptations exist.

## Source extraction contract

- Desktop: extract the source sky gradient, cloud SVG ellipses/viewBox, two hill gradients and their SVG paths, accent edge, black horizon band, nine icon drawings/order, desktop selection treatment, Start/taskbar/tray styling, and spacing.
- App windows: extract only their application/window regions; never duplicate a desktop wallpaper inside Explorer, IE, Media Player, CD Player, Paint, or dialogs.
- Boot: treat the boot HTML as its own full-viewport screen. Discard its embedded post-boot desktop and preserve source stage order/visuals while replacing Windows branding with Weru 97.
- Production: translate into React state, local SVG/assets, and scoped CSS. Do not iframe or inject raw Stitch HTML.

## Completed implementation slice

- `src/shell/BlissWallpaper97.tsx` translates the source gradient/layer geometry and hill/cloud paths.
- `src/shell/DesktopIconArt97.tsx` provides local React SVG for the nine source desktop shortcuts.
- `src/shell/Desktop97.tsx` retains source order, selected state, keyboard focus, and source-style column-first vertical flow. The earlier 64px forced single-column pitch was incorrect: the raw HTML uses vertical flex wrapping with a 16px row gap. Weru now uses 40px icons with an 80px pitch and 96px column pitch, preserving that flow while respecting the requested larger icons. Existing saved default coordinates using the former 88px row pitch are recognized and adapted without changing custom icon positions.
- A clean first-time visit seeds the source desktop's visible My Documents window at `(240,60)`, `560×410`, titled “My Documents.” It does not replace or clear restored/user-created windows. The browser session in this workspace contains older saved Explorer state, so the fresh-profile initial composition still needs a live screenshot.
- `src/styles/shell97.css` keeps the wallpaper and shell viewport full bleed, removes lateral black gutters, and applies the requested 46px taskbar and enlarged controls.
- `src/boot/BootSequence97.tsx` is the active full-screen boot path. The 2026-09-23 source-fidelity pass added locally bundled VT323, the Stitch BIOS line delays and memory counter, DMI success color, and full-screen CRT raster overlay while retaining Weru branding, skip/reduced-motion, and the desktop fade.
- Built-in desktop shortcut positions are migrated to the source order without clearing filesystem, profile, custom-shortcut, or hidden-shortcut data.

## Verification recorded on 2026-09-23

- Raw Stitch screenshot measured `1280×580`; live app screenshot measured `1421×644`. These are different viewport sizes, so they do not qualify as a matched-viewport comparison. At normalized scale, wallpaper layer geometry matches; confirmed differences include the source's 30px taskbar versus the requested 46px bar, source 32px icon artwork versus the requested 40px artwork, and a stale persisted root Explorer window in the current browser versus Stitch's My Documents window.
- `npm.cmd test -- --run src/shell/desktop-layout97.test.ts`: 1 test file and 3 layout cases passed, including seven rows plus wrap at a 596px work area, all nine in one column at 912px, and earlier wrapping at shorter heights.
- TypeScript passed after the flow correction and first-visit source-window seed.
- Explorer window-control follow-up narrowed the top/bottom resize hit bands from 10px to 6px so they no longer cover half of the title bar; live horizontal/diagonal movement and north/east resizing were then confirmed. The broader all-app matrix remains partial.
- TypeScript passed.
- Full repository `npm run lint` passed.
- Vitest: 14 files / 34 tests passed.
- Production build passed.

## Still open — do not mark complete

- Capture side-by-side screenshots of the raw desktop source and the active shell at a matched viewport and a clean first-visit profile. Record the source-vs-Weru taskbar/icon size adaptations without claiming pixel parity.
- Compare each app/window against its own Stitch screen at matched viewports; desktop work does not close app parity.
- Capture the boot BIOS and splash at the same viewport as Stitch and verify the updated counter/timing, scanlines, local VT323 rendering, and Weru-adapted splash. Boot visual/functionality status remains partial until that live comparison.
- Re-run the full interaction/responsive matrix and all validation gates after remaining implementation changes.
- Update this plan, the active Chapter 2 checklist, the screen manifest, and achievements after each separately verified slice.

## Current status

Desktop source extraction is implemented, but exact visual parity is still partial. A same-tab capture showed that the source and application viewports were different sizes; a prior claim of a matched current-viewport comparison was incorrect and is superseded by the 2026-09-23 audit addendum. The visual status in `src/data/stitch-screen-manifest.ts` must remain partial until matched-viewport and clean-profile screenshots exist. The desktop is explicitly part of the parity goal, alongside boot, windows, tabs, dialogs, and application screens.

## 2026-09-23 — Desktop source-flow and initial-window correction

A fresh inspection of `windows_97_os_desktop.html` showed that the desktop shortcut container is `flex-col flex-wrap`, with a 16px vertical gap. The source therefore wraps into a second column at shorter viewport heights; the earlier assertion that Stitch required a single column at every viewport was wrong. Replaced the overly dense 64px pitch with an 80px pitch for the requested 40px Weru icon artwork, keeping the 96px column pitch and source ordering. The layout regression now covers a seven-row first column at 596px, all nine icons in one column at 912px, and an earlier wrap at shorter heights.

The same source opens “My Documents” at `(240,60)` with a `560×410` window. New clean first-time visits now seed that Explorer view; saved windows are not rewritten. The current browser has pre-existing persisted root-Explorer state, so its screenshot is not evidence of the clean-first-visit result. Raw Stitch and app captures measured `1280×580` and `1421×644`; therefore no matched-viewport visual parity claim is made. Wallpaper geometry and colors are visibly consistent at normalized scale; taskbar height and icon art sizes differ intentionally per user instruction. Targeted layout tests (3 cases) and TypeScript pass. Desktop visual status remains partial pending same-size, clean-profile capture.

## 2026-09-23 — Boot source-fidelity correction

Re-read `Stitch Designs/html/windows_97_boot_screen.html`. BIOS lines now reveal at 100ms, 230ms, then 930–1840ms in 130ms steps. The memory line counts from 0K by 8192K every 60ms to 65536K before showing green `OK`; the DMI success text is white, the final boot line is yellow, and the viewport has the source's 3px scanline/6px RGB raster overlay. VT323 is bundled locally through `@fontsource/vt323`, not fetched from Google Fonts. The 18 splash segments advance every 120ms, followed by the source's 350ms wait before fading into the desktop. Raw Stitch HTML remains unchanged.

TypeScript, ESLint, all 14 test files / 35 tests, and the production build passed after these changes. The build still reports only the pre-existing stale Browserslist database notice. No live screenshot was captured after this change, so boot visual parity and the updated sequence's browser behavior remain partial. The desktop remains explicitly in scope and still needs matched-viewport, clean-profile visual comparison.

## 2026-09-23 — Window keyboard behavior correction

The global desktop handler no longer closes the focused application on plain Escape. Escape is reserved for an active overlay/menu, and desktop shortcuts are ignored while the screensaver covers the shell; Ctrl/Cmd+W remains the explicit keyboard close shortcut. Browser-only verification at `http://localhost:3000/` confirmed Escape leaves Explorer open, the title-bar X closes it, and Ctrl+W closes a reopened Explorer. The screensaver-specific Escape interaction and the full per-app control matrix remain open; see `plans/weru97-chapter-2-task-list.md` and `achievements/chapter-2-window-keyboard-2026-09-23.md`.

## 2026-09-23 — Boot starting-stage layout correction (visual check pending)

The retained Stitch boot source places “Starting Windows 97...” 45px from the left and bottom edges of its full-viewport black scene. Live review showed Weru's text near the top because an earlier 430px column/center alignment rule still applied to `.boot97-starting`. Removed that legacy rule and explicitly set the stage to full viewport, row direction, left/bottom alignment, and 45px insets in `src/styles/boot.css`. TypeScript, lint, tests, and production build pass after the CSS edit. The attempted follow-up browser check did not complete; keep boot parity partial until a same-tab screenshot proves the text position and the logo/progress stages are also reviewed.

## 2026-09-23 — Boot preload and window-route regression follow-up

Re-read the boot source and tightened two implementation details: local desktop assets begin preloading before the splash, and the desktop is not revealed until that preload promise settles; the splash is removed after the source's 700ms display timeout. Replaced the leftover Microsoft Windows 95 footer with `Weru 97 · Portfolio Edition`. The CSS opacity transition remains 800ms as in the source, while its script removes the splash after 700ms; the React timeout now follows that actual source behavior.

Added an OS-store regression for all 25 app IDs rendered by `WindowContent`, covering open, move clamping, minimum resize, maximize/restore, minimize/taskbar restore, and close. This is state-layer coverage only and does not close the live mouse/touch/title-bar control matrix. Full tests: 15 files / 64 tests; TypeScript, lint, and production build pass. The build retains the existing stale Browserslist-data notice.

Browser-only verification was not available in this pass: the selected localhost browser profile had no open tab at `http://localhost:3000/`. No browser or tab was created. Keep boot visual/functionality status and per-source parity partial pending same-tab review.

## 2026-09-23 — Explorer path and media-library correction

The user's screenshot showed two Explorer windows both at `C:\My Documents`, with `Videos` and `Screenshots` listed beside portfolio text files. Code inspection confirmed two causes: `WindowContent` fell back to a shared global `explorerFolderId` for any saved Explorer instance without `locationId`, and `createWin97Nodes()` explicitly parented both library folders under My Documents. This was implementation behavior, not browser caching or filesystem corruption.

Corrective changes:

- Each Explorer window now uses only its own `WindowInstance.locationId`; generic File Explorer/My Computer defaults to `C:\`.
- `C:\Videos` and `C:\My Pictures` are distinct root libraries; `Screenshots` is under My Pictures, while My Documents contains the four portfolio text files.
- Layout version 8 reparents the existing folder nodes by stable IDs and preserves descendants, including `windows_97_simulation_icons.jpg`.
- Persisted Videos and My Pictures desktop shortcuts are migrated to the new canonical paths; My Pictures opens its folder rather than directly launching Paint.

Live QA in one localhost:3000 tab confirmed File Explorer at `C:\`, My Documents at `C:\My Documents`, My Pictures at `C:\My Pictures` with its Screenshots subfolder, the supplied image at `C:\My Pictures\Screenshots`, and Videos at `C:\Videos`. Automated verification: TypeScript, lint, all 16 test files / 69 tests, and production build passed. The boot visual comparison and broader app parity work remain open. The earlier note that no browser tab was created is historical to the prior pass; this corrective verification used exactly one tab.
