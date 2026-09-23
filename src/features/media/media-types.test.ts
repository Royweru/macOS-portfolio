import { describe, expect, it } from 'vitest';
import { isSupportedMediaMimeType } from './media-types';

describe('Win97 media associations', () => {
  it('accepts classic video, audio, and bitmap formats', () => {
    expect(isSupportedMediaMimeType('video', 'video/x-msvideo')).toBe(true);
    expect(isSupportedMediaMimeType('audio', 'audio/midi')).toBe(true);
    expect(isSupportedMediaMimeType('image', 'image/bmp')).toBe(true);
  });

  it('does not accept unsupported binary formats', () => {
    expect(isSupportedMediaMimeType('video', 'application/x-msdownload')).toBe(false);
  });
});
