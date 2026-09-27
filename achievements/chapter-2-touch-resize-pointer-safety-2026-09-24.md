# Chapter 2 — Touch Resize Pointer Safety (2026-09-24)

## Delivered

- Closed a shared touch-input gap: native browser pan/zoom could cancel a pointer-captured resize because the resize handles lacked `touch-action: none`.
- Applied touch-action and selection suppression to all eight resize zones; kept the same policy on the title drag surface both inline and in CSS.
- Added SSR regression coverage for all edge/corner handles and verified maximized windows have no resize handles.
- Updated the Chapter 2 task list, plan, and achievements index. Phase 3 remains partial pending the real touch-device and per-app control matrix.

## Verification

- Focused Window97 render tests: 1 test file, 2 tests passed.
- TypeScript: `npx tsc --noEmit` passed.
- Lint: `npm run lint` passed.
- Full suite: 31 test files, 128 tests passed.
- Production build: `npm run build` passed; only the existing stale Browserslist-data notice was emitted.
- Live touch-device testing: not performed.
