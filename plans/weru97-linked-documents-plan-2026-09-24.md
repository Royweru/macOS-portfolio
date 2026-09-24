# Weru 97 — Linked Project and Personal Documents (2026-09-24)

## Goal

Keep document bodies in public assets instead of embedding whole documents in TypeScript manifests. The manifest remains the index of which document appears in the virtual filesystem and where its actual text file lives.

## Data contract

- Project entries use `readme: '/text/<project>_readme.md'`.
- Personal entries use `DOCUMENTS[]` with `id`, `filename`, `src`, and `readOnly`; `src` points to a same-origin `.txt` file under `public/text/`.
- VFS document nodes keep their stable IDs and existing My Documents placement. They store `contentUrl` and empty initial `content`; README nodes use `text/markdown`, while profile text documents use `text/plain`.
- The legacy document manifest is a projection of the canonical document manifest, not a second owner of profile text.

## Notepad behavior

- Fetch the linked asset on open with same-origin credentials and an abort signal.
- Accept only a same-origin path whose extension matches the node MIME type (`.txt` for `text/plain`, `.md` for `text/markdown`).
- Display fetched source in the normal editable text area; only Markdown offers the rendered Preview toggle.
- Cache successful reads in IndexedDB for later/offline display. Keep path failures visible as a read error instead of displaying the path as document contents.
- Keep system/profile documents read-only; user-created text files retain their existing save behavior.

## Migration and verification

- Seeded profile nodes are reconciled through stable IDs and same-source cache preservation. The older migration route attaches the same asset URLs instead of reseeding inline text.
- Filesystem tests assert each manifest URL is a real `public/` file and the resulting VFS node references that URL with no literal path stored as content.
- Verification: `npx tsc --noEmit`, `npm run lint`, serial Vitest suite, and `npm run build`.
- Browser-level fetch/display was not manually repeated in this slice because the user requested localhost be stopped; no dev or production server was started.

## Remaining boundary

This change establishes linked assets and Notepad rendering. It does not complete the full Chapter 2 Stitch parity audit or claim per-application visual acceptance.
