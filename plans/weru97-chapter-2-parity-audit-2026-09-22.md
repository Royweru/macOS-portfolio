# Weru 97 Chapter 2 — Stitch Parity Audit

Date: 2026-09-22

This audit is the evidence record for the Chapter 2 tracker. It separates what was extracted from the supplied Stitch HTML from what was implemented from the migration documents, and it records the deliberate decisions made when a Stitch screen contains a duplicate desktop wrapper.

## Source-by-source conversion contract

| Stitch ID | Local source | Scope retained | React target | Current evidence |
| --- | --- | --- | --- | --- |
| `9e70e97521b041b0b2575fd0322ace42` | `windows_97_project_explorer_and_notepad_view.html` | Explorer and Notepad windows only; discard the embedded desktop | `ExplorerContent`, `NotepadContent` | Runtime workflow verified; final pixel comparison remains partial |
| `0f3046a574c8480da785b5f8f49b8b31` | `windows_97_dual_explorer_windows.html` | Two Explorer chrome/layouts and z-order; discard alternate wallpaper | `WindowManager97`, `ExplorerContent` | Live My Documents + Projects comparison verified independent keyed instances, focus/taskbar state, z-order, and close |
| `0de14a31211048eca172e442e500ec10` | `windows_97_internet_explorer.html` | IE4 application window, toolbar, page, and status bar | `RetroBrowser97` | Live runtime surface, links, history, URL normalization, and visitor fallback verified |
| `4a970d6cdecc4810a3b1eea9446779f9` | `windows_97_dual_explorer_variant.html` | My Documents window state, chrome, toolbar, address row, file area, and status; discard alternate desktop wrapper | `WindowManager97`, `ExplorerContent` | ZIP export fetched 2026-09-22 and preserved unchanged; source image inspected and Explorer lifecycle verified; exact source-specific pixel comparison remains partial |
| `47dfc46a772046c183e86027164941c5` | `windows_97_cd_player.html` | CD Player controls and LCD only; discard desktop wrapper | `CdPlayer97` | Track cycling, transport controls, volume, and close verified |
| `e05eddbf62974f6484f6b284b8b879ae` | `windows_97_os_desktop.html` | Bliss composition, icon grid, taskbar, and shell spacing | `Shell97`, `StartMenu97` | Full-width viewport, enlarged shell, Weru branding, and desktop runtime verified |
| `c018f85035a4472f911c7a809fab2cc6` | `windows_97_media_player_6.4.html` | Media Player display, controls, playlist, and equalizer only | `MediaPlayer97` | UI and no-media state verified; real playback remains dependent on supplied media |
| `85ab0677c7404c0d93c0d97b45252680` | `windows_97_paint.html` | Paint chrome, toolbox, palette, canvas, and status area | `Paint97` | Live source comparison verified the cyber-engine canvas, metrics, memo, toolbox, palette, zoom, status, and pixel rendering; external-image functionality remains partial |
| `e85aa0ce9dff439bba14c7e1ffbe0a68` | `windows_97_calculator_and_minesweeper.html` | Calculator and Minesweeper windows, not the surrounding desktop | `Calculator97`, `Minesweeper97` | Calculator arithmetic and Minesweeper reveal/flag/reset behavior verified |
| `ac63fe5b9e0a43e29ebf1bc4e9ebfba7` | `windows_97_system_dialogs_properties.html` | System Properties, Shutdown, warning, and Recycle Bin dialog regions; discard the embedded desktop | System dialogs | Stitch ZIP export fetched and preserved; System Properties General now uses source-shaped CRT/tower art, spec hierarchy, and segmented meters with SSR structure coverage; live screenshot comparison remains partial |
| `799ddaad07824567a8cd7dc487e75048` | No independent local artifact | Dialog contracts from migration documents | System dialogs | Implemented from governing documents; source is honestly marked pending |
| `62940bee0245407896b9283e0ef41f1b` | `windows_97_os_desktop_start_and_context_menus.html` | Start menu, context menu, selection, and taskbar states | `StartMenu97`, `Shell97` | Live source comparison verified source-style Programs rows, disabled Paste states, context positioning, taskbar controls, and Weru branding; full-width/enlarged shell is intentional |
| `weru97-boot-local` | `windows_97_boot_screen.html` | BIOS, starting, logo, progress, skip; discard embedded desktop | `BootSequence97` | Full-viewport boot and skip verified; raw source remains reference-only |

