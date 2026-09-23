import { describe, expect, it } from 'vitest';
import { isBundledMediaSource, isSupportedMediaMimeType } from './media-types';

describe('Win97 media associations', () => {
  it('accepts classic video, audio, and bitmap formats', () => {
    expect(isSupportedMediaMimeType('video', 'video/x-msvideo')).toBe(true);
    expect(isSupportedMediaMimeType('audio', 'audio/midi')).toBe(true);
    expect(isSupportedMediaMimeType('image', 'image/bmp')).toBe(true);
  });

  it('does not accept unsupported binary formats', () => {
    expect(isSupportedMediaMimeType('video', 'application/x-msdownload')).toBe(false);
  });

  it('allows personal media drop paths while retaining project image and audio paths', () => {
    expect(isBundledMediaSource({ kind: 'video', source: '/media/videos/intro.mp4' })).toBe(true);
    expect(isBundledMediaSource({ kind: 'image', source: '/media/pictures/portrait.jpg' })).toBe(true);
    expect(isBundledMediaSource({ kind: 'audio', source: '/media/music/theme.wav' })).toBe(true);
    expect(isBundledMediaSource({ kind: 'image', source: '/media/images/project-shot.png' })).toBe(true);
    expect(isBundledMediaSource({ kind: 'audio', source: '/media/audio/project-track.wav' })).toBe(true);
    expect(isBundledMediaSource({ kind: 'audio', source: '/media/videos/theme.wav' })).toBe(false);
  });
});
