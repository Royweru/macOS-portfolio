# Weru 97 — Phased Implementation Tasks

> Active detailed tracker for the complete-window and Stitch fidelity correction: [`plans/weru97-chapter-2-task-list.md`](plans/weru97-chapter-2-task-list.md).

> **Every task here is atomic.** Each can be implemented, tested, and verified independently. Phases are ordered by dependency — later phases build on earlier ones.

## Execution Tracking

- **Project identity:** Weru 97
- **Canonical plan:** `plans/windows97-master-plan.md`
- **Phase history:** `achievements/`
- **Stitch source artifacts:** `Stitch Designs/`
- **Live status:** `[ ]` not started · `[~]` in progress · `[x]` verified complete
- **Current status:** `[~]` Chapter 2 execution is active — shared window controls, persisted repair, shell/app routing, BSOD recovery, system dialogs, and the major application workflows are verified; formal screenshot parity and a complete pointer/touch matrix remain
- **Visual fidelity pass:** `[~]` Chapter 2 tracker saved to `plans/weru97-chapter-2-task-list.md`; the desktop is explicitly a required Stitch screen, not a generic backdrop. Its source wallpaper geometry and nine source-derived icon drawings are now in the active full-width React shell. The requested 46px taskbar and larger icons are intentional size deviations; exact screenshot parity remains open. See the 2026-09-23 addendum in `plans/weru97-chapter-2-parity-audit-2026-09-22.md`.
- **Stitch scope:** Raw local Stitch HTML is preserved under `Stitch Designs/html`; `src/data/stitch-screen-manifest.ts` is the conversion map. Stitch mock scripts are not production code.
- **Execution note:** Phase 6+ execution resumed by the user on 2026-09-20. Existing foundation work is preserved; each subsequent phase is being verified against the current application registry, filesystem seed, and shell orchestrator.

### Completion Audit — 2026-09-21

The previous execution ledger records several non-Stitch slices as delivered, but a source-level audit found that the project is not complete outside Stitch work. Some entries are adapters or foundations rather than the full task-list implementations. See `plans/completion-audit-2026-09-21.md` and `achievements/audit-2026-09-21.md` for the evidence and corrected scope.

### Implementation Update — 2026-09-21

The dedicated window manager, boot sequence, sound, visitor, screensaver, BSOD, app entry-point, and Stitch screen-manifest slices are now implemented. See `plans/stitch-screen-conversion.md` and `achievements/phase-06-10-architecture-stitch.md`.

### Visual Fidelity Execution Update — 2026-09-21

The visual-fidelity correction pass was later superseded by the user's explicit full-browser-viewport requirement: do not render a fixed 1024×768 desktop. Keep Stitch's source-authored positions where useful, fill the browser with the shell/taskbar, and clamp windows to the actual visible work area. The historical visual-fidelity checklist notes this supersession at its top; Chapter 2 is authoritative.

### Chapter 2 Parity Audit Update — 2026-09-22

The active Chapter 2 tracker has been audited line by line. Verified implementation and runtime evidence now covers the shared window manager, persisted-window repair, shell controls, Explorer/Notepad workflow, IE, CD Player, Calculator, Minesweeper, Paint surface, MS-DOS/BSOD recovery, system dialogs, boot path, classic CSS boundary, and all 12 manifest IDs. The remaining `[~]` items are deliberately limited to formal multi-viewport/pointer-touch evidence, exact screenshot comparisons, missing independent Stitch artifacts, and real media files. See `plans/weru97-chapter-2-parity-audit-2026-09-22.md` and `achievements/chapter-2-parity-audit-2026-09-22.md`.

### Current Execution Status

| Phase | Status | Verified scope | Remaining scope |
|---|---|---|---|
| 0 — Foundation | `[x]` | Control plane, manifest, Win95 tokens/bevels/fonts/CRT, imports, metadata, visual-fidelity plan, initial local asset directories, baseline gates | Final dead-file/dependency cleanup |
| 1 — Kernel Adaptation | `[~]` | Weru 97 OS phases/settings, layout v6 paths, manifest-driven filesystem seed, app registry, extension routing | Full legacy removal and final filesystem migration cleanup |
| 2 — UI Kit | `[~]` | Button, title bar, menu bar, dialog, status bar, toolbar, taskbar button, clock, complete local icon/cursor manifest, enlarged shell sizing | Contract parity, final visual comparison, fallback elimination |
| 3 — Shell | `[~]` | Desktop97, Stitch-proportioned StartMenu97, Taskbar97, Internet Explorer shortcut, Bliss SVG, canonical 1024x768 stage, context-menu behavior | Full cross-viewport Stitch comparison and remaining legacy overlay audit |
| 4 — Window Manager | `[~]` | Window97 chrome, pointer drag/resize, maximize/minimize/focus/taskbar integration, control-event propagation guard, larger resize hit zones, logical work-area clamps | Full multi-window matrix and legacy adapter cleanup |
| 5 — Boot Sequence | `[~]` | Dedicated BootSequence97 BIOS/start/logo flow, preload, skip, one-way transition, and first-visit wizard | Full timing/manual comparison and old BootScreen cleanup |
| 6 — Core Apps | `[~]` | Explorer/Notepad/Recycle Bin functional surfaces, Explorer duplicate-key/runtime hygiene, MS-DOS entry point, persistent filesystem workflows, DOS `crash` effect | Full native Win97 app parity and permanent-delete confirmation |
| 7 — Media Apps | `[~]` | Dedicated media entry points, custom video/audio controls, CD equalizer, Paint tools/palette/zoom/drawing surface | Real bundled media assets and Stitch screenshot comparison |
| 8 — Utility Apps | `[~]` | Calculator visual/state foundation, Control Panel, System Properties, IE4 surface, visitor behavior, and utility-dialog close/open contracts | Deeper tabbed utility behavior and Stitch screenshot comparison |
| 9 — Delight Layer | `[~]` | Screensaver, synthesized sound engine, BSOD recovery surface, Minesweeper functional interaction/state presentation, DOS crash routing | Event-by-event sound wiring, full easter-egg pass, manual recovery verification |
| 10 — Polish & Production | `[~]` | Visitor route/hook, responsive/reduced-motion rules, type/lint/test/build gates, classic CSS boundary cleanup | Production KV verification, Lighthouse, complete browser suite, final cleanup |

### Stitch Reference Screens

The implementation must inspect and classify these references before implementing their corresponding UI:

| Screen | Stitch screen ID | Initial area |
|---|---|---|
| Project Explorer & Notepad | `9e70e97521b041b0b2575fd0322ace42` | Explorer / Notepad |
| Dual Explorer Windows | `0f3046a574c8480da785b5f8f49b8b31` | Window manager |
| Internet Explorer | `0de14a31211048eca172e442e500ec10` | IE4 |
| Dual Explorer Variant | `4a970d6cdecc4810a3b1eea9446779f9` | Window manager |
| CD Player | `47dfc46a772046c183e86027164941c5` | CD Player |
| OS Desktop | `e05eddbf62974f6484f6b284b8b879ae` | Desktop shell |
| Media Player | `c018f85035a4472f911c7a809fab2cc6` | Media Player |
| Paint | `85ab0677c7404c0d93c0d97b45252680` | Paint |
| Calculator & Minesweeper | `e85aa0ce9dff439bba14c7e1ffbe0a68` | Utilities / games |
| System Dialogs Variant A | `ac63fe5b9e0a43e29ebf1bc4e9ebfba7` | System dialogs |
| System Dialogs Variant B | `799ddaad07824567a8cd7dc487e75048` | System dialogs |
| Desktop with Menus | `62940bee0245407896b9283e0ef41f1b` | Start/context menus |

### Visual Fidelity Pass — Live Task Breakdown

| Slice | Status | Evidence / remaining work |
|---|---|---|
| Baseline and plan records | `[x]` | Plan, implementation addendum, task tracker, and achievement entry saved |
| Stitch source audit | `[~]` | Desktop, Paint, calculator/Minesweeper, IE, media, and CD source dimensions/styling were sampled; full screen-by-screen extraction review remains |
| Pixel icons and cursors | `[x]` | Local desktop/file/application/system SVG set, cursor states, manifest, hotspots, and nearest-neighbor rules are in place |
| Bliss wallpaper | `[~]` | Local SVG added and preloaded; browser comparison remains |
| Window controls | `[~]` | Drag guard, pointer-safe title-bar controls, 10px resize hit zones, logical-stage scaling, and work-area clamping added; manual close/resize verification remains |
| Canonical canvas | `[x]` | `Shell97` now renders a centered 1024x768 logical stage with uniform viewport scaling and logical drag/resize deltas |
| Taskbar/Start fidelity | `[~]` | 30px logical taskbar, focused/minimized task-button state, retro tray indicators, and 210px Stitch-proportioned vertical-banner Start menu are implemented; final cross-viewport comparison remains |
| Boot sequence runtime | `[x]` | One-way stage transition verified in browser; full-viewport boot no longer loops between stages |
| Desktop runtime smoke | `[x]` | Bliss desktop, taskbar, wizard, Internet Explorer shortcut, close, and southeast resize verified in browser |

---

## Dependency & Library Plan

