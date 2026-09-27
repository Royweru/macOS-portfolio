# Chapter 2 — Boot-to-Desktop Transition (2026-09-24)

## Delivered

- Compared the active boot path with the final transition code in the raw `windows_97_boot_screen.html` source.
- Found that the React shell appeared without the source's taskbar slide-up and staggered icon reveal, and the first-visit wizard appeared too early.
- Added shared timings: taskbar at 300ms; icons from 600ms, staggered by 90ms; first-visit welcome at 1600ms.
- Applied the timing to the actual Weru shell, not the raw source's embedded desktop. User and browser reduced-motion preferences bypass staged movement and welcome delay.
- Updated the Chapter 2 task list, boot screen manifest, boot plan, and achievements index. Boot remains visual/functionality partial pending browser timing and screenshot verification.

## Verification

- Transition helper tests cover source timings, icon stagger, and reduced-motion delay.
- Shell SSR tests cover reveal-mode opt-in and the taskbar timing variable.
- TypeScript: `npx tsc --noEmit` passed.
- Lint: `npm run lint` passed.
- Full suite: 30 test files, 126 tests passed.
- Production build: `npm run build` passed; only the existing stale Browserslist-data notice was emitted.
- Browser/runtime visual check: not run; localhost remains stopped.
