import { useEffect, useState } from 'react';

/** Tracks the browser motion preference for animated Win97 surfaces. */
export function useReducedMotion97(forced = false) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return forced || reducedMotion;
}
