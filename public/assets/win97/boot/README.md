# Weru 97 boot assets

This bucket is reserved for local boot artwork and BIOS/loading sprites extracted from the approved Stitch references. The active boot implementation is React/CSS in `src/boot/BootSequence97.tsx`; it must not depend on remote images. The BIOS font is bundled locally through `@fontsource/vt323` and imported by `src/app/layout.tsx`, so runtime rendering does not rely on Stitch's Google Fonts request.
