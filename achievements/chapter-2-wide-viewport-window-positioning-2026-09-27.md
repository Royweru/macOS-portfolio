# Chapter 2 Achievement — Wide-Viewport Window Positioning

**Date:** 2026-09-27  
**Scope:** Chapter 2, Phase 1 — Desktop canvas

Removed the 1024px positioning cap from initial window placement while keeping Stitch's source-authored app sizes. New windows now use the live browser width and taskbar-excluded work area. At 1420×640, Outlook Express opened centered at approximately x=390 rather than x=192, clear of the desktop shortcut cells.

Geometry tests, the full 338-test suite, TypeScript, lint across 217 TypeScript files, and the production build all pass. The responsive comparison matrix and full visual parity remain partial.
