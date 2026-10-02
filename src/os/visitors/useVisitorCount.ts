'use client';

import { useEffect, useState } from 'react';
import { getVisitorCountForSession97 } from './visitor-count-session97';

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    void getVisitorCountForSession97().then(value => {
      if (active) setCount(value);
    });
    return () => { active = false; };
  }, []);
  return count;
}