### Keep (already installed)
| Library | Why We Keep It |
|---------|---------------|
| `next@16` | Framework, SSR, API routes |
| `react@19`, `react-dom@19` | UI runtime |
| `zustand@5` | OS state management (kernel) |
| `dexie@4` + `dexie-react-hooks` | IndexedDB virtual filesystem |
| `framer-motion@12` | Boot animations, window transitions |
| `lucide-react` | Base for icon composition |
| `tailwindcss@3` | Utility CSS layer under our tokens |
| `date-fns` | Clock, timestamps |
| `clsx` + `tailwind-merge` | Conditional class composition |
| `@vercel/analytics` | Visitor analytics |
| `vitest` | Unit testing |
| `typescript@5.9` | Type safety |
| `zod` | Runtime validation |

### Remove (dead weight for Win95)
| Library | Why |
|---------|-----|
| `gsap` + `@gsap/react` | Overkill for Win95 animations — Framer Motion + CSS sufficient |
| `react-rnd` | Current drag/resize — replacing with pointer-capture custom hooks |
| `react-resizable-panels` | Not used in Win95 paradigm |
| `cmdk` | macOS Spotlight palette — removing |
| `sonner` | Modern toast notifications — not Win95 |
| `vaul` | Drawer component — not Win95 |
| `next-themes` | Win95 has one theme (gray) |
| `input-otp` | Not used |
| `embla-carousel-react` | Not used |
| `recharts` | Not used in Win95 |
| `react-day-picker` | Replacing with custom 90s calendar |
| `react-hook-form` + `@hookform/resolvers` | Overkill for Win95 dialogs |
| `web-vitals` | Keep only if needed for monitoring |
| Most `@radix-ui/*` | Replacing with custom Win95 primitives |

### Add (new dependencies)
| Library | Why | Size |
|---------|-----|------|
| `@vercel/kv` | Visitor counter (server-side Redis) | ~15KB |
| None else | Win95 UI is all custom CSS + HTML — no component libraries needed |

> [!TIP]
> **The Win95 aesthetic is so simple that we barely need libraries.** Bevels are 4 CSS border rules. Buttons are `<button>` with bevel classes. No shadows, no gradients (except title bars), no border-radius. This is the lightest UI system possible.

---

## File Disposition Map

Every existing source file, what happens to it:

| File | Action | Phase |
|------|--------|-------|
| `src/App.tsx` | **REWRITE** — new Shell97 orchestrator | P3 |
| `src/app/globals.css` | **MODIFY** — swap imports to Win97 stylesheets | P0 |
| `src/app/layout.tsx` | **MODIFY** — update metadata title/description | P0 |
| `src/app/page.tsx` | **KEEP** — unchanged | — |
| `src/app/portfolio-client.tsx` | **KEEP** — unchanged (SSR boundary) | — |
| `src/components/AppIcon.tsx` | **REWRITE** — Win95 32px pixel icons | P2 |
| `src/components/BootScreen.tsx` | **REWRITE** — BIOS POST → boot sequence | P5 |
| `src/components/Desktop.tsx` | **REWRITE** — Desktop97 with left-column icons | P3 |
| `src/components/Dock.tsx` | **DELETE** | P0 |
| `src/components/MenuBar.tsx` | **DELETE** | P0 |
| `src/components/Sidebar/index.tsx` | **DELETE** | P0 |
| `src/components/Spotlight/` | **DELETE** (entire directory) | P0 |
| `src/components/ViewControls/index.tsx` | **DELETE** | P0 |
| `src/components/Window.tsx` | **REWRITE** — Window97 chrome with bevels | P4 |
| `src/components/common/ErrorBoundary.tsx` | **KEEP** — restyle only | P10 |
| `src/constants/index.ts` | **REWRITE** — Win97 configs, remove macOS data | P1 |
| `src/data/portfolio-document-manifest.ts` | **REPLACE** with unified `portfolio-manifest.ts` | P0 |
| `src/data/project-media-manifest.ts` | **REPLACE** with unified `portfolio-manifest.ts` | P0 |
| `src/data/projects_data.json` | **REPLACE** with unified `portfolio-manifest.ts` | P0 |
| `src/features/apps/app-registry.ts` | **REWRITE** — expand with all Win97 apps | P1 |
| `src/features/desktop/QuickSettings.tsx` | **DELETE** | P0 |
| `src/features/desktop/StartMenu.tsx` | **REWRITE** — cascading Win95 Start Menu | P3 |
| `src/features/desktop/Taskbar.tsx` | **REWRITE** — Win95 left-aligned taskbar | P3 |
| `src/features/filesystem/filesystem-db.ts` | **KEEP** — unchanged | — |
| `src/features/filesystem/filesystem-service.ts` | **MODIFY** — re-seed with Win95 tree | P1 |
| `src/features/filesystem/filesystem-types.ts` | **KEEP** — unchanged | — |
| `src/features/filesystem/use-filesystem-bootstrap.ts` | **KEEP** — unchanged | — |
| `src/features/filesystem/virtual-paths.ts` | **MODIFY** — flatten to `C:\My Documents`, `C:\Projects` | P1 |
| `src/features/media/media-types.ts` | **MODIFY** — add .avi/.wav/.mid associations | P7 |
| `src/features/os/open-target.ts` | **MODIFY** — add .spec, .bmp, .wav routing | P1 |
| `src/features/os/os-store.ts` | **MODIFY** — remove snap/virtual desktops, add Win95 modes | P1 |
| `src/features/os/os-types.ts` | **REWRITE** — Win95 types | P1 |
| `src/features/os/profile-storage.ts` | **KEEP** — unchanged | — |
| `src/features/terminal/terminal-commands.ts` | **MODIFY** — add Win95 commands, restyle output | P6 |
| `src/features/terminal/terminal-parser.ts` | **KEEP** — unchanged | — |
| `src/features/terminal/terminal-types.ts` | **KEEP** — unchanged | — |
| `src/features/window-manager/snap-engine.ts` | **DELETE** — no Aero Snap in Win95 | P0 |
| `src/features/window-manager/use-work-area.ts` | **MODIFY** — taskbar height 30px → 30 | P3 |
| `src/hooks/useParallax.ts` | **DELETE** | P0 |
| `src/hooks/useSpotlight.ts` | **DELETE** | P0 |
| `src/hooks/useWindowManager.ts` | **MODIFY** — remove snap, adapt for Win97 | P4 |
| `src/styles/base.css` | **REWRITE** — Win95 reset, font-face, tokens | P0 |
| `src/styles/boot.css` | **REWRITE** — BIOS POST + clouds boot styles | P5 |
| `src/styles/dock.css` | **DELETE** | P0 |
| `src/styles/menubar.css` | **DELETE** | P0 |
| `src/styles/tokens.css` | **REWRITE** — Win95 color palette | P0 |
| `src/styles/wallpaper.css` | **REWRITE** — Bliss + CRT scanlines | P0 |
| `src/styles/window.css` | **REWRITE** — Win95 window chrome | P2 |
| `src/styles/windows-shell.css` | **REWRITE** — Win95 taskbar/start/tray | P3 |
| `src/types/index.ts` | **REWRITE** — Win97 type definitions | P1 |
| `src/utils/layout.ts` | **MODIFY** — remove macOS comments/constants | P1 |
| `src/windows/AboutContent.tsx` | **REWRITE** → SystemProperties97 | P8 |
| `src/windows/ContactContent.tsx` | **REWRITE** → IE4 contact form | P8 |
| `src/windows/ExperienceContent.tsx` | **DELETE** — merged into Notepad `experience.txt` | P0 |
| `src/windows/ExplorerContent.tsx` | **REWRITE** — Win95 Explorer | P6 |
| `src/windows/MediaPlayerContent.tsx` | **REWRITE** — Win95 Media Player + real `<video>` | P7 |
| `src/windows/NotepadContent.tsx` | **REWRITE** — Win95 Notepad | P6 |
| `src/windows/ProjectDetailContent.tsx` | **DELETE** — projects are folders now, not cards | P0 |
| `src/windows/ProjectsContent.tsx` | **DELETE** — projects are Explorer folders now | P0 |
| `src/windows/RecycleBinContent.tsx` | **REWRITE** — Win95 Recycle Bin | P6 |
| `src/windows/SettingsContent.tsx` | **DELETE** — replaced by Control Panel | P0 |
| `src/windows/SkillsContent.tsx` | **DELETE** — merged into Notepad `skills.txt` | P0 |
| `src/windows/TerminalContent.tsx` | **REWRITE** — MS-DOS Prompt | P6 |
| `windows/TerminalContent.tsx` | **REWRITE** — MS-DOS Prompt (root dir copy) | P6 |

---

## Phase 0 — Foundation (Days 1–2)

> **Goal:** Clean slate. Design tokens. Content manifest. Dead code gone.

### 0.1 Create Portfolio Manifest (Single Source of Truth)

> [!IMPORTANT]
> **This is the #1 architectural decision.** ALL portfolio content lives in ONE TypeScript file. To add a project, Roy adds an object. To change his bio, he edits one string. Zero coupling to components.

