# Chapter 2 — Popup-Blocked Browser Handoff (2026-09-25)

- The shared external opener now distinguishes an actually created tab from a browser-blocked request. It sets a no-referrer document policy and detaches the new page from Weru 97 before navigation.
- When scripted external navigation is blocked, OS-launched links retain their destination and show an accessible classic retry panel with a safe native new-tab anchor. IE address navigation also reports the blocked state accurately and preserves its retry link.
- Focused external routing and fallback tests passed (4 files / 13 tests). Full gates passed: 67 files / 306 tests, ESLint, TypeScript, and production build.
- This verifies implementation and rendered retry markup, not browser popup policy in a live runtime. The published deployment remains stale and was not changed.

See `plans/weru97-blocked-browser-handoff-2026-09-25.md` and the active Chapter 2 tracker.
