---
name: Retro OS Desktop
colors:
  surface: '#faf9f9'
  surface-dim: '#dadada'
  surface-bright: '#faf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#464653'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f0f0'
  outline: '#767684'
  outline-variant: '#c6c5d5'
  surface-tint: '#4b53bc'
  primary: '#00003c'
  on-primary: '#ffffff'
  primary-container: '#000080'
  on-primary-container: '#777eea'
  inverse-primary: '#bfc2ff'
  secondary: '#00629e'
  on-secondary: '#ffffff'
  secondary-container: '#53aefd'
  on-secondary-container: '#00406a'
  tertiary: '#220000'
  on-tertiary: '#ffffff'
  tertiary-container: '#4d0000'
  on-tertiary-container: '#d96756'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bfc2ff'
  on-primary-fixed: '#00006e'
  on-primary-fixed-variant: '#3239a3'
  secondary-fixed: '#cfe5ff'
  secondary-fixed-dim: '#9acbff'
  on-secondary-fixed: '#001d34'
  on-secondary-fixed-variant: '#004a78'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#ffb4a8'
  on-tertiary-fixed: '#410000'
  on-tertiary-fixed-variant: '#82271c'
  background: '#faf9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e3e2e2'
  bevel-highlight: '#FFFFFF'
  bevel-shadow: '#808080'
  bevel-dark-shadow: '#404040'
  inactive-title-start: '#808080'
  inactive-title-end: '#B5B5B5'
  desktop-sky-start: '#3A6EA5'
  desktop-sky-end: '#7BB3E8'
  desktop-grass-start: '#4C9A2A'
  desktop-grass-end: '#7EC850'
  folder-yellow: '#F8D878'
  folder-shadow: '#C0A860'
  system-error: '#D40000'
  system-warning: '#FFFF00'
  window-body-bg: '#FFFFFF'
  selection-blue: '#000080'
typography:
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  headline-sm:
    fontFamily: Work Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
  body-md:
    fontFamily: Courier Prime
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  body-sm:
    fontFamily: Courier Prime
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
  label-lg:
    fontFamily: Work Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
  label-md:
    fontFamily: Work Sans
    fontSize: 9px
    fontWeight: '400'
    lineHeight: 12px
  label-sm:
    fontFamily: Work Sans
    fontSize: 8px
    fontWeight: '400'
    lineHeight: 10px
spacing:
  gutter: 0.5rem
  margin: 0.25rem
  space-xs: 0.125rem
  space-sm: 0.25rem
  space-md: 0.375rem
  space-lg: 0.5rem
  space-xl: 1rem
---

## Brand & Style

This design system delivers an authentic retro desktop operating system simulation faithful to the 1995–1998 computing era. Rejecting modern flat surfaces, floating card paradigms, and responsive web scrolling, it structures the user experience around an immersive fixed-ratio desktop canvas complete with draggable windows, an interactive taskbar, chunky pixel icons, and hardware-derived skeuomorphic beveling.

The tone is playful, nostalgic, tactile, and engineered with absolute period accuracy. Every interface element reinforces the illusion of finding a functioning 1997 beige PC tower: physical button presses depress into the screen, modal system dialogs interrupt user actions with stark beveled boundaries, and pixel-precise outlines govern the visual hierarchy.

## Colors

The palette is derived directly from the classic Windows 95/98 desktop shell:
- **Base Chrome (`#C0C0C0`)**: The foundational surface neutral for window headers, taskbars, button faces, dialog containers, and control toolbars.
- **Active Window Gradient (`#000080` to `#1084D0`)**: The active window title bar gradient stretching horizontally from deep navy to bright royal blue.
- **Inactive Window Gradient (`#808080` to `#B5B5B5`)**: Used across non-focused windows to immediately establish depth and focus hierarchy.
- **Structural Bevels**:
  - Light Highlight: `#FFFFFF` (top and left borders for raised surfaces; bottom and right borders for inset wells).
  - Mid Shadow: `#808080` (inner shadow line for inset wells; outer bottom/right border for raised elements).
  - Deep Sunken Shadow: `#404040` (innermost top/left edges of pressed buttons, text input fields, and status bar wells).
- **Functional Accents**: Alert caution yellow (`#FFFF00`) for system modal warning triangles, error red (`#D40000`) for crash/abort icons, and folder gold (`#F8D878` with `#C0A860`) for directory structures.

## Typography

Typography strictly mirrors the rasterized UI rendering of late-1990s graphical operating systems:
- **System Chrome & UI Labels (`Work Sans` mapped to the aesthetic behavior of Tahoma 8–11px)**: Used for all menu bars, button text, dialog descriptions, taskbar buttons, and window controls. Font rendering must be crisp, with anti-aliasing minimized or pixelated where possible.
- **File System & Monospace Documents (`Courier Prime` mapped to Courier New 10–12px)**: Used for plain-text file reading (Notepad simulation), source code snippets, directory properties, and system log dumps.
- **Pixel Display Headers (`Space Grotesk` mapped to 8-bit BIOS and retro game displays)**: Applied to retro boot screens, Minesweeper counters, LCD displays in Media Player / CD Player, and modal headline alerts.

