# Chapter 2 — External Link Handoff (2026-09-24)

## Delivered

- Removed the embedded external-site iframe from the IE4 window.
- IE4 home links and rendered README links now use top-level `_blank` anchors with `noopener noreferrer`.
- Address-bar navigation and VFS `.url` targets open HTTP(S) links in a separate browser tab. The shared opener runs synchronously before asynchronous filesystem resolution so the originating user gesture is retained.
- Replaced the external-address faux page with a direct handoff prompt and a clearly labeled “Open website in a new browser tab” link.
- Kept internal OS routes within Weru 97 and rejected unsafe URL schemes.
- Fixed the Adventures and MoniePal README assets to use the actual URLs already declared in `PROJECTS.live`, and validated those real files render as safe new-tab anchors in Markdown Preview.
- Added an external-link handoff plan and updated the Chapter 2 task list and Stitch manifest. The live popup check remains partial rather than being marked done.

## Verification

- Focused external-link, IE4, and Markdown tests include rendering every configured live-project README destination as a safe new-tab link.
- Follow-up handoff UI regression: asserts an external address is described as outside Weru 97 and exposes the new-tab action.
- Full suite after the README-link regression: 34 test files, 138 tests passed.
- TypeScript: `npx tsc --noEmit` passed.
- Lint: `npm run lint` passed.
- Production build: passed; existing stale Browserslist database notice remains.

## Not claimed

- Reused one existing Chrome tab to inspect the deployed site; no extra tab was created and localhost was not started.
- Actual new-tab behavior in the user's browser remains a manual acceptance check. The implementation and DOM/helper tests establish the intended `_blank` behavior, but this record does not claim a live popup test.