- **[NEW]** `src/data/portfolio-manifest.ts`
- Contains:
  ```typescript
  // ─── The ONE file Roy edits to change portfolio content ──────
  
  export interface ProjectDefinition {
    id: string;                    // unique slug: "afyatrack"
    folderName: string;            // folder display name: "AfyaTrack"
    icon: string;                  // emoji or icon key
    tag: 'AI' | 'Dev' | 'Design'; // category
    accent: string;                // hex accent color
    readme: string;                // multi-line plain text for README.txt
    skillsUsed: string[];          // ["React", "Next.js", "AI"]
    techStack: {                   // for tech-stack.spec dialog
      language: string;
      framework: string;
      database?: string;
      hosting?: string;
      other?: string[];
    };
    files: {
      demo?: { src: string; mimeType: string };        // video
      screenshots?: string[];                            // image URLs
      audio?: { src: string; title: string };            // audio demo
      liveSite?: string;                                 // URL
      sourceCode?: string;                               // GitHub URL
    };
  }

  export interface DocumentDefinition {
    id: string;
    filename: string;              // "about_me.txt"
    content: string;               // the actual text
    readOnly: boolean;             // system files = true
  }

  export interface AudioTrack {
    id: string;
    title: string;
    artist: string;
    src: string;                   // URL or /media/audio/track.mp3
    duration?: number;             // seconds
  }

  export const PROFILE = {
    name: 'Roy Weru Matheri',
    title: 'Full-Stack Developer & AI Engineer',
    location: 'Nairobi, Kenya',
    email: 'weru.dev@gmail.com',
    github: 'https://github.com/Royweru',
    linkedin: 'https://www.linkedin.com/in/roy-matheri-59b8a5245',
    bio: '...',                    // Roy fills this in
  };

  export const PROJECTS: ProjectDefinition[] = [
    { id: 'afyatrack', folderName: 'AfyaTrack', ... },
    { id: 'kontent-pyper', folderName: 'Kontent-Pyper', ... },
    // ... Roy adds/removes here
  ];

  export const DOCUMENTS: DocumentDefinition[] = [
    { id: 'about', filename: 'about_me.txt', content: '...', readOnly: true },
    { id: 'skills', filename: 'skills.txt', content: '...', readOnly: true },
    { id: 'experience', filename: 'experience.txt', content: '...', readOnly: true },
    { id: 'resume', filename: 'Resume.txt', content: '...', readOnly: true },
  ];

  export const SKILLS: SkillGroup[] = [ ... ]; // same structure, moved here
  export const JOBS: Job[] = [ ... ];           // same structure, moved here
  export const AUDIO_TRACKS: AudioTrack[] = [ ... ];
  ```
- **Verification:** TypeScript compiles. All existing data from `projects_data.json`, `portfolio-document-manifest.ts`, `project-media-manifest.ts`, `constants/index.ts` (SKILLS, JOBS) migrated here.

### 0.2 Win95 CSS Design Tokens

- **[NEW]** `src/styles/tokens97.css`
- CSS custom properties:
  ```css
  :root {
    /* ── Surface palette ── */
    --w95-surface:       #C0C0C0;
    --w95-surface-dark:  #808080;
    --w95-surface-light: #DFDFDF;
    --w95-window-bg:     #FFFFFF;
    --w95-desktop-bg:    #008080;  /* teal fallback if no wallpaper */

    /* ── Bevel system ── */
    --w95-bevel-light:   #FFFFFF;
    --w95-bevel-dark:    #808080;
    --w95-bevel-shadow:  #404040;

    /* ── Title bar ── */
    --w95-title-active:   linear-gradient(90deg, #000080, #1084D0);
    --w95-title-inactive: #808080;
    --w95-title-text:     #FFFFFF;

    /* ── Selection / Focus ── */
    --w95-highlight:      #000080;
    --w95-highlight-text: #FFFFFF;

    /* ── Text ── */
    --w95-text:           #000000;
    --w95-text-disabled:  #808080;

    /* ── Taskbar ── */
    --w95-taskbar-bg:     #C0C0C0;
    --w95-start-green:    #008000;

    /* ── Font stacks ── */
    --w95-font-ui:        'Tahoma', 'MS Sans Serif', 'Arial', sans-serif;
    --w95-font-mono:      'Courier New', 'Courier', monospace;
    --w95-font-terminal:  'VT323', 'Courier New', monospace;
    --w95-font-bios:      'VT323', 'Courier New', monospace;
    --w95-font-lcd:       'VT323', monospace;

    /* ── Sizes ── */
    --w95-titlebar-h:     20px;
    --w95-menubar-h:      20px;
    --w95-statusbar-h:    22px;
    --w95-taskbar-h:      30px;
    --w95-icon-size:      32px;
    --w95-icon-small:     16px;
    --w95-bevel-width:    2px;

    /* ── Cursors ── */
    --w95-cursor-default: url('/assets/cursors/arrow.cur'), default;
    --w95-cursor-pointer: url('/assets/cursors/hand.cur'), pointer;
    --w95-cursor-text:    url('/assets/cursors/beam.cur'), text;
    --w95-cursor-wait:    url('/assets/cursors/hourglass.cur'), wait;
    --w95-cursor-move:    url('/assets/cursors/move.cur'), move;
  }
  ```

### 0.3 Win95 Bevel System

- **[REWRITE]** `src/styles/bevels.css` (file exists, rewrite contents)
- Utility classes:
  ```css
  .raised   { border: var(--w95-bevel-width) solid;
              border-color: var(--w95-bevel-light) var(--w95-bevel-dark) 
                            var(--w95-bevel-dark) var(--w95-bevel-light); }
  .sunken   { border: var(--w95-bevel-width) solid;
              border-color: var(--w95-bevel-dark) var(--w95-bevel-light) 
                            var(--w95-bevel-light) var(--w95-bevel-dark); }
  .etched   { /* double border inset effect */ }
  .field    { /* sunken white input field */ }
  .window-frame { /* outer + inner bevel */ }
  .pressed  { /* inverted bevel for pressed buttons */ }
  ```

### 0.4 Font Setup

- **[NEW]** `src/styles/fonts97.css`
- `@font-face` declarations for:
  - `Tahoma` — primary UI font (fallback to MS Sans Serif → Arial)
  - `VT323` — Google Font, for terminal/BIOS/LCD displays
  - `Courier New` — system monospace for Notepad
- Load VT323 from Google Fonts CDN in `layout.tsx`

### 0.5 CRT Scanline Overlay

- **[NEW]** `src/styles/crt.css`
- `.crt-overlay` — repeating-linear-gradient of 1px transparent / 1px rgba(0,0,0,0.03) over entire viewport
- Applied to desktop root element

### 0.6 Wallpaper Rewrite

- **[REWRITE]** `src/styles/wallpaper.css`
- Replace Bloom gradients with:
  - `.wallpaper-bliss` — background-image of Bliss photo, `background-size: cover`
  - `.wallpaper-teal` — solid `#008080` fallback
  - `.wallpaper-starry` — midnight easter egg variant
  - `image-rendering: pixelated` at reduced resolution for retro feel

### 0.7 Base CSS Rewrite

- **[REWRITE]** `src/styles/base.css`
- Replace `Segoe UI Variable` with `var(--w95-font-ui)`
- Replace `--os-accent: #0067c0` with Win95 tokens
- Global: `font-size: 11px`, `cursor: var(--w95-cursor-default)`
- Tailwind `@tailwind base; @tailwind components; @tailwind utilities;` stays
- Import order: `tokens97.css` → `bevels.css` → `fonts97.css` → `crt.css`

### 0.8 globals.css Import Cleanup

- **[MODIFY]** `src/app/globals.css`
- Remove: `dock.css`, `menubar.css`, `spotlight.css`
- Add: `tokens97.css`, `bevels.css`, `fonts97.css`, `crt.css`
- Keep: `base.css`, `window.css`, `windows-shell.css`, `wallpaper.css`, `boot.css` (all will be rewritten in later phases)

### 0.9 Layout Metadata Update

- **[MODIFY]** `src/app/layout.tsx`
- `title: 'Weru 97'`
- `description: 'Roy Weru Matheri — Portfolio OS. Best viewed at 800×600.'`
- Add VT323 Google Font `<link>` preload

### 0.10 Dead Code Deletion

- **[DELETE]** these files:
  - `src/components/Dock.tsx`
  - `src/components/MenuBar.tsx`
  - `src/components/Sidebar/index.tsx`
  - `src/components/Spotlight/index.tsx`
  - `src/components/Spotlight/spotlight.css`
  - `src/components/ViewControls/index.tsx`
  - `src/hooks/useParallax.ts`
  - `src/hooks/useSpotlight.ts`
  - `src/features/desktop/QuickSettings.tsx`
  - `src/features/window-manager/snap-engine.ts`
  - `src/styles/dock.css`
  - `src/styles/menubar.css`
  - `src/windows/ProjectsContent.tsx`
  - `src/windows/ProjectDetailContent.tsx`
  - `src/windows/ExperienceContent.tsx`
  - `src/windows/SkillsContent.tsx`
  - `src/windows/SettingsContent.tsx`
  - `src/data/projects_data.json`
  - `src/data/portfolio-document-manifest.ts`
  - `src/data/project-media-manifest.ts`
- **Verification:** `npm run build` still compiles (with temporary stubs where needed)

### 0.11 Dependency Cleanup

- `npm uninstall gsap @gsap/react react-rnd react-resizable-panels cmdk sonner vaul next-themes input-otp embla-carousel-react recharts react-day-picker react-hook-form @hookform/resolvers web-vitals`
- Uninstall unused Radix packages: `@radix-ui/react-accordion @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-collapsible @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-navigation-menu @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-switch @radix-ui/react-toggle @radix-ui/react-toggle-group`
- Keep Radix: `context-menu` (for right-click), `dialog` (for modals), `popover` (for tooltips/tray), `dropdown-menu` (for start/context), `menubar` (for window menus), `tabs` (for tabbed dialogs), `checkbox`, `slider` (volume/seek), `scroll-area`, `progress`, `tooltip`
- `npm install @vercel/kv`
- **Verification:** `npm run build` passes. Bundle size reduced significantly.

### 0.12 Asset Directory Setup

