# Profile identity and source-specific window controls

Implemented a small, evidence-backed Chapter 2 slice on 2026-09-26.

- Corrected the System Properties registered owner from Alex Weru to Roy Weru.
- Replaced the redundant IE4 “Weru Portfolio / weru.dev” card with the X profile `https://x.com/RoyWeru`; the quick-links bar uses the same manifest URL and retains safe external-tab handling.
- Matched System Properties title-bar controls to the retained Stitch source: Close only. The window remains draggable and resizable; configuration, store guards, and schema-v24 repair apply the rule to new and persisted instances.
- `npm test -- --run src/wm/Window97.test.ts src/features/os/os-store.test.ts src/apps/system/SystemProperties97.test.ts src/apps/ie4/RetroBrowser97.test.ts`: passed, 4 files / 86 tests.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run lint`: all 217 TypeScript files passed in 28 bounded batches.
- Full suite: 69 files / 332 tests passed; `npx tsc --noEmit --incremental false` passed; `npm run build` passed with the existing stale Browserslist database notice.
- Email status remains honest: Outlook Express currently launches the visitor's mail client with a `mailto:` draft; direct delivery to Roy needs a configured server-side mail provider and verified sender. No message was sent.
- Live screenshot parity and full Chapter 2 completion remain open; no deployment was performed.

Plan: `plans/weru97-profile-and-window-control-policy-2026-09-26.md`.
