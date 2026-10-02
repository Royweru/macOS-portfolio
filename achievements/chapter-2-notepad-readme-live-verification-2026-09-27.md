# Chapter 2 Achievement — Notepad README Live Verification

**Date:** 2026-09-27  
**Scope:** Chapter 2, Phases 6 and 12 — path-backed project README rendering and Notepad dirty-state signaling

Verified that `C:\Projects\Adventures\README.md` loads the public Markdown file linked by the project manifest and renders its actual headings, copy, and safe external-link controls in Notepad Preview. Source toggling showed the true `.md` body; the file was read-only, Save was disabled, and Save As defaulted to `README copy.md`; cancelling created no file. The visible preview was readable at the current browser viewport.

A disposable unsaved edit in `skills-used.txt` changed the status/title to Modified and displayed an asterisk. Clicking X triggered the expected unsaved-changes confirmation. No draft was saved. The browser extension stopped responding at that confirmation, so Cancel/Discard, Find, clipboard, and actual save persistence remain unverified. The local server was stopped and the outstanding test draft existed only in browser memory.
