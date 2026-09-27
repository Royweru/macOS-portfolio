import { describe, expect, it, vi } from 'vitest';
import { hasDismissedCodecNotice97, rememberCodecNoticeDismissal97 } from './codec-notice-preference97';

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
  };
}

describe('Media Player codec notice preference', () => {
  it('shows the notice until the user opts out, then remembers that choice', () => {
    const storage = createStorage();

    expect(hasDismissedCodecNotice97(storage)).toBe(false);
    rememberCodecNoticeDismissal97(storage);

    expect(storage.setItem).toHaveBeenCalledWith('weru97-media-player-codec-notice-dismissed', 'true');
    expect(hasDismissedCodecNotice97(storage)).toBe(true);
  });

  it('fails open when browser storage is unavailable', () => {
    const storage = {
      getItem: () => { throw new Error('storage blocked'); },
      setItem: () => { throw new Error('storage blocked'); },
    };

    expect(hasDismissedCodecNotice97(storage)).toBe(false);
    expect(() => rememberCodecNoticeDismissal97(storage)).not.toThrow();
  });
});
