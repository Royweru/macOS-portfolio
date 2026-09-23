# WINDOWS PORTFOLIO '97 — Build Architecture + Stitch Prompt Series
## Companion to DESIGN.md — read DESIGN.md into Stitch FIRST, then feed prompts P0→P10 one at a time.

====================================================================
PART 1 — RESEARCH: HOW REAL "WINDOWS 97" WORKED
====================================================================

There was never a product called "Windows 97" — what you mean (and what
everyone nostalgic means) is **Windows 95 OSR 2.x**: OSR2 (1996) introduced
FAT32; OSR2.1/2.5 (1997) added USB and Internet Explorer 4. Internally version
4.00.950B/C, codename "Detroit". This is the era your reference images come from.

REAL SYSTEM FACTS (ground truth for authenticity):

1. FILE SYSTEM — VFAT / FAT32
   - VFAT gave Windows 95 long file names (up to 255 chars) while keeping
     8.3 aliases underneath (so `about_me.txt` had a hidden `ABOUT_~1.TXT`).
   - Drives on a typical machine: 3½" Floppy (A:\), Local Disk (C:\), CD-ROM (D:\).
   - Root of C:\ looked roughly like:
       C:\WINDOWS        (the OS: SYSTEM, SYSTEM\VMM32, Start Menu, Desktop)
       C:\PROGRA~1       (Program Files — displayed "Program Files")
       C:\My Documents   (the user's personal folder)
       C:\Recycled       (Recycle Bin)
       IO.SYS, MSDOS.SYS, COMMAND.COM, CONFIG.SYS, AUTOEXEC.BAT (hidden system files)
   - Explorer windows had: menu bar, gray toolbar (Back/Forward/Up/Cut/Copy/Paste/
     Views), drop-down Address bar showing the path ("C:\Projects"), optional
     folder TREE on the left + content list on the right, status bar at bottom.

2. KERNEL — monolithic, VMM32.VXD
   - The Windows 9x kernel is monolithic; the core is VMM32.VXD, the Virtual
     Machine Manager (memory, events, interrupts, thread scheduling).
   - Around it: VFAT (file system), VCACHE (disk cache), VDD (video), VKD (keyboard),
     VMOUSE, VPICD (interrupts), CONFIGMG (Plug & Play), IOS (I/O supervisor).
   - 32-bit API lives in KERNEL32.DLL, GDI32.DLL (drawing), USER32.DLL (windows/UI),
     SHELL32.DLL (shell), COMCTL32.DLL (common controls).
   - CONFIG.SYS / AUTOEXEC.BAT ran at boot; SYSTEM.INI and WIN.INI still existed;
     the Registry lived in SYSTEM.DAT + USER.DAT.

3. SHELL — EXPLORER.EXE ("Stimpy", from the "Chicago" project)
   - The desktop, taskbar, Start button and file manager are all ONE program:
     explorer.exe. That is your single most important design insight: in your
     portfolio, ONE shell component owns the desktop, the taskbar, the Start
     menu AND every folder window — they must feel like one living thing.

4. BOOT SEQUENCE (to mimic as your loading screen)
   BIOS POST → "Starting Windows 95…" (MSDOS.SYS BootDelay) → clouds logo
   (LOGO.SYS) → protected-mode driver load → hourglass cursor → logon →
   startup chime → explorer.exe draws the desktop → Run/RunOnce startup items
   load → hourglass turns off.

5. ACCESSORIES THAT MUST EXIST (era-correct names)
   notepad.exe (Notepad), write.exe→wordpad (WordPad), calc.exe (Calculator),
   mplayer.exe (Media Player — video), cdplayer.exe (CD Player — audio),
   pbrush.exe (Paint), winmine.exe (Minesweeper), sol.exe (Solitaire),
   mshearts.exe (Hearts), regedit.exe, msconfig-ish (not in 95), control.exe
   (Control Panel: Display, System, Add/Remove Programs), plus the DOS prompt
   icon (MS-DOS Prompt).

====================================================================
PART 2 — TRANSLATING THE OS INTO WEB APP ARCHITECTURE
====================================================================

Think of your portfolio as the real OS with each layer renamed for the web:

  REAL WIN95 COMPONENT        YOUR WEB EQUIVALENT
  --------------------------  -----------------------------------------
  VMM32.VXD (kernel)          A central STATE STORE (zustand/redux): window
                              list, z-order, focus, file system tree,
                              settings, running "processes"
  EXPLORER.EXE (shell)        <Shell/> component: desktop + taskbar +
                              start menu + context menus. Never unmounts.
  USER32/GDI32 (window mgr)   <WindowManager/>: drag, resize, focus,
                              min/max/restore, z-index, snapping bounds
  VFAT + FAT32 (filesystem)   A VIRTUAL FILE SYSTEM: one JS object tree
                              (folders/files with name, type, size, date,
                              content ref). Path resolver like "C:\Projects\X"
  Registry (SYSTEM.DAT)       localStorage "registry": wallpaper, sounds on/off,
                              window positions, last-visited paths
  Programs (calc.exe etc.)    <AppRegistry/>: file-extension → React component
                              map (.txt→Notepad, .avi→MediaPlayer, ...)
  COMCTL32 (common controls)  UI kit: Button95, TitleBar, MenuBar, Dialog,
                              Scrollbar95, TaskbarButton, Icon32
  Startup items / Run keys    Boot sequence + any auto-open welcome window
  Sound scheme (tada.wav,     WebAudio beeps: click, open chord, error ding,
  ding.wav, chord.wav)        startup tada — synthesized, tiny, mutable
  CRT screen                  Scanline overlay + subtle screen curvature +
                              pixelated rendering on icons

Design rules that come straight from the research:
- ONE shell, many windows. The desktop/taskbar must be as persistent as the OS.
- Everything is a file. Your CV is not a route "/cv" — it is a FILE at
  "C:\My Documents\cv.pdf" that the shell routes to a viewer.
- Extensions decide the app. Just like VFAT hid 8.3 aliases, you can hide the
  "alias" (real implementation) behind era-correct extensions.
- The Start menu mirrors the file system: C:\Windows\Start Menu\Programs\…

====================================================================
PART 3 — RECOMMENDED CODE FILE STRUCTURE
====================================================================

src/
├── os/                          ← the "kernel + drivers" (no UI)
│   ├── kernel/
│   │   ├── store.ts             ← single state store (windows, focus, zOrder)
│   │   ├── actions.ts           ← openWindow, closeWindow, focusWindow, minimize
│   │   └── types.ts             ← OSWindow {id, appId, title, icon, rect, state}
│   ├── fs/
│   │   ├── filesystem.ts        ← virtual FAT: the C:\ tree as typed objects
│   │   ├── paths.ts             ← resolve("C:\\Projects\\3D-Website")
│   │   └── content/             ← your real data
│   │       ├── projects/        ← one ts file per project (readme, media, links)
│   │       ├── documents/       ← about_me.txt, cv, skills.txt content
│   │       └── media/           ← videos, audio manifest
│   ├── registry/
│   │   └── settings.ts          ← wallpaper, sound, positions (localStorage)
│   ├── sound/
│   │   └── synth.ts             ← WebAudio: click.wav, tada.wav, ding.wav
│   └── apps/
│       └── registry.ts          ← extension/appId → component + default window size
│
├── shell/                       ← EXPLORER.EXE — never unmounts
│   ├── Shell.tsx                ← desktop + taskbar + start menu root
│   ├── Desktop.tsx              ← icons, wallpaper, drag-select, context menu
│   ├── Taskbar.tsx              ← start button, task buttons, tray + clock
│   ├── StartMenu.tsx            ← Programs ▸ cascade, Documents ▸, Shut Down…
│   └── ContextMenu.tsx          ← right-click menus (desktop, files, taskbar)
│
├── wm/                          ← the window manager (USER32)
│   ├── Window.tsx               ← chrome: titlebar, menu, bevels, status bar
│   ├── WindowManager.tsx        ← renders open windows, z-order, drag/resize
│   └── useDrag.ts, useResize.ts
│
├── components/                  ← COMCTL32 (the reusable 95 kit)
│   ├── Button95.tsx  TitleBar.tsx  MenuBar.tsx  Dialog.tsx
│   ├── Scrollbar95.tsx  Icon32.tsx  TaskbarButton.tsx  Toolbar95.tsx
│   └── Clock.tsx  Tray.tsx
│
├── apps/                        ← the accessory programs (one folder per .exe)
│   ├── explorer/Explorer.tsx    ← folder windows + tree + list + address bar
│   ├── notepad/Notepad.tsx
│   ├── wordpad/WordPad.tsx
│   ├── mediaPlayer/MediaPlayer.tsx
│   ├── cdPlayer/CdPlayer.tsx
│   ├── paint/Paint.tsx          ← simple image viewer is enough for v1
│   ├── calc/Calculator.tsx
│   ├── ie4/RetroBrowser.tsx     ← renders .url + a fake "links page"
│   ├── games/
│   │   ├── winmine/Minesweeper.tsx
│   │   └── solitaire/Solitaire.tsx
│   └── system/
│       ├── AboutMe.tsx          ← System Properties "General" tab style
│       ├── ControlPanel.tsx     ← Display Properties (wallpaper!), Sounds
│       └── Shutdown.tsx         ← shut down / restart / cancel dialog
│
├── boot/
│   └── BootSequence.tsx         ← BIOS → "Starting Windows 97…" → desktop
│
├── assets/
│   ├── icons/                   ← 32px pixel icons (use a win95 icon set)
│   ├── cursors/                 ← arrow.cur, hourglass, hand, text beam
│   ├── wallpaper/               ← bliss.png + 1-2 alternates
│   └── sounds/                  ← (or synthesize in sound/synth.ts)
│
├── styles/
│   ├── tokens.css               ← the DESIGN.md palette as CSS variables
│   ├── bevels.css               ← .raised / .sunken / .window-frame utilities
│   ├── fonts.css                ← Tahoma, Courier New, VT323
│   └── crt.css                  ← scanlines overlay
│
└── App.tsx                      ← BootSequence → Shell

====================================================================
PART 4 — THE STITCH PROMPT SERIES (P0 → P10)
Feed these ONE AT A TIME after DESIGN.md. Never batch two screens per prompt.
====================================================================

--------------------------------------------------------------------
P0 — BOOT SEQUENCE (loading screen)
--------------------------------------------------------------------
Using the DESIGN.md design system, generate the boot/loading screen for my
Windows 95-style portfolio OS. This is the first thing visitors see.

Scene 1 — POST/BIOS (2 seconds): black screen, gray monospace BIOS text in the
top-left: memory count ("Memory Test: 65536K OK"), a line "Detecting IDE
drives...", then "Verifying DMI Pool Data...". Tiny, cramped, authentic.

Scene 2 — "Starting Windows 97…": black screen, plain white Tahoma text
centered near the bottom reading exactly "Starting Windows 97…".

Scene 3 — boot logo (2.5 seconds): the classic Windows 95 clouds logo — blue
sky with white clouds, the waving 4-color flag, and text "Windows 97" with a
small "Loading..." progress bar under it. Progress bar is the classic segmented
blue blocks style.

Scene 4 — desktop fade-in: the boot logo fades down into the Bliss desktop with
the taskbar sliding up from the bottom, icons popping in left-to-right (each
with a tiny scale pop), and the startup chime moment. Include a skip: clicking
anywhere jumps straight to the desktop.

Style notes: everything chunky and pixelated, no anti-aliased modern fonts, no
gradients except the official logo. Deliver as one responsive screen with a
timed state machine (boot → logo → desktop), plus a "Skip >>" text bottom-right.

--------------------------------------------------------------------
P1 — THE DESKTOP (home page — THE most important screen)
--------------------------------------------------------------------
Using the DESIGN.md design system, generate the DESKTOP screen — the home page
of my portfolio. Full viewport, 16:9, logical canvas 1024×768 scaled to fit,
no page scrolling anywhere.

WALLPAPER: the Bliss wallpaper — vivid green rolling hill filling the bottom
40%, blue sky with soft white cumulus clouds on top. Slight pixelation so it
reads as 1997.

DESKTOP ICONS: one vertical column on the LEFT, 32px pixel icons with 8px white
Tahoma labels with 1px black outline. Top to bottom, with one column-break gap:
1. My Computer (CRT monitor icon)
2. My Documents (yellow folder)
3. Projects (yellow folder — slightly open)
4. Videos (folder with filmstrip)
5. My Music (folder with music note)
6. My Pictures (folder with image icon)
7. Internet Explorer (blue "e" orbit icon)
8. Games (folder with joystick) — then gap —
9. Recycle Bin (bin with recycle arrows)

INTERACTION SPECS (show states in the design):
- Hover: icon brightens slightly. Single click: label gets a dotted focus
  rectangle with dark navy fill. Double click: window opens (show one mock
  window mid-pop-open above the desktop: "My Documents" explorer window, active
  blue title bar, gray chrome, slightly overlapping the wallpaper).
- Selected icon labels use the classic inverted navy highlight.

TASKBAR (pinned bottom, full width, ~30px, #C0C0C0):
- LEFT: Start button — raised gray bevel, 4-color Windows flag icon + bold
  "Start" in Tahoma 11px.
- CENTER-LEFT: 4 quick-launch mini icons (explorer, notepad, media player, IE)
  separated by a thin vertical divider line.
- CENTER: two taskbar buttons, one pressed (active, showing "My Documents"),
  one raised ("untitled - Notepad").
- RIGHT: system tray — recessed sunken panel containing: speaker icon, small
  monitor icon, and a Tahoma 8px digital clock reading "8:52 PM".

DETAILS: add a subtle CRT scanline overlay across the whole screen (3% opacity),
the custom white-arrow-with-black-outline pixel cursor sitting over the desktop,
and a faint desktop shadow under the taskbar. The overall vibe: a freshly booted
1997 machine on a sunny afternoon.

--------------------------------------------------------------------
P2 — START MENU + DESKTOP CONTEXT MENU (overlay states of the home screen)
-------------------------------------------------------------------
Using the DESIGN.md design system, generate the START MENU opened state and the
desktop RIGHT-CLICK context menu, as overlays on the desktop screen from P1.

START MENU (classic two-column, anchored to the left above the Start button):
- Column 1 (narrow, #C0C0C0 with thin border): a raised "Windows 97" banner
  block at top (the 4-color flag + "Windows 97" text, vertical-ish feel), and
  the Shut Down button at the bottom with a power icon.
- Column 2 (main): menu items top to bottom, each with 16px pixel icon and
  Tahoma 8px label, with the right-pointing triangle on items that cascade:
  Programs ▸   Documents ▸   Settings ▸   Find ▸   Help    Run…    (divider)
  Shut Down…
- Hover state: classic inverted navy highlight bar behind the item.
- Show the Programs cascade OPEN to the right: submenu listing "Windows
  Explorer", "Notepad", "WordPad", "Microsoft Paint", "Media Player",
  "CD Player", "Calculator", "Internet Explorer", (divider), "Games ▸"
  (Games cascades once more: Minesweeper, Solitaire, FreeCell).
- Show the Documents cascade OPEN with: "about_me.txt", "cv.pdf",
  "skills.txt", "project-demo.avi".

CONTEXT MENU (right-click on empty desktop): small gray menu — "Arrange Icons ▸"
(cascade: by Name / by Type / Auto Arrange), "Refresh", divider, "Paste",
"Paste Shortcut" (grayed out/disabled), divider, "Properties". Same navy hover
highlight.

Both menus must look like true 95 chrome: 2px raised border, white inner edge,
Tahoma 8px, disabled items in grayed text with no hover effect.

--------------------------------------------------------------------
P3 — FILE EXPLORER (the portfolio core: My Computer + Projects)
--------------------------------------------------------------------
Using the DESIGN.md design system, generate the FILE EXPLORER window — the most
important app in my portfolio. Show TWO explorer windows layered to prove the
window system works:

WINDOW A (active, front, centered-left): title "Projects" with folder icon and
blue active gradient title bar (#000080→#1084D0).
- Menu bar: File | Edit | View | Help.
- Toolbar (gray, 24px tall, small 16px icons + no text): Back, Forward, Up,
  | Cut, Copy, Paste | Views drop-down, divider, large/small icons toggle.
- Address bar: sunken white text field with "C:\Projects" and a drop-down arrow.
- LEFT PANE: folder tree with expand/collapse "+" boxes — Desktop, My Computer,
  C:\ (expanded) → My Documents, Projects (selected), Videos, My Music.
- RIGHT PANE (details/list view): column headers "Name | Size | Type | Date
  Modified" with the raised-header look. Rows (alternate project folders):
  "3D-Website", "AI-Chatbot", "Brand-Identity", "Mobile-App", "E-Commerce-Store"
  — each shown as a small yellow folder icon. One row is selected (navy
  highlight). Status bar: "5 object(s)".
WINDOW B (inactive, behind, offset down-right, gray inactive title bar):
title "My Computer", right pane showing drives: "3½ Floppy (A:)" (floppy icon),
"Local Disk (C:)" (hard drive icon), "CD-ROM (D:)" (CD drive icon), plus
"Control Panel" and "Printers" icons.

Show window controls (minimize/maximize/close) on both. Add the exact bevel
recipe: outer 1px #DFDFDF, then 1px #808080, inner white/#404040 lines.
Interactions to annotate: double-click folder → opens that folder INSIDE the
same window (address bar path updates); single click selects; drag title bar.

--------------------------------------------------------------------
P4 — PROJECT FOLDER DETAIL VIEW + NOTEPAD
--------------------------------------------------------------------
Using the DESIGN.md design system, generate two windows showing how ONE project
folder opens and how its files behave:

WINDOW A (active): Explorer at path "C:\Projects\3D-Website" — same chrome as
P3, right pane in DETAILS view listing the classic project file set:
  README.txt        2 KB   Text Document        12/03/97
  demo.avi        14,336 KB  Video Clip         11/28/97
  screenshots.bmp   640 KB  Bitmap Image       11/25/97
  case-study.url    1 KB    Internet Shortcut  12/01/97
  tech-stack.spec   3 KB    Spec Sheet         11/30/97
README.txt is selected. Status bar reads "5 object(s) (14.9 MB)".

WINDOW B (partially overlapping, slightly behind, NOTEPAD — active front):
Title "README.txt - Notepad", blue active title bar, menu bar File | Edit |
Search | Help. White text area with Courier New 10px content — a real project
description: project title, one-paragraph summary, bullet list of 3 key
features, tech stack line, and a final line "Open case-study.url to view the
live site." Word-wrap on. No toolbar — authentic Notepad has no toolbar.
Status bar area empty (Notepad's is hidden by default). Show the text caret
blinking mid-sentence.

Annotate the file→app mapping on the design: .txt opens Notepad, .avi opens
Media Player (P5), .bmp opens Paint (P8), .url opens IE4 retro browser (P7),
.spec opens the System Properties-style dialog.

--------------------------------------------------------------------
P5 — MEDIA PLAYER (video simulation)
--------------------------------------------------------------------
Using the DESIGN.md design system, generate the VIDEO MEDIA PLAYER window —
classic Windows Media Player 6.4 (mplayer.exe look).

Window title: "demo.avi - Media Player". Navy active title bar.
- Menu bar: File | Edit | View | Help (File menu dropped open showing:
  Open…, (divider), Play, Stop, (divider), Exit).
- Main area: 4:3 video display surface (dark gray #000000–#202020) showing a
  video poster frame of a website demo with subtle scanlines. Below it, the
  transport row: round gray beveled Play button (pressed state), Stop square
  button, round Play/Stop toggle look of the era.
- SLIDER: classic 95 slider track — white sunken track, small gray handle with
  grip dots, time LCD on the right reading "00:24 / 00:45".
- RIGHT SIDE playlist pane (sunken white list): "demo.avi", "homepage-loop.avi",
  "mobile-preview.mov" — first item selected.
- BOTTOM: a Scale selector (drop-down showing "100%") and a volume mini-slider
  with speaker icon.

Also show the COMPACT mode variant: a tiny floating window (title "Media Player"
compact) with just an LCD time readout, small play/stop buttons, and a blue
title bar — the classic skinned mini-player.

Style: the video area should have that slightly washed VHS feel. Transport
buttons use authentic 95 bevels (white highlight top-left, #808080 bottom-right).

--------------------------------------------------------------------
P6 — CD PLAYER (music simulation)
--------------------------------------------------------------------
Using the DESIGN.md design system, generate the CD PLAYER window — the classic
Windows 95 cdplayer.exe.

- Small compact window, title "CD Player", blue active title bar.
- Top row: LCD-style display panel (dark recessed screen with light gray
  seven-segment-ish Tahoma digits) showing track time "02:41" and mode
  indicator "Track Time". Next to it, a second LCD line: Artist "My Music"
  and Track title "Portfolio Theme.wav".
- Control row: round buttons with authentic glyphs — Previous Track (|◀),
  Play (▶, pressed), Stop (■), Pause (❚❚), Next Track (▶|), and the EJECT
  button (⏏) at the far right which shows a tiny tray-open animation state.
- Under controls: mode toggles "Disc / Track Time" radio-style buttons and a
  volume slider.
- A small "Playlist" drop-down listing: 01_portfolio-theme.wav,
  02_ui-sounds-demo.mid, 03_startup-mix.wav.
- Bonus window top-right, partially behind: "Now Playing" mini window with a
  tiny animated equalizer (7 vertical green bars of varying heights) and the
  current track name scrolling.

The whole thing should feel like a tiny gray stereo from 1997: chunky beveled
round buttons, zero modern rounding, LCD glow subtle.

--------------------------------------------------------------------
P7 — INTERNET EXPLORER 4 (retro browser) + .url behavior
--------------------------------------------------------------------
Using the DESIGN.md design system, generate the RETRO BROWSER window — styled
as Internet Explorer 4 on Windows 95 OSR2.5 (the "webby desktop" era).

Window title: "case-study.url - Internet Explorer". Blue active title bar.
- Menu bar: File | Edit | View | Go | Favorites | Help.
- Main toolbar (gray, raised icons): Back (enabled), Forward (grayed), Up
  (grayed), divider, Home, Search, Favorites, Print icons.
- ADDRESS BAR: sunken field showing "https://3d-website.dev" with a Go button
  (raised "Go" text button, 95 bevel).
- CONTENT AREA (white, slightly inset): render my LINKS / CONTACT page as a
  charmingly dated 1997 personal homepage — "My Links" heading in Times New
  Roman style serif (era-correct for old web), a horizontal rule, and a
  link-directory list: Email (mailto), GitHub, LinkedIn, Twitter/X, Dribbble —
  each as underlined blue/purple hyperlinks with the classic globe-link icon
  beside them. Bottom of page: visitor counter reading "You are visitor
  number 0001337" and "Best viewed at 800×600" badge. Add a subtle page
  background: plain white (or a very light gray #C0C0C0 at 10%).
- STATUS BAR: "Done" on the left, a small globe+page icon zone on the right.

Annotation: this browser is what opens when a visitor double-clicks any
.url file in the portfolio. The fake address bar updates per file.

--------------------------------------------------------------------
P8 — PAINT / IMAGE VIEWER + MY PICTURES
--------------------------------------------------------------------
Using the DESIGN.md design system, generate the PAINT app window showing a
screenshot from my portfolio:

Window title: "screenshots.bmp - Paint". Blue active title bar.
- Menu bar: File | Edit | View | Image | Options | Help.
- LEFT: vertical TOOLBOX (two columns of 16px beveled tool buttons): free-form
  select, rectangular select, eraser, fill bucket, eye dropper, zoom, pencil,
  brush, airbrush, text, line, curve, rectangle, polygon, ellipse, rounded rect.
  The pencil tool is pressed/sunken.
- BOTTOM-LEFT below toolbox: the selection/Lock area — small sunken option box.
- BOTTOM (full width): COLOR BOX — the classic 28-color grid (two rows of 14:
  black, gray8, maroon, olive, green, teal, navy, purple, the lighter row, then
  brown/salmon/pink extras); black foreground + white background squares shown
  at the left of the palette with overlapping corner indicator.
- CENTER: white canvas area with checkerboard-free white bg showing one of my
  project screenshots framed in the canvas, with the classic scrollbars (gray,
  with up/down arrow buttons) on right and bottom.
- Status text bottom: "For Help, click Help Topics on the Help Menu."

Include a note in the design that double-clicking any .bmp/.jpg in My Pictures
opens this viewer. Keep the tool icons pixel-perfect chunky.

--------------------------------------------------------------------
P9 — CALCULATOR + GAMES (winmine.exe Minesweeper)
--------------------------------------------------------------------
Using the DESIGN.md design system, generate TWO app windows:

WINDOW A — CALCULATOR (calc.exe): small fixed-size window, title "Calculator".
- Display: single-line sunken white LCD field right-aligned showing "3.14159".
- Keypad, exact 95 layout, gray beveled square keys, Tahoma 8px:
  MC  MR  MS  M+  (backspace key "Back" wide)
  CE  C   sqrt
  7  8  9  /  %
  4  5  6  *  1/x
  1  2  3  -  =
  0     .  +    (0 is double-width)
- Every key raised with authentic 2px bevel; annotate the pressed state.

WINDOW B — MINESWEEPER (winmine.exe), active and in front: title "Minesweeper".
- Header strip: sunken LCD counter showing "010" (red LED digits) left, the
  yellow SMILEY reset button center (round-ish square, beveled, sunglasses-off
  happy face), and LCD timer "042" right.
- Board: Beginner 9×9 grid of raised gray squares (16px each); a few revealed
  squares with numbers 1/2/3 in their classic colors (1=blue, 2=green, 3=red),
  one square showing the flag (red flag on pole icon), one with a mine hit
  (black mine + red X background), and the rest raised.
- The reveal animation: show one mid-click "pressed flat" square.

Both windows must sit over the Bliss desktop with taskbar buttons visible for
each. No modern game UI whatsoever — pure 1995.

--------------------------------------------------------------------
P10 — SYSTEM DIALOGS (About Me, Shut Down, Error) + Control Panel nod
--------------------------------------------------------------------
Using the DESIGN.md design system, generate the DIALOG collection — small
windows that carry the personality:

DIALOG 1 — ABOUT ME (as System Properties): title "System Properties" (or
"About Me - System Properties"), classic blue title bar, beige/gray body.
- Left: a retro computer icon (CRT + tower, large 48px).
- Right lines: "System:" / "[My Name]" / "Portfolio Machine" / "Registered to:
  [My Name]   [Company]" / "Computer: Pentium II 233 MHz, 64.0 MB RAM".
- Bottom hardware info bars: two 95-style progress/usage bars labeled
  "Performance: Graphics" and "Performance: Hard Disk" partially filled blue.
- Buttons bottom-right: "OK" (default, focused with dotted rect) and "Cancel".

DIALOG 2 — SHUT DOWN: small centered dialog, title "Shut Down Windows",
Windows flag icon + text "What do you want the computer to do?" with radio
options: "Shut down" (selected), "Restart", "Close all programs and log on as a
different user". Buttons: "Yes" (default), "No", "Cancel" — wait, era-correct:
"OK", "Cancel", "Help".

DIALOG 3 — PLAYFUL SYSTEM WARNING: beige body, blue title "System Warning",
yellow triangle exclamation icon left, text: "Are you sure sure you want to
explore amazing work?" with beveled buttons "yes" and "cancel".

DIALOG 4 (mini, corner) — RECYCLE BIN empty state: "The Recycle Bin is empty."
with OK.

Annotation: Dialog 1 opens from Start > Settings > Control Panel > System (and
from double-clicking My Computer > Control Panel > System). Dialog 3 appears
the FIRST time someone opens Projects. All dialogs are modal with dimmed
desktop behind.

====================================================================
EXECUTION ORDER & TIPS
====================================================================
1. Feed DESIGN.md first. Confirm Stitch absorbed it (ask "list my color
   palette and fonts back to me").
2. Run P1 (Desktop) first and lock it — every later prompt says "same chrome
   as P1". If the desktop drifts modern, stop and fix before continuing.
3. After each screen: extract it to code, wire it into the shell, THEN prompt
   the next. Stitch output is a mock; your shell/wm is the real engine.
4. Keep prompts verbatim — the details (status bar text, button order, LED
   counters) are what make it read as REAL Windows 95 and not "retro-themed".
5. Sound last (WebAudio synth: tada on boot, chord on open, ding on error,
   tick on click) — the cheapest authenticity multiplier.
