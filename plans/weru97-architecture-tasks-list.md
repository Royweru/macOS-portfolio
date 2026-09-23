# Weru 97 — Core Architecture & Filesystem Tasks List

> **Master Execution Tracker:** This checklist tracks all atomic tasks for filesystem decoupling, desktop shortcuts, flexible project typings, media preservation, and retro application associations.
> Status Legend: `[x]` Completed & Verified · `[ ]` Pending / On Hold

---

## Phase 1: Virtual Filesystem Topology & Desktop Shortcut Infrastructure

- [x] **1.1 Decouple Desktop from My Documents:**
  - `src/features/filesystem/virtual-paths.ts` updated with `VIRTUAL_PATHS.desktop = 'C:\\Desktop'`.
  - In `VIRTUAL_NODE_IDS`, added `desktop: 'folder-desktop'`.
  - Initial desktop separation used layout version 7; follow-up path correction now uses version 8 with an in-place reparenting migration.
  - Verified virtual-path and seeded-topology regression tests.

- [x] **1.2 Seed `C:\Desktop` and Shell Shortcuts in VFS:**
  - In `src/features/filesystem/filesystem-service.ts` (`createWin97Nodes`), seeded `C:\Desktop` (`folder-desktop`).
  - Created standard desktop shortcut nodes inside `folder-desktop`:
    - `Projects.lnk` ➔ points to `folder-projects` (`C:\Projects`).
    - `My Documents.lnk` ➔ points to `folder-my-documents` (`C:\My Documents`).
    - `Videos.lnk` ➔ points to `folder-videos` (`C:\Videos`).
    - `My Pictures.lnk` ➔ points to `folder-pictures` (`C:\My Pictures`).
    - `My Music.lnk` ➔ points to `folder-windows-media` (`C:\Windows\Media`).

- [x] **1.4 Keep personal libraries separate from portfolio documents:**
  - `C:\My Documents` contains the portfolio text documents only.
  - `C:\Videos` and `C:\My Pictures\Screenshots` are separate library locations.
  - Layout version 8 reparents existing folders by stable node ID; descendants and user data are retained.
  - The saved Videos and My Pictures desktop shortcuts are migrated to the canonical library paths.

- [x] **1.3 Verify Shortcut Dereferencing & Routing:**
  - Verified `resolveShortcut()` in `filesystem-service.ts` correctly resolves `folder-desktop` shortcuts to their target nodes.
  - Verified `open-target.ts` and `Desktop97.tsx` seamlessly dereference `.lnk` nodes to their destination folders without path confusion.

---

## Phase 2: Flexible Project Types, Media Preservation & Dynamic Seeder Fix

- [x] **2.1 Revisit Project Typings in `src/data/portfolio-manifest.ts`:**
  - Defined `ProjectMediaDemo`, `ProjectMediaAudio`, `ProjectTechStack`, `ProjectFiles`, and `ProjectInput`.
  - Made `readme`, `skillsUsed`, `techStack`, `github`, `live`, and `files` completely **optional**.
  - Rewrote `project(...)` constructor: eliminated `Omit<...>` that stripped media; all `demo`, `screenshots`, `audio`, and links are preserved directly.
  - Removed duplicate project entry.

- [x] **2.2 Implement Dynamic Project File Seeding in `createWin97Nodes()`:**
  - In `filesystem-service.ts`, project files are now dynamically seeded only when data is provided:
    - Only seeds `README.txt` if `project.readme` exists.
    - Only seeds `skills-used.txt` if `project.skillsUsed` exists.
    - Only seeds `tech-stack.spec` if `project.techStack` exists.
    - Seeds `demo.avi` with full `media` payload when `project.files?.demo` is present.
    - Seeds `screenshots.bmp` when `project.files?.screenshots` is present.
    - Seeds `soundtrack.wav` when `project.files?.audio` is present.
    - Seeds `source-code.url` and `live-site.url` with `ie4` binding.

- [x] **2.3 Synchronize Media Manifest with VFS Nodes:**
  - Ensured `syncMediaNodes()` synchronizes with manifest without overwriting user data.

---

## Phase 3: External URL Whitelist & Safe Target Dereferencing

- [x] **3.1 Expand External URL Routing:**
  - Updated `isAllowedExternalUrl` in `src/features/os/open-target.ts` to allow all valid `https:` and `http:` URLs (supporting custom domains, YouTube embeds, and external APIs).
  - Updated and verified unit tests in `src/features/os/open-target.test.ts`.

- [x] **3.2 Wire `.url` Files to Internet Explorer 4:**
  - Verified `targetForNode()` converts `.url` files to external targets and launches `ie4` with the target URL.

---

## Phase 4: Retro Media Player 6.4 Chrome & HTML5 Playback

- [x] **4.1 Purge Modern Icons & Layout from `MediaPlayerContent.tsx`:**
  - Removed all `lucide-react` imports (`FileVideo`, `FileAudio`, `FolderOpen`, `Info`).

- [x] **4.2 Implement Authentic Win95 Media Player Chrome:**
  - Rebuilt with authentic 4:3 video stage and CRT scanline overlay.
  - Implemented classic beveled transport buttons: Play (`▶`), Pause (`❚❚`), Stop (`■`), Rewind (`|◀`), Fast Forward (`▶|`).
  - Implemented sunken seek scrubber track with percentage indicator.
  - Implemented green LED time readout (`00:00 / 00:00`).
  - Added volume slider and status bar with sunken panels.
  - Fully wired to HTML5 `<video>` and `<audio>` for real media playback.

---

## Phase 5: Win95 Notepad Hygiene & Lucide/Tailwind Bleed Clean-up

- [x] **5.1 Purge Modern Elements from `NotepadContent.tsx`:**
  - Removed all `lucide-react` imports (`FileText`, `LockKeyhole`, `Save`).
  - Removed modern Tailwind color overrides (`#0067c0`, `text-slate-500`, `bg-slate-50`).
  - Styled with Courier New monospace font, classic menu bar, and beveled status bar.
  - Replaced modern modals with authentic Win95 beveled "Save As" and "Find" dialogs.

- [x] **5.2 Wire Notepad Persistence & Dirty State:**
  - Verified reading and saving text to Dexie IndexedDB with dirty state indicators (`*`).

---

## Phase 6: Desktop & Explorer Integration Verification

- [x] **6.1 Verify Explorer Tree & Path Navigation:**
  - Verified `C:\Desktop` exists as a separate node from `C:\My Documents`.
  - Verified shortcuts navigate cleanly to target folders in VFS logic.

- [x] **6.2 Verify Desktop Icons on Desktop Surface:**
  - Desktop shortcuts dereference targets through `openTarget`.

---

## Phase 7: Automated Tests, Smoke Tests & Verification Gates

- [x] **7.1 Run Automated Test Suite:**
  - Ran `npm test -- --run`: **16 test files passed, 69 tests passed**; TypeScript, lint, and production build also pass for the path/window correction.
- [~] **7.2 In-Browser Manual End-to-End Verification:**
  - User authorized browser QA. One localhost:3000 tab verified File Explorer at `C:\`, My Documents with only its four text documents, My Pictures with a Screenshots child, the existing reference image at `C:\My Pictures\Screenshots`, and Videos at `C:\Videos`.
  - Broader application and per-window control E2E verification remains active; no other browser tabs were opened.