- **[NEW]** `public/assets/cursors/` — download Win95 cursor .cur files (arrow, hand, beam, hourglass, move, resize variants)
- **[NEW]** `public/assets/icons/` — 32px pixel art PNG icons (will populate per phase)
- **[NEW]** `public/assets/wallpaper/` — Bliss.jpg wallpaper image
- **[NEW]** `public/media/videos/` — placeholder directory for project demo videos
- **[NEW]** `public/media/audio/` — placeholder directory for CD Player tracks
- **[NEW]** `public/media/images/` — placeholder directory for project screenshots

---

## Phase 1 — Kernel Adaptation (Days 2–3)

> **Goal:** Zustand store, types, filesystem, and app registry adapted for Win95.

### 1.1 OS Types Rewrite

- **[REWRITE]** `src/features/os/os-types.ts`
- Changes:
  - `OsPhase` → `'bios' | 'starting' | 'logo' | 'desktop'` (replaces `'lock' | 'login' | 'welcome' | 'desktop'`)
  - `WindowMode` → `'normal' | 'minimized' | 'maximized'` (remove `'snapped'`)
  - **DELETE** `SnapSlot` type entirely
  - `WindowInstance` — remove `snapSlot` field, remove `desktopId` (no virtual desktops)
  - Add `menuBar?: MenuBarConfig[]` to `WindowInstance` for per-window menus
  - `OsSettings` — remove `taskbarAlignment` (always left in Win95), remove `accentColor`, add `soundEnabled: boolean`, `screensaverEnabled: boolean`, `screensaverTimeout: number`
  - **DELETE** `VirtualDesktop` interface
  - `OsCommand` — add `'toggle-start-menu'`, `'show-run-dialog'`, `'show-find-dialog'`, remove `'switch-desktop'`

### 1.2 Zustand Store Simplification

- **[MODIFY]** `src/features/os/os-store.ts`
- Remove: `desktops[]`, `activeDesktopId`, `switchDesktop`, all snap-related logic
- Remove: `setWindowMode('snapped')` paths
- Add: `startMenuOpen: boolean`, `toggleStartMenu()`
- Change `phase` initial value from `'lock'` to `'bios'`
- Simplify `settings` default to Win95 schema
- Keep: `windows`, `zOrder`, `focusedWindowId`, `openWindow`, `closeWindow`, `focusWindow`, `minimizeWindow`, `restoreWindow`, `toggleMaximize`, `moveWindow`, `resizeWindow`, `updateWindowRect`, `setSettings`, `shortcuts`, `setShortcutPosition`
- Change localStorage key from `weru-os-state-${id}` to `weru97-state-${id}`
- **Verification:** Store compiles. Unit test: open → minimize → restore → close cycle.

### 1.3 Shared Types Rewrite

- **[REWRITE]** `src/types/index.ts`
- `WindowId` — replace union:
  ```typescript
  export type WindowId =
    | 'explorer' | 'notepad' | 'media-player' | 'cd-player'
    | 'paint' | 'calculator' | 'ie4' | 'msdos'
    | 'minesweeper' | 'solitaire'
    | 'system-properties' | 'control-panel' | 'recycle-bin'
    | 'run-dialog' | 'find-files' | 'shut-down'
    | string; // allow dynamic IDs for multiple instances
  ```
- Remove `DockItem` interface
- Remove `SidebarFavorite`, `SidebarTag`
- Replace `MenuEntry` with Win95 menu structure
- Keep: `Project` (now sourced from manifest), `Skill`, `SkillGroup`, `Job`
- Add: `Win95MenuBarItem`, `Win95ContextMenuItem`

### 1.4 Virtual Paths Flattening

- **[MODIFY]** `src/features/filesystem/virtual-paths.ts`
- Change `VIRTUAL_PATHS`:
  ```typescript
  export const VIRTUAL_PATHS = {
    root: 'C:\\',
    myDocuments: 'C:\\My Documents',
    projects: 'C:\\Projects',
    programFiles: 'C:\\Program Files',
    windows: 'C:\\Windows',
    windowsMedia: 'C:\\Windows\\Media',
    windowsSystem: 'C:\\Windows\\System',
    recycled: 'C:\\Recycled',
    startMenu: 'C:\\Windows\\Start Menu',
    // removed: C:\Users\Admin\Desktop\... hierarchy
  } as const;
  ```
- Bump `VIRTUAL_LAYOUT_VERSION` to `6` (triggers re-seed)
- **Verification:** `vitest run virtual-paths.test.ts` passes after updating tests

### 1.5 Filesystem Re-Seed

- **[MODIFY]** `src/features/filesystem/filesystem-service.ts`
- Rewrite `seedFilesystem()` to create Win95 tree:
  - `C:\` root
  - `C:\My Documents\` with `about_me.txt`, `skills.txt`, `experience.txt`, `Resume.txt` (from `DOCUMENTS` manifest)
  - `C:\My Documents\Videos\` — populate from projects that have video demos
  - `C:\Projects\` — one folder per `PROJECTS` entry, each containing `README.txt`, `skills-used.txt`, `tech-stack.spec`, and optional `demo.avi`, `screenshots.bmp`, `live-site.url`, `source-code.url`
  - `C:\Program Files\Accessories\` with shortcut nodes (notepad.exe, calc.exe, etc.)
  - `C:\Program Files\Games\` with shortcut nodes
  - `C:\Windows\System\secrets.txt` (easter egg)
  - `C:\Windows\Media\` sound scheme files (virtual, not real files)
  - `C:\Recycled\` (empty)
  - Hidden root files: `IO.SYS`, `MSDOS.SYS`, `COMMAND.COM`
- **Key:** Use `PROJECTS` and `DOCUMENTS` from portfolio-manifest.ts. The seeder iterates over these arrays, so adding/removing a project automatically adds/removes the folder.
- **Verification:** Boot the app → Explorer opens at `C:\` → all folders visible. `dir` in terminal lists correct tree.

### 1.6 App Registry Expansion

- **[REWRITE]** `src/features/apps/app-registry.ts`
- Add entries for all Win97 apps:
  ```typescript
  export const APP_REGISTRY: RegisteredApp[] = [
    { id: 'explorer', name: 'Windows Explorer', icon: 'explorer', fileExtensions: [], ... },
    { id: 'notepad', name: 'Notepad', icon: 'notepad', fileExtensions: ['.txt', '.md', '.log'], ... },
    { id: 'media-player', name: 'Media Player', icon: 'media-player', fileExtensions: ['.avi', '.mp4', '.webm'], ... },
    { id: 'cd-player', name: 'CD Player', icon: 'cd-player', fileExtensions: ['.wav', '.mp3', '.mid'], ... },
    { id: 'paint', name: 'Paint', icon: 'paint', fileExtensions: ['.bmp', '.jpg', '.png'], ... },
    { id: 'calculator', name: 'Calculator', icon: 'calculator', fileExtensions: [], canOpenMultiple: false, ... },
    { id: 'ie4', name: 'Internet Explorer', icon: 'ie4', fileExtensions: ['.url', '.htm'], ... },
    { id: 'msdos', name: 'MS-DOS Prompt', icon: 'msdos', fileExtensions: [], ... },
    { id: 'minesweeper', name: 'Minesweeper', icon: 'minesweeper', fileExtensions: [], ... },
    { id: 'system-properties', name: 'System Properties', icon: 'system', fileExtensions: ['.spec'], ... },
    { id: 'control-panel', name: 'Control Panel', icon: 'control-panel', fileExtensions: [], ... },
    { id: 'recycle-bin', name: 'Recycle Bin', icon: 'recycle-bin', fileExtensions: [], ... },
  ];
  ```
- Add `resolveAppForExtension(ext: string): RegisteredApp | undefined` utility
- **Verification:** `resolveAppForExtension('.txt')` returns Notepad. `.avi` returns Media Player.

### 1.7 Open Target Enhancement

- **[MODIFY]** `src/features/os/open-target.ts`
- Add `.spec` → `system-properties` routing
- Add `.bmp`/`.jpg`/`.png` → `paint` routing
- Add `.wav`/`.mp3` → `cd-player` routing
- Use `resolveAppForExtension` from new app-registry
- **Verification:** Double-click `.spec` file → System Properties opens. Unit test.

### 1.8 Constants Rewrite

- **[REWRITE]** `src/constants/index.ts`
- Remove: `MENU_BAR_ITEMS`, `MENU_BAR_SEPARATORS`, `MENU_BAR_MENUS` (macOS)
- Remove: `DESKTOP_ITEMS` (macOS icons), `SIDEBAR_FAVORITES`, `SIDEBAR_TAGS`
- Remove: `DESKTOP_CONTEXT_ITEMS` (macOS context menu)
- Move `SKILLS` and `JOBS` to `portfolio-manifest.ts`
- Add: `WINDOW_CONFIGS` rewritten for Win95 dimensions
- Add: `DESKTOP_SHORTCUTS` — Win95 left-column icons with positions
- Add: `START_MENU_STRUCTURE` — cascading menu tree
- Add: `CONTEXT_MENU_DESKTOP`, `CONTEXT_MENU_FILE`, `CONTEXT_MENU_TASKBAR`
- **Verification:** TypeScript compiles. No orphan imports.

### 1.9 Layout Utils Cleanup

- **[MODIFY]** `src/utils/layout.ts`
- Remove comment `"Slightly above center for macOS feel"`
- Change `Math.max(28, y)` (macOS menu bar) to `Math.max(0, y)` (no top bar in Win95)
- Adjust `getResponsiveWindowSize` defaults for Win95 windows (smaller)

---

## Phase 2 — Win95 UI Component Kit (Days 3–5)

> **Goal:** The COMCTL32 equivalent — reusable building blocks.

### 2.1 Button95 Component

- **[NEW]** `src/components/win95/Button95.tsx`
- Props: `variant: 'raised' | 'default'`, `pressed: boolean`, `disabled: boolean`, `size: 'sm' | 'md'`
- Gray `#C0C0C0` surface, 2px bevels, pressed state inverts bevels
- Active: shifts content 1px down-right
- Font: `var(--w95-font-ui)` 11px