## Dimensions and styling extracted

- Explorer reference: approximately `620×430`; Notepad reference: approximately `580×450`.
- Dual Explorer reference: two independent windows around `660×440` and `440×320` inside the source desktop wrapper.
- Internet Explorer reference: approximately `940×680` application window.
- CD Player reference: approximately `540×360` for the main player with an adjacent approximately `390×280` Graphic Equalizer surface; Weru renders the pair inside one `940×420` managed window so neither surface is clipped.
- Media Player reference: approximately `640×520` with a compact media display and control rows.
- Paint reference: measured `840×478` with a `580×340` drawing sheet, toolbox, palette, memo, and status strip.
- Calculator reference: measured `278×265` at logical `(94,38)`; Minesweeper reference: measured `242×276` at logical `(356,46)`. Weru now uses these source rectangles so the companion windows open side by side rather than overlapping.
- Desktop and boot references use a `1024×768` composition in their source HTML. That composition supplies source-authored anchor positions only: Weru 97 renders full browser width/height, uses the full-width taskbar, and clamps saved windows against the actual current work area. It is not a fixed-size runtime viewport.

The implementation carries these proportions into window defaults, while the shared window manager clamps them to the actual logical work area. Window bevels, title-bar height, classic colors, hard shadows, menu spacing, status bars, and scrollbar treatment are defined in the shared Win97 styles rather than copied as isolated Tailwind markup.

## Measured source geometry captured during the one-by-one audit

- Calculator: `#calc-win` = `278×265` at `(94,38)`; Minesweeper: `#mine-win` = `242×276` at `(356,46)`.
- CD Player: `#cd-player-window` = `540×379` at `(215,32)`; Graphic Equalizer: `#eq-window` = `390×277` at `(771,32)`.
- Internet Explorer: `#ie-window` = `940px` wide in the supplied `1280×580` reference viewport.
- Paint: `#paint-app-window` = `840×478`; drawing sheet = `580×340`.
- Project Explorer/Notepad: Explorer = `620×430`, Notepad = `580×450`, My Documents = `560×410`.
- Desktop reference: My Documents shell window = `560×410`; dual Explorer references = `660×440` and `440×320`.

These values are source measurements, not guesses. The production shell may fill the browser and enlarge the taskbar by user request, but application proportions are kept at the measured logical sizes wherever the source provides an independent region.

## Live behavior evidence recorded on 2026-09-22

