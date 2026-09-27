import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import MediaUnavailable97 from './MediaUnavailable97';
import { describeMediaFailure97 } from './media-failure97';

describe('Media Player failure feedback', () => {
  it('distinguishes network, decode, unsupported-format, and play-policy errors', () => {
    expect(describeMediaFailure97({ code: 2 }).status).toBe('Media network error');
    expect(describeMediaFailure97({ code: 3 }).status).toBe('Media decode error');
    expect(describeMediaFailure97({ code: 4 }).status).toBe('Unsupported media');
    expect(describeMediaFailure97({ name: 'NotAllowedError' }).status).toBe('Playback blocked');
    expect(describeMediaFailure97({ name: 'AbortError' }).status).toBe('Playback interrupted');
  });

  it('offers a safe separate-tab fallback for local video assets', () => {
    const html = renderToStaticMarkup(createElement(MediaUnavailable97, {
      asset: { id: 'demo', projectId: 3, kind: 'video', title: 'Gigaclaw demo', source: '/media/videos/gigaclaw.mp4', mimeType: 'video/mp4' },
      failure: describeMediaFailure97({ code: 4 }),
    }));

    expect(html).toContain('role="alert"');
    expect(html).toContain('This browser cannot play the media container or codec.');
    expect(html).toContain('href="/media/videos/gigaclaw.mp4" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('Open original video in a new tab');
  });

  it('does not render a fallback link for a non-bundled media URL', () => {
    const html = renderToStaticMarkup(createElement(MediaUnavailable97, {
      asset: { id: 'remote', projectId: 3, kind: 'video', title: 'Remote video', source: 'javascript:alert(1)', mimeType: 'video/mp4' },
      failure: describeMediaFailure97(null),
    }));

    expect(html).not.toContain('<a ');
  });
});
