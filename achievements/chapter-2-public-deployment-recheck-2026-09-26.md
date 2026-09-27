# Chapter 2 — Public Deployment Recheck (2026-09-26)

## Delivered

- Reused the browser extension and opened one temporary tab to the public Weru 97 site; no localhost or native computer UI was used.
- Measured the deployed resize zones at 6px on edges and 10×10px at corners, while the current worktree is 8px/12px.
- Confirmed the deployed README window still exposes placeholder text instead of a rendered Markdown preview and external anchors.
- Recorded the exact production/worktree mismatch in the active Chapter 2 checklist and a dedicated recheck plan.

## Boundaries

- Did not deploy, modify browser storage, or validate links that are absent from the rendered production README.
- The current production site is not evidence against the local implementation; it proves only that the published bundle is stale for these surfaces.

## Remaining

Verify README rendering, external new-tab handoff, and profile recovery only after an authorized release is available. Full Stitch and app interaction parity remain open.
