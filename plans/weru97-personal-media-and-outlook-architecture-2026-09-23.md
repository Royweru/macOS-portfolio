# Weru 97 — Root Media Libraries and Outlook Express

Date: 2026-09-23  
Scope: Incorporate the user's root-folder, personal-media-manifest, and mail-client architecture into Chapter 2 without mixing personal media with project assets.

## Audited starting state

- `C:\Videos` already exists at the VFS root.
- The `folder-pictures` node is at the root but is named `My Pictures`; `VIRTUAL_PATHS.pictures` still resolves to `C:\My Pictures`.
- The desktop `My Music` shortcut targets `C:\Windows\Media`; `VIRTUAL_NODE_IDS.music` aliases the Windows Media folder.
- `PROJECT_MEDIA_MANIFEST` nodes are currently mapped into personal media folders and also represented by project shortcuts. This is the wrong ownership boundary; project assets belong in their corresponding project folder.
- Explorer has a flat list of quick locations and a stale Downloads link, rather than the requested root-child tree.
- The app already has a `mail` route backed by `Contact97`, but the form sends to a different address and IE has no Mail button.
- The existing user media library directories are empty. The new manifest should remain empty until the user supplies actual files; no demo media will be fabricated.

## Implementation sequence

### 1. Canonical VFS paths and safe migration

- Make `C:\Pictures` and `C:\Music` canonical; retain `folder-pictures` so existing picture and Screenshots descendants keep their IDs.
- Add `folder-music` under `ROOT_ID`; keep `C:\Windows\Media` as the separate system-media directory and legacy audio alias.
- Normalize legacy `C:\My Pictures` paths to `C:\Pictures`.
- Move non-system personal audio previously stored under Windows Media to the new Music folder while preserving IDs and descendants; do not move system files.
- Reparent previously misplaced project-manifest assets into their matching project folders and remove only their generated duplicate shortcut nodes.
- Update the desktop VFS shortcuts and the persisted OS shortcut migration.

### 2. Personal media manifest and physical drop locations

- Add `src/data/personal-media-manifest.ts` with separate `PERSONAL_VIDEOS`, `PERSONAL_PICTURES`, and `PERSONAL_MUSIC` arrays.
- Infer and validate MIME types from manifest filenames; allow the documented `/media/videos/`, `/media/pictures/`, `/media/music/` paths plus existing project `/media/images/` and `/media/audio/` compatibility paths.
- Seed personal items into `C:\Videos`, `C:\Pictures`, and `C:\Music` with the appropriate app bindings.
- Keep project assets under `C:\Projects\<ProjectName>` and out of personal libraries.
- Document and create the requested public media drop directories.

### 3. Explorer hierarchy

- Show My Computer (C:) as the tree root and Desktop, My Documents, Projects, Videos, Pictures, Music, Program Files, and Windows as direct children.
- Remove the stale Downloads quick-location entry if it does not exist in the current canonical VFS.

### 4. Outlook Express / Mail

- Add the Outlook Express desktop `.lnk` and a local pixel-style envelope icon.
- Add an IE Mail toolbar button that opens the existing `mail` window route.
- Style the existing contact composer as a classic Outlook Express new-message surface with fixed `To: weruroy347@gmail.com`, editable Subject, and message body.
- Keep sending user-triggered via `mailto:`; do not auto-send or transmit anything during testing.

### 5. Verification and records

- Test path normalization, root topology, shortcut targets, personal manifest mapping, project/personal isolation, legacy migration preservation, and mail routing.
- Run TypeScript, lint, tests, production build, and `git diff --check`.
- Verify the updated VFS tree and Outlook Express launch through the existing browser-extension tab only; do not clear browser storage or use native-app automation.
- Update the Chapter 2 tracker and add an achievement only for evidenced work. Keep actual-media playback and matched Stitch parity partial while the manifests/media are empty and source captures are unavailable.

## Acceptance boundary

Folder paths, links, and app routing can be implemented and tested without physical media. Actual video, picture, and audio playback/viewing remains unverified until files are supplied under the documented public directories and added to the manifest. The IE/contact mail form is considered wired only when the fixed recipient, Subject, body, and click-to-compose route are verified; sending remains the user's action.

## Implementation result and evidence — 2026-09-23

- Canonical virtual paths now resolve to `C:\Videos`, `C:\Pictures`, and `C:\Music`; the root Pictures node keeps its existing ID and Screenshots child. `C:\Windows\Media` remains a separate system folder. Virtual layout version is 11, and persisted OS shortcut migration version is 19.
- Personal media has its own typed manifest. The three arrays are intentionally empty because no real personal media files have been supplied. Synthetic manifest fixtures verify file naming, MIME validation, root parent IDs, and Media Player/Paint/CD Player bindings.
- Project media manifest nodes now map to the matching project folder instead of personal libraries. A synthetic AfyaTrack manifest fixture verifies this ownership boundary. Actual media playback is not claimed.
- Legacy repair tests verify that a user audio file or wholly personal album subtree can move from Windows Media without changing its ID, while system files, project media, shortcuts, and unrelated text remain in place. The browser profile had no duplicate legacy folders to exercise, so the live legacy-data migration itself remains unobserved.
- Desktop shortcut defaults, the VFS shortcut links, and the schema migration now direct Pictures and Music to their root folders. A browser reload exercised the current persistence migration; the My Music desktop shortcut opened an Explorer window at `C:\Music`.
- Explorer live state showed Desktop, My Documents, Projects, Videos, Pictures, Music, Program Files, and Windows directly under My Computer (C:). Opening My Documents showed exactly the four portfolio text files and no media folders.
- Outlook Express has a local pixel envelope icon, desktop launch shortcut, IE Mail toolbar route, and compose surface with fixed `To: weruroy347@gmail.com`, editable Subject, and message body. Both desktop and IE launch routes were browser-tested. The Send action was deliberately not invoked.
- The existing Chrome extension tab at `http://localhost:3000/` was reused. It showed the full-width desktop after reload, confirmed the Music shortcut and Explorer hierarchy, and showed Outlook Express fields through both launch routes. No browser storage was cleared and no additional tab was created.
- Follow-up persisted-profile check found that the existing `C:\Pictures` window was empty despite the fresh seed containing the supplied icon reference under `C:\Pictures\Screenshots`. Layout version 11 explicitly reconciles that app-owned folder and read-only reference image without clearing user data. Reusing the same Chrome extension tab, a reload showed Screenshots under Pictures, the JPG inside it, and Paint opening the visible image. The desktop is gated on filesystem readiness so restored Explorer windows do not appear empty during the async migration.
- TypeScript and lint passed; all 19 test files / 88 tests passed; production build passed. `git diff --check` passed with only Git's existing LF-to-CRLF working-copy notices. The production build emitted the existing stale Browserslist database notice.

Remaining boundary: `PERSONAL_VIDEOS`, `PERSONAL_PICTURES`, and `PERSONAL_MUSIC` remain empty; real user-media playback and viewing need supplied files. The bundled QA reference image is verified separately in Paint. Matched-viewport Stitch visual parity remains unverified, and this architecture slice does not complete the broader Chapter 2 fidelity objective.