- Boot opened as a full-viewport overlay and Skip transitioned to the shell. The BIOS source text, Energy Star header, bottom-left starting state, Weru 97 cloud splash, four-color flag, segmented loader, and no-preboot-desktop behavior were captured live on localhost:3001.
- MS-DOS `crash` displayed the Weru 97 recovery screen; a subsequent keypress returned to the desktop.
- Explorer was moved in both axes, resized from a corner, maximized/restored, minimized/restored, and closed.
- Explorer's live My Documents screenshot was compared with the supplied Stitch composition after adding labeled Back/Forward/Up/Cut/Copy/Paste/Undo controls and an explicit Address row.
- After correcting explicit keyed window lookup in the OS store, My Documents and Projects opened as independent Explorer instances. The live screenshot showed separate rectangles and taskbar buttons; the active Projects window was then closed and My Documents remained visible, confirming independent close behavior.
- Notepad opened a read-only file and a writable draft; editing, save, and close behavior were exercised.
- Notepad's live read-only `about_me.txt` screenshot was compared with the supplied Stitch composition, including the active title bar, menu row, path row, text area, status row, and Save As/disabled Save controls.
- Calculator evaluated `7 + 0 = 7` and closed correctly.
- Minesweeper revealed cells, flagged cells, reset, and closed correctly.
- Calculator and Minesweeper were measured against the supplied source and reopened at the measured side-by-side rectangles `(94,38)` and `(356,46)`. The live runtime now preserves the compact Calculator grid and companion 9×9 Minesweeper surface instead of centering them on top of one another.
- CD Player advanced tracks and closed correctly.
- Internet Explorer displayed its toolbar, address bar, links, visitor count, status row, and closed correctly.
- After the dedicated IE4 implementation was restored, the live desktop double-click opened the IE4 window with its source-derived menu/toolbar/address/history surface; the title-bar X removed the window from the shell. The legacy re-export path is no longer present.
- Internet Explorer was compared directly with the supplied Stitch source after adding the missing Stop, Refresh, History, and source-order toolbar controls. The live links page, address state, visitor fallback, and full-width Weru shell adaptation were verified.
- Internet Explorer History was reopened after the accessibility refinement; the toggle now exposes an expanded button state and a visible Browsing history panel containing the current URL.
- Media Player displayed its Stitch-derived no-media state, playlist, equalizer, seek, and volume controls.
- Media Player's no-asset Play action now reports `No media loaded`; bundled-asset playback reports load errors and ended state, while reduced-motion disables the animated wireframe/equalizer path. End-to-end playback still needs a real bundled video or audio file.
- The active router no longer sends legacy `settings`, `projects`, `project-detail`, `photos`, `terminal`, or portfolio document windows to modern card-based content. They now resolve to classic Control Panel, Explorer, Paint, MS-DOS, or Notepad surfaces; contact uses a dedicated classic form.
- CD Player was compared against the supplied reference after separating its proportions into a 540px main deck and adjacent Graphic Equalizer surface. The live compact layout keeps the LCD, eight transport controls, selectors, three-track list, mix controls, and equalizer visible; the no-audio state remains explicit.
- Start → Programs exposed the intended Weru 97 application set.
- Start → Programs and the desktop context menu were compared directly with the supplied source. The runtime now exposes source-style Windows Explorer/Notepad/disabled WordPad/Paint/Media Player/CD Player/Calculator/Internet Explorer rows, disabled Paste/Paste Shortcut states, Arrange/Line up/Refresh/New/Properties rows, and keeps the expanded menu inside the usable desktop above the taskbar.
- Responsive QA used explicit local viewport overrides for wide `1440×900`, laptop `1280×800`, tablet `768×1024`, and narrow `390×844` requests. The browser reported device-scaled CSS viewports, but in each case the shell and stage matched the measured viewport, the taskbar spanned the full width at 46px, and document scroll dimensions matched the viewport without app-level overflow; the narrow Paint canvas remains intentionally scrollable inside its window.
- The supplied `windows_97_simulation_icons.jpg` reference sheet was added to the virtual `Screenshots` folder and opened through Explorer → Paint. The live Paint window displayed the actual image asset, proving the image-routing path rather than a placeholder; direct stroke evidence remains separate.
- Persisted media windows now rehydrate their asset from the stored filesystem `fileId` instead of relying on transient React state. After a full reload and boot handoff, Paint displayed the actual supplied sheet again. Live pencil drag, eraser drag, and fill interactions were then verified on that surface.
- Isolated behavior coverage now includes the shared window lifecycle, boot skip keys, calculator arithmetic and divide-by-zero, Minesweeper adjacency and safe first reveal, extension/URL routing, and the visitor API's no-KV fallback.
- The fetched System Dialogs reference was inspected against the live runtime. System Properties now exposes the source-defined General, Device Manager, Hardware Profiles, and Performance tabs, retro system specifications, registration/workstation details, and segmented 84%/72% resource gauges; the runtime still differs in exact source scale, dialog staging, and the separate System Warning/Recycle Bin composition, so visual parity remains partial.
- A second live comparison corrected the remaining System Properties surface mismatch: the general tab now uses the source's continuous gray classic panel, inset specification block, and grouped "System Performance Status" gauges instead of a large white inner card. This improves fidelity but does not close the exact pixel-comparison or Control Panel evidence gap.
- Start → Programs → Control Panel was live-opened after the visual correction. Its four settings actions (Display, Sounds, Accessibility, and Screen Saver) are now presented in the same classic beveled/icon-grid language and remain functional; no independent Stitch Control Panel source exists, so source parity stays partial.
- Recycle Bin was then moved from modern utility markup to an explicit classic surface with a source-style empty state, file rows, restore/delete actions, and beveled confirmation dialog. This improves the extracted dialog region without claiming the full four-dialog Stitch composition is rendered simultaneously.
- The document fallback was aligned to the Bliss sky-blue shell background (`html`, `body`, and `#root`) so viewport scaling cannot expose a legacy teal surround outside the active shell.
- TypeScript, lint, 13 test files / 28 tests, and production build passed after the System Properties, Recycle Bin, and dedicated IE4 cleanup slice; only the existing stale Browserslist data notice remains.
- After recovering the alternate Dual Explorer source and adding its manifest contract test, the latest gates passed: TypeScript, lint, 13 test files / 29 tests, and production build. The initial parallel build attempt hit Node memory pressure, but the isolated production build completed successfully; only the existing stale Browserslist data notice remains.