### 2.2 TitleBar95 Component

- **[NEW]** `src/components/win95/TitleBar95.tsx`
- Props: `title`, `icon`, `isActive`, `onMinimize`, `onMaximize`, `onClose`, `onDoubleClick`
- Blue gradient when active, gray when inactive
- `[_][□][X]` buttons — 16×14px, beveled, with pixel-art glyphs
- Drag handle = the entire title bar surface (events delegated to parent Window)

### 2.3 MenuBar95 Component

- **[NEW]** `src/components/win95/MenuBar95.tsx`
- Props: `items: MenuItem[]`, `onAction: (action) => void`
- Horizontal menu strip: File | Edit | View | Help
- Hover: raised bevel on label
- Click: dropdown opens with sunken bevel
- Dropdown items: text left, shortcut right, separators, disabled gray text
- Submenu arrows `▸` for cascade

### 2.4 Dialog95 Component

- **[NEW]** `src/components/win95/Dialog95.tsx`
- Props: `title`, `icon`, `children`, `buttons: DialogButton[]`, `modal: boolean`
- Standard Win95 dialog box with title bar, raised frame
- Button row at bottom-right: `[OK]  [Cancel]  [Apply]`
- Modal overlay: semi-transparent to prevent interaction behind

### 2.5 StatusBar95 Component

- **[NEW]** `src/components/win95/StatusBar95.tsx`
- Props: `sections: string[]`
- Sunken panels at window bottom, left-aligned text
- Multiple sections separated by vertical dividers

### 2.6 Toolbar95 Component

- **[NEW]** `src/components/win95/Toolbar95.tsx`
- Props: `items: ToolbarItem[]`
- Raised toolbar strip with icon buttons
- Separator dividers between groups
- Hover: raised bevel on button

### 2.7 Scrollbar95 CSS

- **[NEW]** Within `src/styles/window97.css`
- Custom scrollbar styling:
  ```css
  ::-webkit-scrollbar { width: 16px; }
  ::-webkit-scrollbar-track { background: var(--w95-surface); }
  ::-webkit-scrollbar-thumb { background: var(--w95-surface); border: 2px solid; 
    border-color: var(--w95-bevel-light) var(--w95-bevel-dark) var(--w95-bevel-dark) var(--w95-bevel-light); }
  ::-webkit-scrollbar-button { /* up/down arrow buttons */ }
  ```

### 2.8 Icon32 Component

- **[REWRITE]** `src/components/AppIcon.tsx` → `src/components/win95/Icon32.tsx`
- Props: `icon: string`, `label: string`, `size: 32 | 16`, `selected: boolean`
- Renders pixel art icons from `/assets/icons/`
- Label: white text with 1px black shadow on desktop, black text in Explorer
- Selected state: dotted focus rectangle, navy highlight on label

### 2.9 TaskbarButton95 Component

- **[NEW]** `src/components/win95/TaskbarButton95.tsx`
- Props: `icon`, `title`, `isActive`, `onClick`
- Raised bevel when inactive, sunken when active/focused
- Text truncated with ellipsis at ~120px
- 16px icon + text layout

### 2.10 Clock95 Component

- **[NEW]** `src/components/win95/Clock95.tsx`
- Displays real local time: `8:52 PM`
- Font: `var(--w95-font-ui)` 11px
- Updates every second via `setInterval`
- Sunken border container
- Click: shows date tooltip
- Double-click: opens tiny calendar popup

### 2.11 Win95 Window CSS

- **[REWRITE]** `src/styles/window.css` → `src/styles/window97.css`
- Complete Win95 window chrome styles
- `.window-frame`, `.title-bar`, `.title-bar-active`, `.title-bar-inactive`
- `.title-btn-minimize`, `.title-btn-maximize`, `.title-btn-close`
- `.window-menu-bar`, `.window-content`, `.window-status-bar`
- Zero `border-radius` everywhere
- Custom scrollbar styles

**Phase 2 Verification:** Build a test page rendering every component in isolation. Screenshot compare against real Win95 reference images.

---

## Phase 3 — Shell (Desktop + Taskbar + Start Menu) (Days 5–8)

> **Goal:** The persistent EXPLORER.EXE shell — always on screen.

### 3.1 Shell97 Root Component

- **[NEW]** `src/shell/Shell97.tsx`
- Renders: `<Desktop97>` + `<WindowManager97>` + `<Taskbar97>` + `<ContextMenu97>`
- Never unmounts after boot
- Consumes Zustand store for windows, focus, settings
- Handles global keyboard shortcuts: Ctrl+Esc (Start), Alt+F4, Alt+Tab, F5

### 3.2 Desktop97

- **[REWRITE]** `src/components/Desktop.tsx` → `src/shell/Desktop97.tsx`
- Wallpaper: `background-image` from settings (default: Bliss)
- CRT overlay applied to root
- Desktop icons: rendered from `DESKTOP_SHORTCUTS` in constants
- Left-column layout: 75px wide cells, 75px tall, gap 4px, flowing top-to-bottom
- Click on empty space: deselect all icons
- Click on icon: select (navy highlight)
- Double-click icon: dispatch `openTarget`
- Drag icon: reposition (grid-snapped, persist positions to Zustand)
- Rubber-band selection: click-drag on empty desktop draws dotted rect
- Right-click empty: desktop context menu
- Right-click icon: icon context menu

### 3.3 Taskbar97

- **[REWRITE]** `src/features/desktop/Taskbar.tsx` → `src/shell/Taskbar97.tsx`
- Fixed bottom, full width, 30px height, `#C0C0C0`, raised top bevel
- Layout: `[Start] | [QuickLaunch] | [TaskButtons] | [SystemTray]`
- **Start button**: 4-color flag icon + bold "Start". Click toggles Start Menu. Sunken when menu open.
- **Quick Launch**: 4 small icons (Explorer, Notepad, Media Player, IE), single-click opens. Separated by etched divider.
- **Task Buttons**: One `<TaskbarButton95>` per open window from `useOsStore.windows`. Active window = sunken. Click = focus or minimize-if-already-focused.
- **System Tray**: Sunken panel containing speaker icon (click toggles sound), monitor icon, `<Clock95>`.
- Right-click empty area: taskbar context menu (Cascade, Tile, Minimize All)

### 3.4 StartMenu97

- **[REWRITE]** `src/features/desktop/StartMenu.tsx` → `src/shell/StartMenu97.tsx`
- Anchored above Start button (bottom-left)
- Two-column layout: left sidebar with "Weru 97" text rotated 90° in navy/green, right side with menu items
- Items: Programs ▸, Documents ▸, Settings ▸, Find ▸, Help, Run…, ─, Shut Down…
- Cascading submenus: hover on `▸` item → submenu opens to the right
  - Flip to left if near right screen edge
- Programs submenu: from `START_MENU_STRUCTURE` constant
- Documents submenu: dynamically from `DOCUMENTS` manifest
- Click item: dispatch action, close menu
- Click outside: close menu
- Escape key: close menu
- Keyboard navigation: arrow keys move selection, Enter activates

### 3.5 ContextMenu97

- **[NEW]** `src/shell/ContextMenu97.tsx`
- Generic positioned context menu component
- Props: `items: ContextMenuItem[]`, `position: {x, y}`, `onAction`, `onClose`
- Screen-edge-aware positioning (flip if overflows)
- Submenu cascade on hover
- Separator support (`{ type: 'separator' }`)
- Disabled items: gray text, no hover, no click
- Navy highlight on hover

### 3.6 Work Area Update

- **[MODIFY]** `src/features/window-manager/use-work-area.ts`
- Change `TASKBAR_HEIGHT` from `58` to `30`
- `bottomInset: 30`, `topInset: 0`

### 3.7 App.tsx Rewrite

- **[REWRITE]** `src/App.tsx`
- New flow: `BootSequence97` (Phase 5) → `Shell97`
- Remove all macOS integrations (Spotlight, Dock, MenuBar, Sidebar, ViewControls)
- Remove parallax
- Connect to filesystem bootstrap
- Pass `openTarget` resolution to Shell97

**Phase 3 Verification:** Desktop renders with icons. Taskbar shows. Start menu opens/closes. Context menus appear at correct positions. Task buttons appear when windows are manually opened via store.

---

## Phase 4 — Window Manager (Days 8–10)

> **Goal:** Win95 window chrome with full drag, resize, minimize, maximize, z-order.

### 4.1 Window97 Chrome

- **[REWRITE]** `src/components/Window.tsx` → `src/wm/Window97.tsx`
- Render structure: `<div.window-frame>` → `<TitleBar95>` → `<MenuBar95>` (optional) → `<div.window-content>` → `<StatusBar95>` (optional)
- Blue gradient title bar when focused, gray when not
- Title bar buttons: `[_]` `[□]` `[X]` with bevel states
- Square corners. Zero border-radius.
- Double-click title bar = toggle maximize
- Title bar text: icon (16px) + title in white bold
- Outer window bevel: `window-frame` class from bevels.css

### 4.2 Drag System

