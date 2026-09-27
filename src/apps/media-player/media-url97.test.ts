import { describe, expect, it } from 'vitest';
import { mediaAssetFromUrl97 } from './media-url97';

describe('Media Player Open URL', () => {
  it('accepts direct HTTP(S) audio/video files and preserves a readable filename', () => {
    expect(mediaAssetFromUrl97('https://cdn.example.test/demo%20clip.mp4?token=abc')).toMatchObject({
      kind: 'video',
      title: 'demo clip.mp4',
      source: 'https://cdn.example.test/demo%20clip.mp4?token=abc',
      mimeType: 'video/mp4',
    });
    expect(mediaAssetFromUrl97('http://cdn.example.test/music/track.wav')).toMatchObject({ kind: 'audio', mimeType: 'audio/wav' });
  });

  it('rejects pages, unknown formats, unsafe protocols, and URLs with embedded credentials', () => {
    for (const value of [
      'https://example.test/project',
      'https://example.test/clip.exe',
      'javascript:alert(1)',
      'data:video/mp4;base64,AAAA',
      'https://user:pass@example.test/clip.mp4',
      'https://example.test/folder/',
    ]) expect(mediaAssetFromUrl97(value)).toBeUndefined();
  });
});
