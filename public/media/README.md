# Weru OS bundled media

Project media is declared in `src/data/project-media-manifest.ts` and served
from this public directory. Keep binary assets out of IndexedDB; the virtual
filesystem stores metadata and non-copying links to these sources.

Expected directories:

- `videos/` — project demos and walkthroughs
- `audio/` — interviews, narration, or project sound
- `images/` — project screenshots and stills
- `posters/` — optional video poster frames
- `captions/` — optional WebVTT caption files

Only bundled, allowlisted paths should be added to the manifest.
