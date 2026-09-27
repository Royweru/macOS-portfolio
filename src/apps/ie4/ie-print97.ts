const PRINT_SURFACE_CLASS = 'weru97-ie-print-surface';

/** Mount a detached copy of the IE page so print styles can exclude the OS shell. */
export function mountIePrintSurface97(page: HTMLElement, ownerDocument: Document): () => void {
  ownerDocument.querySelectorAll(`.${PRINT_SURFACE_CLASS}`).forEach(surface => surface.remove());

  const surface = ownerDocument.createElement('div');
  surface.className = PRINT_SURFACE_CLASS;
  surface.append(page.cloneNode(true));
  ownerDocument.body.append(surface);

  let mounted = true;
  return () => {
    if (!mounted) return;
    mounted = false;
    surface.remove();
  };
}