### Text Treatment Rules:
- Desktop icon labels must render in pure white (`#FFFFFF`) with a 1px solid black text drop-shadow / outline to remain legible against the wallpaper.
- Selected icon labels invert: background fill turns to `#000080` with a 1px dotted focus rectangle around the bounding perimeter.

## Layout & Spacing

The layout model does not scroll. The screen viewport is treated as a fixed physical monitor hosting a logical 4:3 or 16:9 canvas (base logical reference: 1024×768) that scales uniformly to fit any browser screen.

### Layout Anatomy:
1. **Desktop Field**: Unbounded workspace containing vertical columns of desktop icons aligned to a strict 72×72px grid starting from top-left (padding: 8px from screen edges).
2. **Taskbar**: A fixed 28px height bar docked continuously to the bottom viewport edge (`width: 100%`, `z-index: 9999`).
3. **Window Shells**: Floating absolute containers with a 3px outer border allowance, 18px height title bar, 18px height menu bar, inner content viewport, and 16px bottom status bar.
4. **Spacing Density**: Spacing tokens are compact and intentional. UI elements never use breathing room greater than 8px (`space-lg`) internally, adhering to the hyper-compact desktop interface packing of Windows 95/97.

## Elevation & Depth

Elevation is achieved purely through multi-tone beveled borders rather than soft blur drop shadows:

### 1. Raised Surfaces (Windows, Inactive Buttons, Taskbar, Menu Bars)
- `border-top: 1px solid #FFFFFF`
- `border-left: 1px solid #FFFFFF`
- `border-right: 1px solid #404040`
- `border-bottom: 1px solid #404040`
- Secondary inner bevel: `box-shadow: inset 1px 1px 0px #DFDFDF, inset -1px -1px 0px #808080`

### 2. Sunken Surfaces (Text Fields, Checkbox Wells, Scrollbar Tracks, Active Taskbar Items)
- `border-top: 1px solid #404040`
- `border-left: 1px solid #404040`
- `border-right: 1px solid #FFFFFF`
- `border-bottom: 1px solid #FFFFFF`
- Secondary inner bevel: `box-shadow: inset 1px 1px 0px #808080, inset -1px -1px 0px #DFDFDF`

### 3. Window Stacking & Z-Index
- Background Wallpaper: `z-index: 0`
- Desktop Icons: `z-index: 10`
- Inactive Windows: `z-index: 100` to `z-index: 400` (ordered by last focus)
- Active Window: Highest window index (`z-index: 500`)
- Taskbar & System Tray: `z-index: 1000`
- Start Menu & Context Popups: `z-index: 2000`
- System Modal Dialogs: `z-index: 3000`

## Shapes

The roundedness level is strictly **0 (Sharp)** across all elements. Border radius must remain `0px` universally without exception. Windows, buttons, tooltips, dialogs, sliders, tabs, scrollbars, and selection rings must feature sharp, razor-edge 90-degree corners. 

Pixel art elements (such as radio buttons or drive indicators) achieve their apparent circular shape via hard-edged stepped bitmap dithering rather than CSS border radii.

## Components

### Buttons
- **Default State**: Surface `#C0C0C0`, 2px raised bevel (`#FFFFFF` top/left, `#404040` bottom/right with `#808080` interior shadow). Padding: 3px 12px. Font: 11px Work Sans bold.
- **Active / Pressed State**: Shift content 1px down and 1px right. Invert bevel to sunken style (`#404040` top/left, `#FFFFFF` bottom/right).
- **Focused State**: Inner 1px black dotted line border inset by 2px from the outer bevel.
- **Window Control Buttons (Minimize, Maximize, Close)**: 16×14px square buttons with centered 8px monochrome glyphs (`_`, `□`, `×`).

### Taskbar & Start Button
- **Taskbar Surface**: Continuous `#C0C0C0` bar with a 2px raised top bevel line.
- **Start Button**: 54px width, 22px height, 2px raised bevel. Displays a 16×16px Windows flag icon followed by "Start" in bold 11px. Depressed when the Start Menu is open.
- **System Tray**: Sunk inset well at the right end of the taskbar holding 16×16 system icons (volume, display) and the live HH:MM digital clock.

### Windows & Dialog Boxes
- **Header**: Height 18px, background gradient `#000080` to `#1084D0` (active) or `#808080` to `#B5B5B5` (inactive). 11px bold text aligned left, accompanied by a 16×16px application icon.
- **Menu Bar**: Height 18px below the title bar. `#C0C0C0` background with text items (`File`, `Edit`, `View`, `Help`). Hovering items inverts colors to navy background with white text.
- **Client Area**: Plain `#FFFFFF` viewport for file contents, or `#C0C0C0` for dialogs and control panels.
- **Status Bar**: Sunk segmented containers at the window bottom providing contextual file sizes, object counts, or navigation hints.

### Inputs & Selection Controls
- **Text Inputs**: Inset well border with `#FFFFFF` background, solid black cursor, and no focus outline beyond the standard sunken bevel.
- **Checkboxes & Radios**: 13×13px square (checkbox) or stepped 13×13px diamond (radio) with sunken border and white interior. Checkmark is a 7×7px black rasterized check.
- **Lists / File Grids**: Multi-column list with header buttons (Name, Size, Type, Date Modified) that act as raised clickable column-sort buttons. Selected rows render with a `#000080` background and `#FFFFFF` text.