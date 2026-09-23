'use client';

import { useEffect, useState } from 'react';

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => { let active = true; void fetch('/api/visitors', { method: 'POST' }).then(response => response.ok ? response.json() as Promise<{ count: number }> : Promise.reject(new Error('visitor API unavailable'))).then(data => { if (active) setCount(data.count); }).catch(() => { if (active) setCount(null); }); return () => { active = false; }; }, []);
  return count;
}

