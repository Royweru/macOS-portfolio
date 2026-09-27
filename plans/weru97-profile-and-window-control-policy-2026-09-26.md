# Weru 97 Profile Identity and Window-Control Policy

Date: 2026-09-26  
Status: implemented and regression-tested; visual Stitch comparison remains open.

## Scope

- Correct the profile owner shown in System Properties to Roy Weru.
- Replace the redundant IE4 “Weru Portfolio / weru.dev” destination with Roy's X profile, `https://x.com/RoyWeru`.
- Follow the retained System Properties Stitch source, whose title bar has Close only; keep its window movable and resizable.
- Ensure the control restriction survives persisted legacy state and cannot be bypassed through keyboard/taskbar store actions.
- State the current email behavior accurately and document what is needed for actual server-side delivery.

## Implementation

- Added the X URL to `PROFILE` and reused that single manifest value for the IE4 quick link and link-directory card. Outbound navigation keeps the existing safe separate-browser-tab behavior.
- Changed the System Properties registered user label from Alex Weru to Roy Weru.
- Added source-defined minimize/maximize policy to the shared window configuration and OS store. System Properties exposes Close only, but retains its drag surface and all eight resize handles.
- Bumped persisted OS state to version 24. The migration restores a legacy maximized System Properties window to its saved normal rectangle, clears unsupported minimized/maximized state, and applies the source control policy without touching filesystem/profile data.
- Added render, store, and migration tests covering the identity/link, titlebar controls, resize availability, and persistence repair.

## Email delivery status and next architecture

`Contact97` currently builds a `mailto:weruroy347@gmail.com` URL. This asks the visitor's configured mail client to compose/send the message; Weru 97 does not itself deliver email, and the UI does not claim that the server sent it.

Server-side email delivery is explicitly out of scope for now. Keep Outlook Express client-side: Send opens the visitor's configured mail application with `weruroy347@gmail.com` and the composed subject/body prefilled. The visitor must review and send the draft. This does not open Roy's private inbox, send automatically, or prove delivery; do not add a server route or provider integration unless Roy asks for it later.

## Verification and remaining work

- Focused tests: 4 files, 86 tests passed.
- `npx tsc --noEmit --incremental false`: passed.
- Full configured batched lint: passed all 217 TypeScript files in 28 batches. The full suite also passed (69 files / 332 tests), `npx tsc --noEmit --incremental false` passed, and `npm run build` passed. Build emitted only the existing stale Browserslist database notice.
- Browser extension parity was not verified in this slice. Only the Codex in-app preview was available; its first-visit welcome layer prevented a reliable UI inspection. No production deployment was made.
- Chapter 2 remains open for the existing per-screen Stitch comparisons. Provider setup is deferred by the user and is not a completion requirement for this phase.
