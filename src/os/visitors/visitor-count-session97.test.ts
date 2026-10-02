import { describe, expect, it, vi } from 'vitest';
import { createVisitorCountSessionLoader97 } from './visitor-count-session97';

function makeStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
}

describe('Weru 97 visitor count session loader', () => {
  it('increments once when multiple IE windows mount together', async () => {
    const storage = makeStorage();
    let count = 10;
    const fetcher = vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.method === 'POST') count += 1;
      return { ok: true, json: async () => ({ count }) };
    });
    const loadCount = createVisitorCountSessionLoader97(fetcher, () => storage);

    const [firstWindowCount, secondWindowCount] = await Promise.all([
      loadCount(),
      loadCount(),
    ]);

    expect(firstWindowCount).toBe(11);
    expect(secondWindowCount).toBe(11);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith('/api/visitors', { method: 'POST' });
  });

  it('reads the latest global count without incrementing after a same-tab remount', async () => {
    const storage = makeStorage();
    storage.setItem('weru97:visitor-session:v1', '11');
    const fetcher = vi.fn(async () => ({ ok: true, json: async () => ({ count: 18 }) }));
    const loadCount = createVisitorCountSessionLoader97(fetcher, () => storage);

    await expect(loadCount()).resolves.toBe(18);
    expect(fetcher).toHaveBeenCalledWith('/api/visitors', { method: 'GET' });
    expect(storage.getItem('weru97:visitor-session:v1')).toBe('18');
  });

  it('does not retry an ambiguous POST after failure; it switches to GET', async () => {
    const storage = makeStorage();
    let attempts = 0;
    const fetcher = vi.fn(async (_url: string, init?: RequestInit) => {
      attempts += 1;
      if (init?.method === 'POST') throw new Error('connection dropped after request');
      return { ok: true, json: async () => ({ count: 12 }) };
    });
    const loadCount = createVisitorCountSessionLoader97(fetcher, () => storage);

    await expect(loadCount()).resolves.toBeNull();
    await expect(loadCount()).resolves.toBe(12);
    expect(attempts).toBe(2);
    expect(fetcher.mock.calls.map(([, init]) => init?.method)).toEqual(['POST', 'GET']);
  });
});
