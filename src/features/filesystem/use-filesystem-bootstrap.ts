'use client';

import { useEffect, useState } from 'react';
import { seedFilesystem } from './filesystem-service';

/** Opens/seeds the local portfolio filesystem once per browser session. */
export function useFilesystemBootstrap() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    seedFilesystem()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause : new Error('Filesystem initialization failed'));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { ready, error };
}
