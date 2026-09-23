# Weru 97 — Core Architecture & Filesystem Implementation Plan

## Problem Statement & Architectural Context
Weru 97 is a portfolio operating system emulating Windows 95 OSR 2.5 ("Windows 97"). An audit of the data model and filesystem seeding revealed severe structural issues:

1. **Rigid & Misguided Mandatory Project Typings:**
   - In `src/data/portfolio-manifest.ts`, `techStack`, `skillsUsed`, and `readme` were treated as mandatory properties.
   - In real-world projects, some entries only have a live URL and a video demo, while others have technical spec sheets or GitHub source code. Forcing all files to be mandatory produced artificial filler files.
2. **Media Stripping via `Omit<...>` Helper:**
   - The constructor helper `project(...)` in `portfolio-manifest.ts` explicitly omitted `'files'` (`Omit<ProjectDefinition, ...>`).
   - Any `demo` video, `screenshots`, or `audio` declared in the manifest was silently discarded at runtime.
3. **Seeder Hardcoding Absent Files:**
   - `filesystem-service.ts` assumed all projects possessed `README.txt`, `skills-used.txt`, and `tech-stack.spec`, while never seeding `demo.avi` or `screenshots.bmp`.
4. **Desktop / Documents Collision:**
   - `virtual-paths.ts` aliased `desktop: 'C:\\My Documents'` and `VIRTUAL_NODE_IDS.desktop: 'folder-my-documents'`, destroying the concept of a separate desktop directory.
5. **Missing Shortcut Architecture:**
   - Desktop shortcuts (`Projects.lnk`, `My Documents.lnk`, etc.) were not represented as genuine `.lnk` pointer files in `C:\Desktop`.
6. **Restrictive URL Whitelist:**
   - `isAllowedExternalUrl` in `open-target.ts` blocked custom domains and external video CDNs.
7. **Explorer and Library Path Confusion:**
   - A shared React `explorerFolderId` allowed opening one folder to change every Explorer window without its own `locationId`.
   - The active seed put `Videos` and `Screenshots` under `C:\My Documents`, despite separate Videos and My Pictures desktop shortcuts.

---

## Architectural Specification

### 1. Flexible Project & Media Data Model (`portfolio-manifest.ts`)
Every project is a real folder in `C:\Projects\`. Its contents are entirely dynamic and optional:

```typescript
export interface ProjectMediaDemo {
  src: string;                     // Local path (/media/videos/demo.mp4) or external URL
  mimeType?: string;               // Default: 'video/mp4'
  poster?: string;
  title?: string;
  durationSeconds?: number;
}

export interface ProjectMediaAudio {
  src: string;
  title: string;
  artist?: string;
  duration?: number;
}

export interface ProjectTechStack {
  language?: string;
  framework?: string;
  database?: string;
  hosting?: string;
  other?: string[];
}

export interface ProjectFiles {
  demo?: ProjectMediaDemo;         // OPTIONAL -> seeds demo.avi / demo.mp4
  screenshots?: string[];          // OPTIONAL -> seeds screenshots.bmp
  audio?: ProjectMediaAudio;       // OPTIONAL -> seeds theme.wav / track.mp3
  liveSite?: string;               // OPTIONAL -> seeds live-site.url
  sourceCode?: string;             // OPTIONAL -> seeds source-code.url
}

