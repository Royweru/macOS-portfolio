import { describe, expect, it } from 'vitest';
import {
  createPersonalMediaEntries,
  getPlayablePersonalMediaEntries,
  getPersonalMediaAssets,
  inferPersonalMediaMimeType,
  PERSONAL_MEDIA_ENTRIES,
} from './personal-media-manifest';

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

  it('infers missing filename extensions and normalizes shorthand media paths', () => {
    const entries = createPersonalMediaEntries(
      [{ filename: 'MoniePal demo', title: 'Demo', src: '/videos/moniepal_update_1.mp4' }],
      [{ filename: 'profile', title: 'Profile', src: '/pictures/profile_pic.png' }],
      [{ filename: 'chill_track', title: 'Chill', artist: 'Artist', src: '/music/track.mp3' }],
    );

    expect(entries.map(e => [e.kind, e.filename, e.mimeType, e.asset.source])).toEqual([
      ['video', 'MoniePal demo.mp4', 'video/mp4', '/media/videos/moniepal_update_1.mp4'],
      ['image', 'profile.png', 'image/png', '/media/pictures/profile_pic.png'],
      ['audio', 'chill_track.mp3', 'audio/mpeg', '/media/music/track.mp3'],
    ]);
    expect(getPlayablePersonalMediaEntries(entries)).toHaveLength(3);
  });

  it('returns seeded active personal media assets across video, image, and audio', () => {
    expect(PERSONAL_MEDIA_ENTRIES).toHaveLength(3);
    const assets = getPersonalMediaAssets();
    expect(assets).toHaveLength(3);
    expect(getPersonalMediaAssets('video')).toHaveLength(1);
    expect(getPersonalMediaAssets('image')).toHaveLength(1);
    expect(getPersonalMediaAssets('audio')).toHaveLength(1);

    expect(assets.map(a => a.source)).toEqual([
      '/media/videos/moniepal_update_1.mp4',
      '/media/pictures/profile_pic.png',
      '/media/music/crystal_skies.mp3',
    ]);
  });

  it('rejects unsupported extensions and paths outside supported media directories', () => {
    expect(inferPersonalMediaMimeType('audio', 'unknown.flac')).toBe('');
    const invalid = createPersonalMediaEntries([], [], [
      { filename: 'outside.wav', title: 'Outside', artist: 'Test', src: '/elsewhere/outside.wav' },
    ]);
    expect(getPlayablePersonalMediaEntries(invalid)).toEqual([]);
  });
});
