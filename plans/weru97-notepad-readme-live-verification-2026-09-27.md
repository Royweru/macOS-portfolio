# Weru 97 Notepad README and Dirty-State Live Verification — 2026-09-27

## Scope

Verify the user's README contract in the current local build: project metadata points to a Markdown file, the VFS exposes that path as `README.md`, Notepad renders the file content, outbound links leave the simulated OS, and the README remains read-only. Also perform a non-persistent edit to inspect Notepad's dirty and close-warning behavior. One Chrome-extension QA tab at the local app was used; no external link was activated and no user document was saved.

## Verified behavior

- Explorer → Projects → Adventures exposed `README.md`, `live-site.url`, `skills-used.txt`, `source-code.url`, `tech-stack.spec`, and the project video.
- Opening `README.md` loaded the manifest-linked `/text/traveling_agency_readme.md` asset. The rendered preview showed the actual project headings, description, live-site/source-code links, tech stack, and author section rather than a literal path or manifest placeholder.
- The Source toggle revealed the real Markdown source. The read-only status was visible; File → Save was disabled, while Save As opened with `README copy.md`. Save As was cancelled without creating a document.
- Accessibility labels for each preview link stated that it opens outside Weru 97 in a new browser tab. No external navigation was triggered, avoiding additional tabs.
- Screenshot at the current browser viewport showed a readable 16px-style preview in the Notepad window; its type scale was consistent with the editor's readable styling rather than the former small text appearance.
- An in-memory-only edit to `skills-used.txt` changed status to `Modified`, added `*` to the displayed document state, and updated the caret to line 5, column 22. Clicking title-bar X produced the expected “This document has unsaved changes. Close without saving?” browser confirmation.

## Limits and cleanup

- The extension began timing out on page observations/actions at the native confirm dialog, so Cancel and Discard branches, Save/Save As persistence, Find, and clipboard menu behavior are not claimed as live-verified by this pass.
- The temporary text was never saved to the VFS. The local server on port 3001 was stopped. The agent-created tab could not be closed after the extension stopped responding; it is left for the browser session's automatic ephemeral-tab cleanup. User-owned X, WhatsApp, and Stitch tabs were not changed.
- No source HTML or project document was modified. No deployment or external link activation occurred.

## Result

The README path-backed Markdown and readable rendered-preview contract is verified in the local current-worktree browser. Notepad dirty-state and warning activation are verified; the warning's response branches and full edit/save workflow remain partial.