export interface ProjectDefinition {
  id: string;                      // Unique slug (e.g. 'afyatrack')
  legacyId?: number;
  folderName?: string;             // Folder name in C:\Projects (defaults to title)
  title: string;
  description?: string;            // Summary blurb
  tag?: 'AI' | 'Dev' | 'Design' | string;
  color?: string;
  accent?: string;
  icon?: string;
  readme?: string;                 // OPTIONAL -> seeds README.txt
  skillsUsed?: string[];           // OPTIONAL -> seeds skills-used.txt
  techStack?: ProjectTechStack;    // OPTIONAL -> seeds tech-stack.spec
  github?: string | null;          // OPTIONAL -> convenience fallback for sourceCode
  live?: string | null;            // OPTIONAL -> convenience fallback for liveSite
  files?: ProjectFiles;            // Full media and links payload (NEVER OMITTED)
}
```

### 2. Dynamic Virtual Filesystem Seeding (`filesystem-service.ts`)
When Weru 97 builds the folder for each project (`C:\Projects\[folderName]\`), it inspects the definition and **only creates files that actually exist**:
* If `project.readme` is provided ➔ creates `README.txt` (opens in Notepad).
* If `project.skillsUsed` is provided ➔ creates `skills-used.txt` (opens in Notepad).
* If `project.techStack` is provided ➔ creates `tech-stack.spec` (opens in System Properties / Notepad).
* If `project.files?.demo` is provided ➔ creates `demo.avi` (with `media` metadata ➔ opens in Media Player 6.4).
* If `project.files?.screenshots` is provided ➔ creates `screenshots.bmp` (opens in Paint).
* If `project.files?.audio` is provided ➔ creates `soundtrack.wav` (opens in CD Player).
* If `project.files?.sourceCode` or `project.github` is provided ➔ creates `source-code.url` (opens in IE4).
* If `project.files?.liveSite` or `project.live` is provided ➔ creates `live-site.url` (opens in IE4).

### 3. Desktop Shortcut Architecture
```
C:\
├── Desktop\                     [REAL VFS FOLDER - 'folder-desktop']
│   ├── Projects.lnk             [SHORTCUT -> points to C:\Projects]
│   ├── My Documents.lnk         [SHORTCUT -> points to C:\My Documents]
│   ├── Videos.lnk               [SHORTCUT -> points to C:\Videos]
│   ├── My Pictures.lnk          [SHORTCUT -> points to C:\My Pictures]
│   └── My Music.lnk             [SHORTCUT -> points to C:\Windows\Media]
├── My Documents\                [PORTFOLIO TEXT FILES ONLY]
├── My Pictures\                 [REAL VFS FOLDER - 'folder-pictures']
│   └── Screenshots\             [preserves existing screenshot contents]
├── Videos\                      [REAL VFS FOLDER - 'folder-videos']
├── Projects\                    [REAL VFS FOLDER - 'folder-projects']
├── Program Files\               [REAL VFS FOLDER]
└── Windows\                     [REAL VFS FOLDER]
```
Shortcuts (`.lnk`) contain `shortcutTargetId` and `shortcutTargetPath`. Double-clicking them in Explorer or on the Desktop dereferences the pointer via `resolveShortcut()` and opens the target folder.

---

## Proposed Changes

### Data & Schema Layer
#### [MODIFY] [portfolio-manifest.ts](file:///c:/Users/Admin/OneDrive/Desktop/weru_os/src/data/portfolio-manifest.ts)
* Update `ProjectDefinition` to make `techStack`, `skillsUsed`, `readme`, `github`, `live`, and `files` optional.
* Rewrite `project(...)` helper constructor to preserve all `files` (demo, screenshots, audio, links) without using `Omit`.

### Filesystem Layer
#### [MODIFY] [virtual-paths.ts](file:///c:/Users/Admin/OneDrive/Desktop/weru_os/src/features/filesystem/virtual-paths.ts)
* Decouple `desktop` from `myDocuments` (`desktop: 'C:\\Desktop'`, `VIRTUAL_NODE_IDS.desktop: 'folder-desktop'`).
* Bump `VIRTUAL_LAYOUT_VERSION` to `8` after the library-location correction. The migration reparents existing `Videos` and `Screenshots` folder nodes and preserves their children; it does not clear IndexedDB.

#### [MODIFY] [filesystem-service.ts](file:///c:/Users/Admin/OneDrive/Desktop/weru_os/src/features/filesystem/filesystem-service.ts)
* In `createWin97Nodes()`, seed `C:\Desktop` with genuine `.lnk` shortcuts.
* Keep `Videos` at `C:\Videos` and `My Pictures\Screenshots` outside `C:\My Documents` so their virtual paths agree with the desktop shell shortcuts.
* In `createWin97Nodes()`, dynamically seed project files only when their corresponding optional fields are provided.
* Attach `media` payload to `demo.avi` so Media Player 6.4 receives playback metadata.

### Operating System & Routing Layer
#### [MODIFY] [open-target.ts](file:///c:/Users/Admin/OneDrive/Desktop/weru_os/src/features/os/open-target.ts)
* Expand `isAllowedExternalUrl` to allow all valid `http:` and `https:` URLs (custom domains, video CDNs).
* Unify `.lnk` dereferencing so desktop shortcuts open target folders cleanly.

### Application Presentation Layer
#### [MODIFY] [MediaPlayerContent.tsx](file:///c:/Users/Admin/OneDrive/Desktop/weru_os/src/windows/MediaPlayerContent.tsx)
* Replace generic HTML5 player with retro Windows Media Player 6.4 chrome (play/pause/stop buttons, seek bar, LCD timer).
* Remove all `lucide-react` imports.

#### [MODIFY] [NotepadContent.tsx](file:///c:/Users/Admin/OneDrive/Desktop/weru_os/src/windows/NotepadContent.tsx)
* Purge `lucide-react` icons and modern Tailwind colors.
* Enforce Courier New 10px and Win95 beveled menu bars.

---

## Verification Plan

### Automated Tests
* `npm run test` / `vitest`:
  * Verify `virtual-paths.test.ts` validates `C:\Desktop`.
  * Verify `open-target.test.ts` resolves `.lnk` shortcuts and `.url` files.
  * Verify projects without optional fields (e.g. without README or without tech stack) compile and seed cleanly.

### Manual Verification
1. Seed a project with **only** a demo video and live link ➔ Verify folder contains only `demo.avi` and `live-site.url`.
2. Seed a project with full specs (README, skills, tech-stack, GitHub) ➔ Verify folder contains all corresponding files.
3. Double-click `demo.avi` ➔ Verify playback in Media Player 6.4.
4. Double-click `README.txt` ➔ Verify opening in Notepad.
5. Double-click `live-site.url` ➔ Verify opening in IE4.
6. Open `C:\Desktop` in Explorer ➔ Verify shortcuts navigate to target folders.
