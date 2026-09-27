import { describe, expect, it } from 'vitest';
import { toggleMediaFavorite97 } from './media-player-favorites97';

const clip = { id: 'demo', projectId: 1, kind: 'video' as const, title: 'Demo', source: '/media/videos/demo.mp4', mimeType: 'video/mp4' };

describe('Media Player Favorites', () => {
  it('adds a media item once and removes that same source when toggled again', () => {
    const saved = toggleMediaFavorite97([], clip);
    expect(saved).toEqual([clip]);
    expect(toggleMediaFavorite97(saved, clip)).toEqual([]);
  });

  it('treats the same source as one favorite even when its metadata differs', () => {
    const renamed = { ...clip, title: 'Updated title' };
    expect(toggleMediaFavorite97([clip], renamed)).toEqual([]);
  });
});
