import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RetroBrowser97 from './RetroBrowser97';

describe('RetroBrowser97 external navigation', () => {
  it('attempts an in-app preview and provides a direct-open fallback for frame-blocking sites', () => {
    const html = renderToStaticMarkup(createElement(RetroBrowser97, {
      initialAddress: 'https://github.com/Royweru',
    }));

    expect(html).toContain('<iframe');
    expect(html).toContain('src="https://github.com/Royweru"');
    expect(html).toContain('sandbox="allow-forms allow-scripts allow-popups allow-popups-to-escape-sandbox"');
    expect(html).toContain('Open in a new browser tab');
    expect(html).toContain('Some sites block in-app previews');
  });
});