## Direct source comparison evidence

The supplied sources were served locally over a read-only HTTP endpoint because the browser blocks direct `file://` navigation. Their accessibility trees, measured geometry, and screenshots were compared with the live localhost:3001 runtime one by one for the ten previously audited local HTML files. The recovered System Dialogs export and alternate Dual Explorer export are now also preserved locally and source-inspected; exact screenshot comparison for those two remains partial. The desktop comparison confirmed the source icon order, the presence of quick-launch controls, and the Explorer window composition. The raw desktop uses column-first flex wrapping that varies with available height; the screenshot supplied by the user shows the nine shortcuts stacked at the left. Weru 97 keeps that single-column composition whenever the available height fits, hides the non-source MS-DOS desktop shortcut while retaining it in Start, and includes Show Desktop, IE, Notepad, My Documents, and CD Player quick-launch controls. The live Explorer comparison confirmed the title bar, menus, address/search row, quick-access tree, file area, details pane, status row, and taskbar window button are present. The dual-Explorer comparison additionally confirmed a classic cascaded second window, independent keyed state, and separate taskbar focus. The recovered variant source confirms the classic My Documents window state and is intentionally treated as a window extraction rather than a second desktop. The desktop screenshot comparison records the source's canonical composition while preserving the requested full-width production shell and enlarged taskbar as intentional Weru 97 adaptations. The Paint comparison additionally confirmed the cyber-engine wireframe, technical metrics, memo, palette, and status-strip extraction; those are now rendered by `Paint97` rather than a generic placeholder. The boot comparison confirmed the source-derived BIOS/starting/splash stages, with visible branding intentionally localized to Weru 97. The Media Player comparison confirmed the wireframe viewport, OSD, playlist metadata, transport deck, LCD, compact player, codec notice, equalizer, and classic status bar; the surrounding persisted Explorer window is shell state, not a duplicated Media Player desktop.

The recovered alternate Explorer source was then visually compared directly with the current browser. Its HTML specifies an active window at the source-authored `(240px, 60px)` anchor, `max-width:560px`, `height:410px`, a 20px title bar, 21px menu row, 28px toolbar, separate address row, six sample objects, scanline overlay, and one Explorer-owned status strip. The live default window is 560×410 at approximately `(232px, 62px)` and now has the same row structure, six/seven-item difference noted below, and scanlines across the application; the generic `Ready / Weru 97` footer was removed because it was an extra row absent from Stitch. The saved-window reload also demonstrated that the stale over-tall rectangle is kept within the current work area with its status visible. The seven live filesystem entries are retained rather than replaced with the six fictional sample items.

## Intentional differences and limits

1. Raw Stitch files remain unchanged and are not rendered through an iframe or injected into production.
2. Desktop wrappers embedded inside app references are discarded so an Explorer, IE, CD Player, or Media Player window does not contain a second desktop.
3. The user-requested full-width viewport supersedes the raw desktop wrapper width. `1024×768` is retained only as a Stitch source-layout reference for authored positions; it must never create a centered fixed-size desktop or black gutters.
4. One ID without independent local HTML remains `pending-source`; the recovered Dual Explorer and System Dialogs sources are available, but their visual status must not be marked verified until exact one-by-one screenshot comparison is complete.
5. Real media playback cannot be claimed for files that are not present in `public/media`; the UI and empty-state behavior are implemented and verified.
6. The user-supplied icon reference sheet is preserved under `public/assets/win97/reference` for QA; production uses individual local pixel assets.

## Remaining evidence required before Definition of Done

- A complete per-window pointer/touch/keyboard interaction matrix rather than representative live coverage.
- Exact visual comparison notes for each available Stitch source at its reference viewport.
- The independent source artifact for the remaining missing Stitch ID (`799ddaad07824567a8cd7dc487e75048`), if exact parity is required.
- Bundled audio/video assets for end-to-end media playback verification.

