import { describe, expect, it, vi } from 'vitest';
import { pauseMedia97 } from './media-player-lifecycle97';

describe('Media Player lifecycle', () => {
  it('pauses an active media element during source change or window unmount', () => {
    const media = { pause: vi.fn() };

    pauseMedia97(media);

    expect(media.pause).toHaveBeenCalledOnce();
  });

  it('tolerates a window that has no media element mounted', () => {
    expect(() => pauseMedia97(null)).not.toThrow();
  });
});
