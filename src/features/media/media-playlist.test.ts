import { describe, expect, it } from 'vitest';
import type { MediaAsset } from './media-types';
import { adjacentMediaAsset, buildPlayableMediaList, formatMediaDuration, mediaAssetFilename, mediaAssetKey } from './media-playlist';

const asset = (overrides: Partial<MediaAsset> & Pick<MediaAsset, 'id' | 'kind' | 'source' | 'mimeType'>): MediaAsset => ({
  projectId: 1,
  title: overrides.id,
  ...overrides,
});

describe('playable media playlist', () => {
  const first = asset({ id: 'first', kind: 'video', source: '/media/videos/first%20demo.mp4', mimeType: 'video/mp4' });
  const second = asset({ id: 'second', kind: 'audio', source: '/media/audio/theme.wav', mimeType: 'audio/wav' });

  it('keeps supported audio/video, skips images and unsupported formats, and deduplicates sources', () => {
    const duplicate = { ...first, title: 'duplicate row' };
    const duplicateSource = { ...first, id: 'different-id-same-source' };
    const image = asset({ id: 'image', kind: 'image', source: '/media/images/poster.jpg', mimeType: 'image/jpeg' });
    const unsupported = asset({ id: 'binary', kind: 'video', source: '/media/videos/payload.exe', mimeType: 'application/x-msdownload' });

    expect(buildPlayableMediaList([first, duplicate, duplicateSource, second, image, unsupported])).toEqual([first, second]);
  });

  it('puts a directly opened file first without duplicating it from the library', () => {
    expect(buildPlayableMediaList([first, second], second)).toEqual([second, first]);
  });

  it('does not activate a directly opened image or unsupported media file', () => {
    const image = asset({ id: 'image', kind: 'image', source: '/media/images/poster.jpg', mimeType: 'image/jpeg' });
    const unsupported = asset({ id: 'legacy', kind: 'video', source: '/media/videos/legacy.avi', mimeType: 'application/x-msdownload' });

    expect(buildPlayableMediaList([], image)).toEqual([]);
    expect(buildPlayableMediaList([], unsupported)).toEqual([]);
  });

  it('moves previous and next through the list and wraps at either end', () => {
    const playlist = [first, second];
    expect(adjacentMediaAsset(playlist, mediaAssetKey(first), 1)).toBe(second);
    expect(adjacentMediaAsset(playlist, mediaAssetKey(first), -1)).toBe(second);
    expect(adjacentMediaAsset(playlist, null, 1)).toBe(first);
    expect(adjacentMediaAsset([first], mediaAssetKey(first), 1)).toBeUndefined();
  });

  it('formats durations safely and displays the source filename', () => {
    expect(formatMediaDuration(3725)).toBe('62:05');
    expect(formatMediaDuration(Number.NaN)).toBe('--:--');
    expect(mediaAssetFilename(first)).toBe('first demo.mp4');
    expect(mediaAssetFilename({ ...first, source: 'https://cdn.example/demo.mp4?token=ignored' })).toBe('demo.mp4');
  });
});
