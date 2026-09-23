import { describe, expect, it } from 'vitest';
import { createPersonalMediaEntries, getPlayablePersonalMediaEntries, getPersonalMediaAssets, inferPersonalMediaMimeType } from './personal-media-manifest';

describe('personal media manifest', () => {
  it('maps the three personal libraries to distinct media kinds and browser MIME types', () => {
    const entries = createPersonalMediaEntries(
      [{ filename: 'Intro_Weru_OS.mp4', title: 'Weru Intro', src: '/media/videos/Intro_Weru_OS.mp4', durationSeconds: 12, poster: '/media/videos/intro.jpg' }],
      [{ filename: 'Roy_Weru.bmp', title: 'Roy Weru', src: '/media/pictures/Roy_Weru.bmp' }],
      [{ filename: 'Track01_DaftPunk.mp3', title: 'Track 01', artist: 'Daft Punk', src: '/media/music/Track01_DaftPunk.mp3' }],
    );

    expect(entries.map(entry => [entry.kind, entry.filename, entry.mimeType])).toEqual([
      ['video', 'Intro_Weru_OS.mp4', 'video/mp4'],
      ['image', 'Roy_Weru.bmp', 'image/bmp'],
      ['audio', 'Track01_DaftPunk.mp3', 'audio/mpeg'],
    ]);
    expect(entries[0].asset).toMatchObject({ projectId: 0, durationSeconds: 12, poster: '/media/videos/intro.jpg' });
    expect(entries[2].asset.description).toBe('Daft Punk');
  });

  it('only returns playable assets from the documented personal-media roots', () => {
    expect(getPersonalMediaAssets()).toEqual([]);
    expect(inferPersonalMediaMimeType('audio', 'unknown.flac')).toBe('');
    const invalid = createPersonalMediaEntries([], [], [
      { filename: 'outside.wav', title: 'Outside', artist: 'Test', src: '/elsewhere/outside.wav' },
    ]);
    expect(getPlayablePersonalMediaEntries(invalid)).toEqual([]);
  });
});