These are explicit evidence gaps, not hidden implementation work. The Chapter 2 tracker uses `[~]` for them until the corresponding evidence exists.

## 2026-09-23 — Desktop source extraction and full-width adaptation

The desktop is an in-scope Stitch screen, not a generic wallpaper target. `Stitch Designs/html/windows_97_os_desktop.html` was re-read against the active shell. `BlissWallpaper97` now carries over the source sky gradient, all cloud ellipses and their viewBox, both hill gradients and paths, the sunlight edge, and the black horizon gap produced by the source layer heights. `DesktopIconArt97` translates the nine source pixel drawings into React SVG, and `Desktop97` preserves source ordering, selection, keyboard focus, and flex-column wrapping as the usable browser height changes. The live localhost:3001 capture shows the full-bleed desktop and responsive two-column layout at the current viewport; there are no black side gutters.

The source taskbar is 30px tall, while the user explicitly requested a taller taskbar and larger icons. Weru 97 uses a full-width 46px bar and enlarged quick-launch/desktop artwork. These are intentional deviations, not evidence that the Stitch desktop was omitted. Accordingly, the desktop manifest remains `partial` until a same-viewport comparison documents the source-to-runtime differences rather than claiming pixel identity.

The boot layer was also rechecked. The active `BootSequence97` now fills the viewport, presents the source-derived BIOS/starting/splash sequence, uses Weru 97 branding instead of Windows branding, supports skip/reduced motion, and reveals the desktop beneath a fade. The raw source references VT323, but no local VT323 font asset was found; boot visual status therefore remains `partial` until typography/flag comparison is closed. TypeScript, full repository `npm run lint`, 14 test files / 34 tests, and the production build passed for this slice. The production build still prints the existing stale Browserslist data notice.

## 2026-09-23 — Desktop shortcut-flow correction

A fresh comparison at the user's current 1422×642 browser viewport exposed a concrete desktop mismatch: the larger shortcuts wrapped into two columns, while the Stitch desktop composition stacks them down the left side. The layout now uses a 64px vertical pitch so all nine enlarged icons fit in one column in the 596px work area above the requested 46px taskbar. Live screenshot verification shows the complete left stack, source ordering, selected My Documents state, full-width Bliss background, and no black side gutters. A two-case regression test verifies both the one-column fit and the wrap threshold. The intentional 40px icons and 46px taskbar remain user-requested departures from the source sizing, so complete desktop screenshot parity stays `partial` pending matched-viewport comparison.

## 2026-09-23 — Explorer window-control sample

The live common-window controls were checked again on Explorer. The title-bar X closed it; east-edge resize widened it; minimize left its taskbar button available; taskbar selection restored it; maximize filled the usable browser area and restore returned the prior rectangle. The first apparent vertical drag was actually north-edge resize: the 10px north-resize strip overlapped the upper half of the 20px title bar. After narrowing the north/south strips to 6px and dragging from the clear title-bar center, a horizontal move shifted X by about 100px and a diagonal move shifted X/Y by about 100px/30px. North-edge resize also continued to work at the narrower target. Explorer's shared controls are verified for this sample; the per-app interaction matrix remains partial.

## 2026-09-23 — System Properties source extraction refinement

Re-read the General tab in `Stitch Designs/html/windows_97_system_dialogs_properties.html`. The source uses a framed 64px CRT-and-tower drawing, a three-part System/Registered to/Computer text hierarchy, Courier hardware lines, and segmented green meters (21 System Resources cells and 18 User Interface Heap cells). Replaced the generic 48px computer icon and smooth progress bars with a React SVG matching the source geometry and 39 segmented meter cells. The Weru name and Alex Weru portfolio identity are retained; Stitch's Microsoft/Windows product label is not copied. Tabs and action buttons remain functional, and tabs now support arrow/Home/End keyboard navigation. Server-render and pure navigation tests verify this structure, labels, values, cell count, and key mapping; typecheck, lint, all 15 test files / 37 tests, and build pass. There is no fresh live screenshot after this update, so the manifest and Phase 9 remain partial pending matched-viewport visual review.
