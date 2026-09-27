import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RetroBrowser97 from './RetroBrowser97';

describe('RetroBrowser97 external navigation', () => {
  it('keeps the simulated browser on its home page instead of rendering an external-page placeholder', () => {
    const html = renderToStaticMarkup(createElement(RetroBrowser97, {
      initialAddress: 'https://github.com/Royweru',
    }));

    expect(html).not.toContain('<iframe');
    expect(html).not.toContain('This website is outside Weru 97');
    expect(html).toContain('Thank you for visiting my cyberspace corner');
    expect(html).toContain('href="https://github.com/Royweru" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('External websites open in a separate browser tab.');
  });

  it('makes all IE home destinations open safely in separate tabs', () => {
    const html = renderToStaticMarkup(createElement(RetroBrowser97));

    expect(html).not.toContain('<iframe');
    expect(html).toContain('aria-label="Quick Links"');
    expect(html).toContain('X / Twitter');
    expect(html).toContain('aria-label="Internet Explorer globe"');
    expect(html).toContain('Directory of External Hyperlinks');
    expect(html).toContain('Compose an email to weruroy347@gmail.com');
    expect(html).toContain('href="https://github.com/Royweru" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('href="https://www.linkedin.com/in/roy-matheri" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('href="https://x.com/RoyWeru" target="_blank" rel="noopener noreferrer"');
    expect(html).not.toContain('Weru Portfolio');
    expect(html).toContain('href="https://moniepal-two.vercel.app" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('href="https://travelicious-rose.vercel.app" target="_blank" rel="noopener noreferrer"');
    expect(html).not.toContain('retro-engineer');
    expect(html).not.toContain('dev@windows97.net');
  });

  it('keeps Search and Favorites controls available without placeholder-unavailable copy', () => {
    const html = renderToStaticMarkup(createElement(RetroBrowser97));
    expect(html).toContain('aria-label="Search" aria-expanded="false"');
    expect(html).toContain('aria-label="Favorites" aria-expanded="false"');
    expect(html).not.toContain('Search unavailable');
  });

  it('exposes the functional page-only Print toolbar action', () => {
    const html = renderToStaticMarkup(createElement(RetroBrowser97));
    expect(html).toContain('aria-label="Print"');
    expect(html).not.toContain('Print unavailable');
  });

  it('falls back to the Weru home page for an unsafe initial URL', () => {
    const html = renderToStaticMarkup(createElement(RetroBrowser97, { initialAddress: 'javascript:alert(1)' }));

    expect(html).not.toContain('href="javascript:alert(1)"');
    expect(html).toContain('Thank you for visiting my cyberspace corner');
  });
});
