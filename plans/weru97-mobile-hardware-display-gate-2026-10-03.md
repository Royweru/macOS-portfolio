# Weru 97 — Mobile Hardware Display Gate (< 768px) Implementation Plan

**Date:** 2026-10-03  
**Status:** In Progress / Executing  
**Target:** Production (`main` -> `weru97.live`)

---

## 1. Executive Summary & Goal

Weru 97 is a fully interactive desktop operating system simulating Windows 95 OSR 2.5 / Windows 97, engineered specifically for mouse, keyboard, and workstation displays (SVGA 800×600 or larger). Handheld mobile screens (< 768px) lack the screen real estate for multi-window management, cascading menus, and precise window resizing.

Rather than rendering a cramped, degraded mobile version of a desktop OS, we are implementing a period-authentic **"Hardware Configuration Notice"** dialog for any screen below `768px` (Tailwind `md` breakpoint). This notice informs visitors with retro Windows 95 authenticity that a desktop workstation is required, presents a live hardware diagnostic report, provides a one-click **"Copy Portfolio Link"** utility so they can paste it on their workstation, and features an **Executive Summary & Contact** card (Roy Weru, Full-Stack Software Engineer, Nairobi, Kenya) with direct links to GitHub, LinkedIn, email, and a downloadable text resume.

---

## 2. Design System & Style Constraints

- **Strictly Retro Authenticity:** Adhere 100% to Windows 95 OSR 2.5 / 97 design tokens:
  - Classic teal desktop background: `#008080` (`--win97-desktop`).
  - Standard 3D beveled borders: outer highlight `#ffffff`, inner `#dfdfdf`, dark `#808080`, drop-shadow `#000000` / `#404040`.
  - Classic navy active titlebar gradient: `linear-gradient(90deg, #000080 0%, #1084d0 100%)`.
  - Typography: `MS Sans Serif`, `Tahoma`, and monospace `Courier New` / `Lucida Console`.
  - CRT horizontal scanline texture overlay.
- **Strictly Forbidden:**
  - ❌ NO modern purple gradients or pastel blurs.
  - ❌ NO unicode emojis (e.g. 📱, ❌, ⚠️) — strictly pixel-art SVGs.
  - ❌ NO modern glowing or pulsing status dots.
  - ❌ NO "email to myself" complex service flows (explicitly removed per user direction).

---

## 3. Architecture & Responsive Gating Strategy

1. **Dual-Layer Gating:**
   - **CSS-First Gating (`shell97.css`):**
     Using `@media (max-width: 767px)` and `@media (min-width: 768px)` rules ensures that even prior to JavaScript hydration or on the first CSS render pass, `.weru-desktop-workstation` is hidden (`display: none !important`) and `.weru-mobile-gate` is displayed (`display: flex !important`). This guarantees zero layout shift and zero flash of the desktop shell on mobile devices.
   - **React Runtime Gating (`App.tsx`):**
     Track viewport dimensions via a clean `useViewportSize` or responsive hook so that desktop-specific subsystems (screensaver idle timer, keyboard desktop shortcuts, boot sequence sound engine) do not waste battery or execute heavy background loops on mobile devices.
2. **Component Architecture (`MobileDisplayGate97.tsx`):**
   - Implemented in `src/components/mobile/MobileDisplayGate97.tsx`.
   - Uses SVG pixel icons (16×16 CRT monitor in titlebar, 32×32 warning triangle in dialog body, 12×12 pixel link icon on copy button).
   - Dynamic viewport diagnostics: displays live screen dimensions (`window.innerWidth` × `window.innerHeight`).
   - One-click clipboard copy with temporary feedback state ("Link Copied to Clipboard") and retro toast notification.
   - Client-side downloadable `Resume.txt` generation.
   - Window close button provides retro system acknowledgment ("Notice acknowledged. System halted.").

---

## 4. Atomic Execution Tasks

- [x] **Phase 1: Stitch Design Synthesis & Plan Formalization**
  - [x] Inspect raw Stitch design: `Stitch Designs/html/windows_97_alt_display_mobile_users.html`.
  - [x] Create comprehensive plan in `plans/weru97-mobile-hardware-display-gate-2026-10-03.md`.
  - [x] Update live tracking artifact `task.md` and `implementation_plan.md`.
- [x] **Phase 2: Mobile Gate Component Implementation**
  - [x] Create `src/components/mobile/MobileDisplayGate97.tsx` translating Stitch HTML/CSS into React + Tailwind/CSS tokens.
  - [x] Implement live screen resolution hook and dynamic diagnostic readout.
  - [x] Implement clipboard copy logic with timeout reset and retro toast.
  - [x] Implement downloadable `Resume.txt` generator.
- [x] **Phase 3: CSS Gating & App Shell Integration**
  - [x] Create `src/styles/mobile-gate97.css` with responsive `@media (max-width: 767px)` rules for `.weru-mobile-gate` and `.weru-desktop-workstation`.
  - [x] Update `src/App.tsx` to wrap the desktop shell in `.weru-desktop-workstation` and render `<MobileDisplayGate97 />`.
  - [x] Ensure screensaver idle timers and desktop shortcuts are disabled on `< 768px`.
- [x] **Phase 4: Automated Testing & Verification**
  - [x] Write unit test suite `src/components/mobile/MobileDisplayGate97.test.ts` verifying rendering, diagnostic text, copy behavior, and links.
  - [x] Run `npx tsc --noEmit` to ensure 0 TypeScript errors.
  - [x] Run full Vitest suite (`npm test`) ensuring all test files pass (80 files, 389 tests passed).
  - [x] Run `npm run lint` (all 238 files passed) and `npm run build` (Turbopack production build succeeded).
- [x] **Phase 5: Commit & Push to Main**
  - [x] Stage all changes.
  - [x] Create detailed git commit with architectural rationale.
  - [x] Push to `origin/main` for live Vercel production deployment.
  - [x] Update `walkthrough.md` with verification results.
