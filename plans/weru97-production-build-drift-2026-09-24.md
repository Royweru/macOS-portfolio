# Weru 97 Production / Worktree README Divergence Audit — 2026-09-24

## Purpose

Record a discrepancy found while checking the browser experience for external project links. This is a diagnosis, not a deployment or a claim that the current source is live.

## Evidence

- The existing browser tab is at `https://weru97.vercel.app/`.
- Its accessibility tree shows an open project document named `README.txt`, described as read-only `README.md` content, whose visible text contains `REPLACE_WITH_ADVENTURES_LIVE_URL`.
- A fresh read-only browser-extension visit to the public homepage on 2026-09-24 reached the desktop without starting localhost. The live accessibility tree again showed a `README.txt` window whose content identifies itself as `README.md` and still contains `REPLACE_WITH_ADVENTURES_LIVE_URL`; this confirms the discrepancy remains visible, not just an earlier observation.
- A direct HTTP GET to `https://weru97.vercel.app/text/traveling_agency_readme.md` returned status 200 and the published Markdown itself contains `Live site  : REPLACE_WITH_ADVENTURES_LIVE_URL`.
- The current worktree's `src/data/portfolio-manifest.ts` points Adventures at `/text/traveling_agency_readme.md` and sets its live destination to `https://travelicious-rose.vercel.app`.
- `public/text/traveling_agency_readme.md` contains a Markdown link to that configured live destination.
- Focused local verification passed: `MarkdownPreview97.test.ts` and `filesystem-service.test.ts` (2 files, 15 tests). The Markdown tests reject `REPLACE_WITH_*` placeholders and assert that configured live links render with `_blank` and `noopener noreferrer`.

## Assessment

The published Markdown asset itself is stale, so the visible placeholder is not explained solely by persisted profile data. The deployed application may also be an older bundle, but that is not needed to establish the asset mismatch. External project links are implemented locally to open in a separate tab; a distinct browser application cannot be selected by a website.

The newly observed `.txt` title paired with Markdown content is an additional live presentation mismatch. The current worktree repairs source-linked documents to use the matching `.md` filename, but the published application/assets have not been changed.

## Safe next steps

1. Preserve the current browser profile and all IndexedDB content; do not clear or reset it as a diagnostic shortcut.
2. Do not deploy without explicit authorization.
3. After an authorized release, GET the deployed Markdown asset and verify the placeholder is gone and the real URL is present.
4. Reopen the Adventures README in Notepad and click its live URL; verify it opens in a separate browser tab.
5. Update the Chapter 2 task list and this evidence record with the result; only then close the partial item.

## Status

Open. No production state was changed, no deployment was triggered, and the external destination was not opened during this audit.
