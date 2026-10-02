type VisitorResponse = { ok: boolean; json: () => Promise<unknown> };
type VisitorFetch = (url: string, init?: RequestInit) => Promise<VisitorResponse>;
type VisitorStorage = Pick<Storage, 'getItem' | 'setItem'>;

const VISITOR_SESSION_KEY = 'weru97:visitor-session:v1';

/**
 * Build one visitor-counter loader for the portfolio tab session. Multiple IE
 * windows share its in-flight request; a remount/reload with the session marker
 * reads the global count instead of recording another visit.
 */
export function createVisitorCountSessionLoader97(
  fetcher: VisitorFetch,
  getStorage: () => VisitorStorage | undefined,
): () => Promise<number | null> {
  let request: Promise<number | null> | null = null;
  let incrementClaimed = false;

  return () => {
    if (request) return request;

    let storage: VisitorStorage | undefined;
    let hasSessionMarker = false;
    try {
      storage = getStorage();
      hasSessionMarker = storage?.getItem(VISITOR_SESSION_KEY) != null;
    } catch {
      storage = undefined;
    }

    const shouldIncrement = !incrementClaimed && !hasSessionMarker;
    incrementClaimed = true;
    if (shouldIncrement) {
      try {
        storage?.setItem(VISITOR_SESSION_KEY, 'pending');
      } catch {
        // The module-level claim still prevents duplicate increments this page.
      }
    }

    request = fetcher('/api/visitors', { method: shouldIncrement ? 'POST' : 'GET' })
      .then(async (response) => {
        if (!response.ok) throw new Error('visitor API unavailable');
        const payload = await response.json() as { count?: unknown };
        if (typeof payload.count !== 'number' || !Number.isSafeInteger(payload.count) || payload.count < 0) {
          throw new Error('visitor API returned an invalid count');
        }
        try {
          storage?.setItem(VISITOR_SESSION_KEY, String(payload.count));
        } catch {
          // Keep the in-memory result even when this browser blocks session storage.
        }
        return payload.count;
      })
      .catch(() => {
        request = null;
        return null;
      });

    return request;
  };
}

const loadVisitorCountForSession97 = createVisitorCountSessionLoader97(
  (url, init) => fetch(url, init),
  () => typeof window === 'undefined' ? undefined : window.sessionStorage,
);

export function getVisitorCountForSession97() {
  return loadVisitorCountForSession97();
}
