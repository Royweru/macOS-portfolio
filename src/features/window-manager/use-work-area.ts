'use client';

import { useEffect, useState } from 'react';
import type { WorkArea } from './snap-engine';

export const TASKBAR_HEIGHT = 58;

const getArea = (): WorkArea => ({
  width: typeof window === 'undefined' ? 1440 : window.innerWidth,
  height: typeof window === 'undefined' ? 900 : window.innerHeight,
  topInset: 0,
  bottomInset: TASKBAR_HEIGHT,
});

/** Measures the browser work area used by the compositor and snap engine. */
export function useWorkArea(): WorkArea {
  const [area, setArea] = useState<WorkArea>(getArea);

  useEffect(() => {
    const update = () => setArea(getArea());
    update();
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  return area;
}
