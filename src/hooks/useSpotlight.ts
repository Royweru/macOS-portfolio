// ─── hooks/useSpotlight.ts ────────────────────────────────────────────────────
// Toggles Spotlight on Cmd+Space (Mac) or Ctrl+Space (Windows/Linux).
// Returns isOpen + handlers to pass to <Spotlight />.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';

export function useSpotlight() {
  const [isOpen, setIsOpen] = useState(false);

  const open  = useCallback(() => setIsOpen(true),  []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd+Space (Mac) or Ctrl+Space
      if (e.code === 'Space' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
      // Also support Cmd+K (common in dev tools)
      if (e.code === 'KeyK' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle]);

  return { isOpen, open, close, toggle };
}
