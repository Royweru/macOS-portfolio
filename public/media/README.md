# Weru 97 bundled media

Put binary assets in the matching directory below and register them in the
corresponding manifest. The virtual filesystem stores metadata and references;
it does not copy binary files into IndexedDB.

- `videos/` — personal videos in `src/data/personal-media-manifest.ts` and
  project demos in `src/data/project-media-manifest.ts` (the manifests keep
  their VFS ownership separate).
- `pictures/` — personal pictures in `PERSONAL_PICTURES`.
- `music/` — personal tracks in `PERSONAL_MUSIC`.
- `images/` — existing project screenshot assets.
- `audio/` — existing project audio assets.
- `posters/` — optional video poster frames.
- `captions/` — optional WebVTT caption files.

Personal files appear under `C:\\Videos`, `C:\\Pictures`, and `C:\\Music`;
project media appears only in its matching `C:\\Projects\\<ProjectName>` folder.
Only bundled, allowlisted paths should be added to a manifest.