- **[NEW]** `src/wm/useDrag97.ts`
- Adapted from current Window.tsx pointer-capture drag logic
- `onPointerDown` on title bar → `setPointerCapture` → track movement → update store
- Constrain to viewport (don't allow dragging off-screen)
- Remove all snap zone detection (no Aero Snap)
- `requestAnimationFrame` throttling for smooth 60fps drag

### 4.3 Resize System

- **[NEW]** `src/wm/useResize97.ts`
- 8-direction resize from window edges (4px invisible border)
- Cursor changes: `n-resize`, `e-resize`, `se-resize`, etc.
- Minimum size per app (from app registry `defaultWindow`)
- `setPointerCapture` for smooth resize
- Update store on completion

### 4.4 Window Manager Container

- **[NEW]** `src/wm/WindowManager97.tsx`
- Renders all open windows from `useOsStore.windows`
- Sets z-index from store
- Passes app content as children based on `appId`
- Lazy-loads app content components with `React.lazy` + `Suspense`
- App content routing:
  ```typescript
  const CONTENT_MAP: Record<string, React.LazyExoticComponent<...>> = {
    'explorer': lazy(() => import('../apps/explorer/Explorer97')),
    'notepad': lazy(() => import('../apps/notepad/Notepad97')),
    // ...
  };
  ```

### 4.5 useWindowManager Hook Update

- **[MODIFY]** `src/hooks/useWindowManager.ts`
- Remove snap-related imports and logic
- Remove `sections` and `views` state (macOS Finder concepts)
- Keep: window open/close/focus/minimize/restore/maximize wrappers
- Add: `cascadeWindows()`, `tileHorizontally()`, `tileVertically()`, `minimizeAll()`

### 4.6 Title Bar Context Menu

- When right-clicking the title bar: show context menu with Restore, Move, Size, Minimize, Maximize, ─, Close
- Reuses `<ContextMenu97>` from Phase 3

**Phase 4 Verification:** Open 3 windows. Drag them. Resize them. Minimize one → it disappears, taskbar button stays. Click taskbar button → restores. Maximize → fills desktop. Close → gone from taskbar. Z-order correct on focus clicks.

---

## Phase 5 — Boot Sequence (Days 10–11)

> **Goal:** BIOS POST → Starting → Logo → Desktop → Welcome Wizard

### 5.1 Boot Sequence Component

- **[REWRITE]** `src/components/BootScreen.tsx` → `src/boot/BootSequence97.tsx`
- State machine: `'bios' → 'starting' → 'logo' → 'done'`
- **BIOS scene** (2s): Black bg, gray monospace text. Typewriter effect at 80ms/line. Memory counter. "Verifying DMI Pool Data............."
- **Starting scene** (1.5s): Black bg, white "Starting Weru 97…" centered near bottom
- **Logo scene** (2.5s): Clouds background, Weru 97 flag logo centered, segmented progress bar filling. **Asset preloading here:** `Promise.all([preload icons, preload wallpaper, preload fonts])`
- **Transition:** `framer-motion AnimatePresence` exit animation → fade to desktop
- **Skip button**: "Skip >>" small text bottom-right. Click → jump to `'done'`
- On `'done'`: set `phase: 'desktop'` in Zustand, call `onDone()`

### 5.2 Boot CSS

- **[REWRITE]** `src/styles/boot.css`
- `.bios-screen`: black bg, VT323 font, gray text, line-height 1.4
- `.starting-screen`: black bg, Tahoma, white text
- `.logo-screen`: clouds bg, centered logo, progress bar
- `.progress-bar-95`: 10 segments, each a blue filled rectangle in a sunken track
- No Windows 11 lock screen, no spinning ring, no user card

### 5.3 Welcome Wizard (First Visit)

- **[NEW]** `src/apps/system/WelcomeWizard97.tsx`
- Opens as a `<Dialog95>` modal on first visit (checked via `weru97-visited` localStorage)
- 3 pages: Welcome → Instructions → Explore
- Back/Next/Finish buttons
- Checkbox: "Show this wizard next time"
- On finish: set `weru97-visited: true` in localStorage

**Phase 5 Verification:** Full page reload → see BIOS POST → "Starting" → logo with progress → desktop fades in. Clear localStorage → reload → Welcome Wizard appears.

---

## Phase 6 — Core Apps (Days 11–15)

> **Goal:** Explorer, Notepad, Recycle Bin, MS-DOS Prompt — the four essential apps.

### 6.1 Explorer97

- **[REWRITE]** `src/windows/ExplorerContent.tsx` → `src/apps/explorer/Explorer97.tsx`
- **Menu bar**: File | Edit | View | Help (using `<MenuBar95>`)
- **Toolbar**: Back, Forward, Up buttons (icon + text) | separator | Cut, Copy, Paste | separator | Views (Icons/List/Details)
- **Address bar**: Sunken field showing current path, editable (press Enter to navigate)
- **Left pane**: Folder tree. `+`/`-` boxes for expand/collapse. Click folder → right pane updates.
- **Right pane**: 
  - **Details view** (default): sortable columns (Name | Size | Type | Modified). Rows with 16px icons.
  - **Icons view**: 32px icons in grid
  - **List view**: 16px icons in multi-column list
- **Status bar**: "X object(s)" count
- **Context menu (right-click file)**: Open, Open With… ▸, Cut, Copy, ─, Delete, Rename, ─, Properties
- **Context menu (right-click empty)**: New ▸ (Folder, Text Document), ─, Paste, ─, Refresh, ─, Properties
- **Keyboard**: F2 (rename), Delete, Enter (open), Ctrl+C/X/V, F5 (refresh)
- **Double-click file**: resolves via `open-target.ts` → opens correct app
- **New > Text Document**: creates via `createTextFileNode()`, enters rename mode
- **All data from Dexie IndexedDB** using `useLiveQuery` — same reactive pattern as current ExplorerContent

### 6.2 Notepad97

- **[REWRITE]** `src/windows/NotepadContent.tsx` → `src/apps/notepad/Notepad97.tsx`
- **Menu bar**: File | Edit | Search | Help
- **No toolbar** (authentic)
- **Text area**: White bg, `Courier New 10px`, word-wrap on
- **Read-only mode**: Lock icon in status bar for system files (about_me.txt, skills.txt). User cannot edit.
- **Editable mode**: For visitor-created files. Ctrl+S saves to IndexedDB. Dirty indicator `*` in title.
- **File > Save As**: Dialog95 modal with filename input → `createTextFileNode()`
- **File > Open**: Simple file browser dialog
- **Edit > Select All, Copy**: functional. Other edit items disabled.
- **Search > Find**: Find dialog with text input, Find Next button
- **Status bar**: "Ready" / "Unsaved changes" / "Saved ✓"
- **Blinking caret** for immersion

### 6.3 RecycleBin97

- **[REWRITE]** `src/windows/RecycleBinContent.tsx` → `src/apps/recycle-bin/RecycleBin97.tsx`
- **Menu bar**: File | Edit | View | Help
- **Details view**: Name | Original Location | Date Deleted | Type | Size
- **File > Empty Recycle Bin**: Confirmation Dialog95 → `emptyTrash()`. Plays "crunch" sound.
- **Right-click item**: Restore, Delete (permanent)
- **File > Restore**: `restoreTrashEntry()`
- **Status bar**: "X object(s)" or "Recycle Bin is empty"
- **Desktop icon changes**: Full bin icon when items exist, empty bin when empty. Driven by `useLiveQuery(listTrash)`.

### 6.4 MS-DOS Prompt (Terminal Restyle)

- **[REWRITE]** `src/windows/TerminalContent.tsx` + `windows/TerminalContent.tsx` → `src/apps/msdos/MsDosPrompt97.tsx`
- **Single tab** (no tabbed interface — authentic DOS)
- **Black background, white text** (or green text option)
- **Font**: `VT323` or `Courier New` monospace
- **Prompt**: `C:\> ` (changes with `cd`)
- **Commands**: Reuse `terminal-commands.ts` with restyled output:
  - `dir` output: DOS-style column format (filename 8.3, size right-aligned, date)
  - `ver`: "Weru 97 [Version 4.00.950]"
  - `cls`: clears screen
  - All existing easter eggs work (`matrix`, `whoami`, `fortune`)
  - Add: `crash` → BSOD easter egg
- **No menu bar** (authentic — DOS prompt had a title bar menu: Edit > Mark, Edit > Paste)
- **Fixed-width window** (640×400)

**Phase 6 Verification:** Open Explorer → navigate to `C:\Projects\AfyaTrack` → double-click `README.txt` → Notepad opens with content. Create new text file → edit → save → close → reopen → content persists. Delete file → appears in Recycle Bin → restore → back in original location. MS-DOS `dir` lists files correctly.

---

## Phase 7 — Media Apps (Days 15–18)

> **Goal:** Real video playback, real audio playback, image viewer.

### 7.1 MediaPlayer97 (Real Video)

- **[NEW]** `src/apps/media-player/MediaPlayer97.tsx`
- **Hidden `<video>` element** = the actual player
- **Custom UI chrome** styled as Windows Media Player 6.4:
  - Video display area with CRT scanline overlay (CSS pseudo-element)
  - Transport bar: Play `▶`, Stop `■`, Pause `❚❚` — round beveled buttons
  - Seek slider: sunken track, gray handle, bound to `video.currentTime`
  - LCD time display: `00:24 / 00:45` in `VT323` font, recessed panel
  - Volume slider: small, with speaker icon
  - Playlist panel (bottom): lists video files from current project folder
- **Data flow**: Receives `src` URL from open-target resolution. Video source from `ProjectDefinition.files.demo.src` in manifest.
- **Menu bar**: File | View | Help
- **Status bar**: "Playing" / "Stopped" / "Paused"
- **Accepted formats**: MP4, WebM, OGG (HTML5 native)

### 7.2 CdPlayer97 (Real Audio)

- **[NEW]** `src/apps/cd-player/CdPlayer97.tsx`
- **Hidden `<audio>` element** = the actual player
- **Custom UI chrome** styled as Win95 CD Player:
  - Compact window (400×180, non-resizable)
  - LCD display: recessed dark panel, `VT323` digits showing track time
  - Artist/Track title in LCD
  - Transport: |◀ ▶ ■ ❚❚ ▶| ⏏ — beveled buttons
  - Track dropdown/list
- **Live equalizer visualization**:
  - `AudioContext` → `createMediaElementSource(audioEl)` → `AnalyserNode`
  - `getByteFrequencyData()` at 30fps via `requestAnimationFrame`
  - 7 vertical green bars (canvas or CSS) showing frequency bands
- **Playlist**: from `AUDIO_TRACKS` in manifest. Roy adds/removes tracks there.
- **Menu bar**: Disc | View | Help

### 7.3 Paint97 (Image Viewer)

- **[NEW]** `src/apps/paint/Paint97.tsx`
- **Read-only image viewer** (tools are visual props only)
- Left: Vertical toolbox (pencil selected, grayed out tools)
- Bottom: 28-color palette grid (visual only)
- Center: `<img>` element with scrollbars for images larger than viewport
- Opens `.bmp`, `.jpg`, `.png` files — source URL from manifest
- **Menu bar**: File | Edit | View | Image | Colors | Help
- Zoom controls in View menu

### 7.4 Media Types Update

- **[MODIFY]** `src/features/media/media-types.ts`
- Add `.avi`, `.mp4`, `.webm` → `video/*` mapping
- Add `.wav`, `.mp3`, `.mid` → `audio/*` mapping
- Add `.bmp` → `image/bmp` mapping
- Update allowed source prefixes to include `/media/`

**Phase 7 Verification:** Navigate to `C:\Projects\AfyaTrack\demo.avi` → double-click → Media Player opens, video plays with custom controls. Open CD Player from Start menu → select track → audio plays, equalizer animates. Open `.bmp` file → Paint viewer shows image.

---

## Phase 8 — Utility Apps (Days 18–22)

> **Goal:** Calculator, IE4, System Properties, Control Panel, Run, Find, Shut Down.

### 8.1 Calculator97

- **[NEW]** `src/apps/calc/Calculator97.tsx`
- Standard calculator layout: LCD display + button grid
- **Fully functional math**: +, -, ×, ÷, %, √, 1/x, ±, CE, C, Backspace
- Memory: MC, MR, MS, M+
- Display: right-aligned, max 12 digits, `VT323` font in recessed panel
- Fixed window size (240×320), **non-resizable**
- Menu bar: Edit (Copy, Paste) | View (Standard, Scientific) | Help
- **Implementation**: Pure state machine. `display`, `buffer`, `operator`, `memory`.

### 8.2 RetroBrowser97 (IE4)

- **[NEW]** `src/apps/ie4/RetroBrowser97.tsx`
- **Full IE4 chrome**:
  - Toolbar: Back, Forward, Stop, Refresh, Home | Address bar (editable)
  - Address bar shows URL from `.url` file
- **Content modes**:
  - **Links page** (default/home): 1997-style personal homepage
    - "Roy Weru Matheri — Links" heading in Times New Roman
    - `<hr>` horizontal rule
    - Link list: Email (`mailto:`), GitHub, LinkedIn, Twitter/X — underlined blue `#0000FF`
    - Visitor counter: "You are visitor #0001337" (real from API)
    - "Best viewed at 800×600 with Weru 97" badge
    - Under construction GIF 🚧
  - **External URL mode**: Opens case-study URLs. Shows "Navigating to [url]..." progress bar, then `<iframe>` or "Open in new tab" link
- **Status bar**: "Done" / "Opening page..."
- Menu bar: File | Edit | View | Go | Favorites | Help

### 8.3 SystemProperties97

- **[NEW]** `src/apps/system/SystemProperties97.tsx`
- Tabbed `<Dialog95>` (not a regular window — fixed size, non-resizable)
- **General tab**:
  - 48px retro computer icon (CRT + tower)
  - "System: Weru 97 / Version 4.00.950B"
  - "Registered to: Roy Weru Matheri"
  - "Computer: Pentium II Processor, 233 MHz, 64.0 MB RAM"
  - Data from `PROFILE` in manifest
- **Hardware tab** (creative!):
  - Skills as "device drivers" with status:
    ```
    ✅ React.js Display Driver     v19.2    Working properly
    ✅ Python Compute Engine       v3.12    Working properly
    ✅ PostgreSQL Storage Driver    v16      Working properly
    ✅ Docker Container Service    v24      Working properly
    ```
  - Data from `SKILLS` in manifest
- **Performance tab**:
  - Two animated progress bars: "Graphics: 87%" / "Computing: 92%"
  - Framer Motion animated fill from 0 to target

### 8.4 ControlPanel97

- **[NEW]** `src/apps/system/ControlPanel97.tsx`
- Icon grid window (like real Control Panel):
  - 🖥️ Display — opens Display Properties dialog (wallpaper picker, screensaver toggle)
  - 🔊 Sounds — opens Sounds dialog (toggle system sounds)
  - ⚙️ System — opens SystemProperties97
  - 📁 Add/Remove Programs — easter egg: "All programs are essential to Weru 97 and cannot be removed."
- Each icon = 32px + label, double-click opens the dialog
- Menu bar: File | View | Help

### 8.5 RunDialog97

- **[NEW]** `src/apps/system/RunDialog97.tsx`
- `<Dialog95>` modal
- Text input: "Open: [_______________]"
- Buttons: OK, Cancel, Browse...
- Command mapping:
  ```typescript
  const RUN_COMMANDS: Record<string, () => void> = {
    'notepad': () => openApp('notepad'),
    'calc': () => openApp('calculator'),
    'explorer': () => openApp('explorer'),
    'winmine': () => openApp('minesweeper'),
    'iexplore': () => openApp('ie4'),
    'msdos': () => openApp('msdos'),
    'cdplayer': () => openApp('cd-player'),
    'mspaint': () => openApp('paint'),
    'regedit': () => showError('Access denied. Nice try. 😏'),
    'format c:': () => showError('Cannot format drive containing Weru 97.'),
  };
  ```
- Supports `explorer C:\Projects\AfyaTrack` (with path argument)

### 8.6 FindFiles97

- **[NEW]** `src/apps/system/FindFiles97.tsx`
- `<Dialog95>` with tabs: Name & Location | Date Modified | Advanced
- **Name & Location tab**:
  - "Named:" text input
  - "Look in:" path dropdown (C:\, C:\Projects, C:\My Documents)
  - "Include subfolders" checkbox
  - [Find Now] [Stop] [New Search] buttons
- **Results pane**: Details view (Name | In Folder | Size | Type | Modified)
- **Uses `searchNodes()` from filesystem-service.ts** — already implemented!
- Double-click result → opens file with associated app

### 8.7 ShutDown97

- **[NEW]** `src/apps/system/ShutDown97.tsx`
- `<Dialog95>` modal, centered
- "What do you want the computer to do?"
- Radio buttons: Shut down / Restart / Close all programs and log on as a different user
- [OK] [Cancel] [Help]
- **Shut down**: Screen fades to black → "It's now safe to turn off your computer." (orange `#FF8000` text on black bg, centered) → small "Click anywhere to restart" text → click → full page reload
- **Restart**: `window.location.reload()` → full boot sequence
- **Cancel**: Close dialog, return to desktop

**Phase 8 Verification:** Start > Run > type `calc` → Calculator opens, math works. Start > Find > search "React" → results from skills.txt and project READMEs. System Properties > Hardware tab shows skills as drivers. Shut Down > shows safe-to-turn-off screen.

---

## Phase 9 — Delight Layer (Days 22–25)

> **Goal:** Games, screensaver, sound scheme, easter eggs — the stuff that makes people share your portfolio.

### 9.1 Minesweeper97 (Visual + Few Moves)

- **[NEW]** `src/apps/games/Minesweeper97.tsx`
- 9×9 beginner grid, pre-generated board state
- **Visual elements**: Sunken grid cells, number colors (1=blue, 2=green, 3=red, 4=dark blue), flag emoji, mine emoji
- **Smiley button**: 😊 (reset), 😮 (on click), 😎 (win), 😵 (lose)
- **LED displays**: Mine count (left), timer (right) — `VT323` red digits
- **Limited interaction**: 
  - Click unrevealed cell → reveals (from pre-determined safe set, ~20 cells)
  - Right-click → toggle flag
  - Click mine → game over (reveal all mines, 😵 face)
  - Smiley click → reset to initial state
- **NOT a full game engine** — fixed mine positions, fixed safe reveal set
- Fixed window size, non-resizable. Menu bar: Game | Help.

### 9.2 Starfield Screensaver

- **[NEW]** `src/boot/Screensaver97.tsx`
- **Trigger**: 2 minutes of no mouse movement or keyboard input
- **Canvas-based**: `<canvas>` filling entire viewport
- **Stars**: ~200 white dots, z-depth sorted. Each frame: move toward viewer (increase x/y from center, increase size). When star exits viewport, reset to center with new random z.
- **Speed**: Gradually increases over 30 seconds
- **Exit**: Any mouse movement or keypress → instant return to desktop
- **Implementation**: `requestAnimationFrame` loop, efficient Float32Array for star positions
- **Configurable**: Control Panel > Display > Screen Saver tab → enable/disable, timeout (1/2/5/10 min)

### 9.3 Sound Scheme (WebAudio Synthesis)

- **[NEW]** `src/os/sound/synth.ts`
- `SoundEngine` class:
  ```typescript
  class SoundEngine {
    private ctx: AudioContext | null = null;
    private enabled: boolean = true;
    
    play(sound: 'startup' | 'chord' | 'click' | 'ding' | 'pop' | 'crunch' | 'shutdown'): void;
    setEnabled(enabled: boolean): void;
    private getContext(): AudioContext; // lazy init
  }
  ```
- **Sound recipes** (all synthesized, zero network):
  - `startup`: 6-second evolving chord (C-E-G-B) with slow attack, long release
  - `chord`: 200ms major triad stab
  - `click`: 30ms white noise burst
  - `ding`: 300ms sine wave at 880Hz with fast decay
  - `pop`: 80ms sine chirp (800Hz→400Hz)
  - `crunch`: 400ms filtered noise
  - `shutdown`: 1.5s descending chord
- **Integration points**: 
  - `onBootComplete → play('startup')`
  - `onWindowOpen → play('chord')`
  - `onWindowClose → play('click')`
  - `onError → play('ding')`
  - `onStartMenuOpen → play('pop')`
  - `onEmptyRecycleBin → play('crunch')`
  - `onShutDown → play('shutdown')`
- Hook into Zustand store actions via middleware or direct calls

### 9.4 BSOD Easter Egg

- **[NEW]** `src/apps/system/BlueScreen97.tsx`
- Full viewport blue (`#000080`) screen with white Courier text
- Authentic text:
  ```
  Windows

  An exception 0E has occurred at 0028:C004B0A3 in VxD WERU97(01)
  + 000010A3. This was called from 0028:C004AED5 in VxD
  PORTFOLIO(03) + 0000AED5.

  * Press any key to attempt to continue.
  * Press CTRL+ALT+DEL to restart your computer. You will
    lose any unsaved information in all applications.

          Press any key to continue _
  ```
- **Triggers**: `crash` command in DOS, Ctrl+Alt+Del, opening >10 windows
- **Recovery**: Press any key → BSOD disappears with flicker → Dialog95: "Weru 97 recovered from a serious error. Just kidding. 😄"
- Blocks all interaction while visible

### 9.5 All Easter Eggs Implementation

- `matrix` command → green Matrix rain in canvas overlay (reuse existing from terminal-commands)
- `secrets.txt` file content at `C:\Windows\System\`
- Clock click ×7 → Y2K panic (numbers flicker randomly for 3 seconds)
- Midnight wallpaper swap (check `new Date().getHours() === 0`)
- `IDDQD` detection in any `<input>` or `<textarea>` → Minesweeper reveal
- Clippy on 5× Recycle Bin right-click: small floating speech bubble with Clippy image
- Calculator `58008` flip
- Run > `regedit` and `format c:` error messages
- Run > `about:weru` in IE → credits page

**Phase 9 Verification:** Open Minesweeper → click cells, they reveal. Right-click flags. 2 min idle → Starfield activates, mouse cancels. Type `crash` in DOS → BSOD → press Enter → recovers. All sounds play on correct events.

---

## Phase 10 — Polish & Production (Days 25–28)

> **Goal:** Visitor tracking, responsive, accessibility, performance, final cleanup.

### 10.1 Visitor Counter API

- **[NEW]** `src/app/api/visitors/route.ts` (Next.js API route)
- Edge runtime for speed
- `GET`: Return current count
- `POST`: Increment counter, return new count + assign visitor number
- Storage: `@vercel/kv` (Redis)
- Client hook: `src/os/visitors/useVisitorCount.ts`
- Display: IE4 footer, System Properties "About", `systeminfo` command

### 10.2 Responsive Strategy

- **Desktop (≥1024px)**: Full experience
- **Tablet (768–1023px)**: Scaled, simplified. No resize handles. Windows auto-fit. Taskbar icons only.
- **Mobile (<768px)**: "Weru 97 requires a minimum resolution of 800×600" message with simplified Start menu navigation as full-screen list

### 10.3 Accessibility

- All interactive elements have `role`, `aria-label`, `tabindex`
- Window focus trap when modal dialog is open
- Keyboard navigation everywhere: Tab cycles elements, Enter activates, Escape closes
- Respect `prefers-reduced-motion`: disable boot animations, screensaver, CRT effects

### 10.4 Performance Pass

- Verify max 8 open windows enforcement
- All app content lazy-loaded (`React.lazy`)
- Virtual scrolling in Explorer for large folders
- Debounce drag/resize at 16ms
- Asset preloading during boot progress bar
- Bundle analysis: target <300KB initial JS
- Lighthouse audit: target 90+ performance score

### 10.5 Testing

- Unit tests (Vitest):
  - Virtual filesystem path resolution
  - File extension → app mapping
  - Calculator math operations
  - Store open/close/focus/z-order cycle
  - Terminal command parsing
  - Sound engine enable/disable
- Integration tests:
  - Boot sequence timing
  - Window lifecycle
  - File CRUD flow (create → edit → save → delete → restore)

### 10.6 Error Boundary Restyle

- **[MODIFY]** `src/components/common/ErrorBoundary.tsx`
- Restyle fallback as Win95 dialog: "This program has performed an illegal operation. [Details] [Close]"

### 10.7 Final Cleanup

- Remove all unused imports across entire codebase
- Remove legacy planning docs: `ideation_upgrade.md`, `os_implementation_plan.md`, `os_tasks_list.md`, `os_upgrade_tasks_list.md`, `os_final_consistency_tasks.md`, `os_profile_filesystem_media_tasks.md`, `template.txt`, `context.txt`
- Update `README.md` with Weru 97 documentation
- Verify `npm run build` passes with zero warnings
- Verify `npm run test` passes all suites

**Phase 10 Verification:** Deploy to Vercel preview. Visit on mobile → see resolution message. Visit on desktop → full experience. Visitor counter increments. Lighthouse > 90. All tests pass.

---

## Execution Ledger — 2026-09-20 (non-Stitch work)

- `[x]` Resumed execution at Phase 6 without fetching or depending on Stitch connector artifacts.
- `[x]` Added Win97 window IDs/configuration for IE4, Paint, CD Player, Calculator, Minesweeper, MS-DOS Prompt, System Properties, and Control Panel.
- `[x]` Added app entry points for Explorer97, Notepad97, RecycleBin97, MS-DOS Prompt, media player, CD player, Paint, Calculator, Minesweeper, IE4, System Properties, and Control Panel.
- `[x]` Routed the MS-DOS application target to its own Win97 window instead of silently opening the modern Terminal ID.
- `[x]` Added classic media MIME support for AVI, WAV, MIDI, BMP, and GIF while retaining browser-safe bundled source validation.
- `[x]` Added safe calculator evaluation using a constrained arithmetic parser; no `eval`, `Function`, process execution, or host filesystem access is used.
- `[x]` Added `ver` and `cls` aliases to the sandboxed terminal command registry.
- `[x]` Added functional Run, Find Files, and Shut Down utility surfaces with command aliases, virtual filesystem search, and safe shutdown/restart behavior.
- `[x]` Added the new utility targets to the central `WindowId`, window configuration, application registry, icon registry, Start Menu, and App orchestrator.
- `[x]` Added Vitest coverage for Win97 app registration and classic media associations.
- `[x]` Verified `npx tsc --noEmit`, `npm run lint`, `npm test` (5 files / 10 tests), and `npm run build` after the utility slice.
- `[~]` Remaining non-Stitch work: Run/Find/Shutdown dialogs, screensaver, synthesized sound events, BSOD recovery, full Explorer Win97 chrome, and browser automation.
- `[ ]` Stitch-driven visual refinement remains intentionally deferred until the user supplies the reference code/artifacts.

---

## Timeline Summary

| Phase | Days | What |
|-------|------|------|
| **P0** Foundation | 1–2 | Manifest, tokens, cleanup, dead code |
| **P1** Kernel | 2–3 | Store, types, filesystem, app registry |
| **P2** UI Kit | 3–5 | Button95, TitleBar95, Dialog95, bevels |
| **P3** Shell | 5–8 | Desktop, Taskbar, Start Menu, Context Menu |
| **P4** Window Manager | 8–10 | Window chrome, drag, resize, z-order |
| **P5** Boot | 10–11 | BIOS POST, logo, Welcome Wizard |
| **P6** Core Apps | 11–15 | Explorer, Notepad, Recycle Bin, DOS |
| **P7** Media Apps | 15–18 | Media Player, CD Player, Paint |
| **P8** Utility Apps | 18–22 | Calculator, IE4, System Props, Control Panel, Run, Find, Shut Down |
| **P9** Delight | 22–25 | Minesweeper, Screensaver, Sounds, BSOD, Easter Eggs |
| **P10** Polish | 25–28 | Visitor API, responsive, a11y, perf, tests |

---

> [!IMPORTANT]
> **Total: ~28 working days.** This is aggressive but achievable because:
> 1. The Zustand store and IndexedDB VFS are solid foundations we're adapting, not rebuilding
> 2. Win95 CSS is the simplest UI system possible (flat colors, hard bevels, zero border-radius)
> 3. Each phase produces a working, testable increment
> 4. Content is fully decoupled in the manifest — Roy can update projects/bio at any time without touching components
