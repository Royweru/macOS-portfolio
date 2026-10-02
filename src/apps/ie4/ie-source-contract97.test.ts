import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RetroBrowser97 from './RetroBrowser97';
import { WINDOW_CONFIGS } from '../../constants';

const stitchIeSource = readFileSync(join(process.cwd(), 'Stitch Designs', 'html', 'windows_97_internet_explorer.html'), 'utf8');
const ieStyles = readFileSync(join(process.cwd(), 'src', 'styles', 'stitch97.css'), 'utf8');

describe('Internet Explorer Stitch structure contract', () => {
  it('keeps the active IE window at the Stitch-authored 940×680 dimensions', () => {
    expect(stitchIeSource).toContain('w-[940px] max-w-[98%] h-[680px] max-h-[96%]');
    expect(WINDOW_CONFIGS.ie4).toMatchObject({
      title: 'case-study.url - Internet Explorer',
      w: 940,
      h: 680,
    });
  });

  it('keeps the source-sized toolbar and its 32px controls', () => {
    expect(stitchIeSource).toContain('class="h-10 bg-surface-container');
    expect(stitchIeSource).toContain('class="win95-raised h-8 px-1.5');
    expect(ieStyles).toMatch(/\.win97-browser-toolbar\s*\{[^}]*min-height:\s*40px;/);
    expect(ieStyles).toMatch(/\.win97-ie4 \.win97-browser-toolbar\s*\{[^}]*height:\s*40px;[^}]*flex:\s*0 0 40px;/);
    expect(ieStyles).toMatch(/\.win97-ie4 \.win97-browser-toolbar \.win95-button\s*\{[^}]*height:\s*32px;[^}]*min-height:\s*32px;/);
    expect(ieStyles).toMatch(/\.win97-ie4\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*overflow:\s*hidden;/);
    expect(ieStyles).toMatch(/\.win97-ie4 \.win97-browser-page\s*\{[^}]*flex:\s*1 1 auto;[^}]*overflow:\s*auto;/);
  });

  it('preserves the centered 672px Stitch page composition and source viewport spacing', () => {
    expect(stitchIeSource).toContain('w-[940px] max-w-[98%] h-[680px] max-h-[96%]');
    expect(stitchIeSource).toContain('overflow-y-auto m-1 p-3');
    expect(stitchIeSource).toContain('max-w-2xl mx-auto flex flex-col items-center text-center');
    expect(stitchIeSource).toContain('win95-raised w-full bg-surface-container-high');
    expect(ieStyles).toMatch(/\.win97-ie4 \.win97-browser-page\s*\{[^}]*margin:\s*4px;[^}]*padding:\s*12px;/);
    expect(ieStyles).toMatch(/\.win97-ie-page-content\s*\{[^}]*max-width:\s*672px;[^}]*margin-inline:\s*auto;[^}]*align-items:\s*center;[^}]*text-align:\s*center;/);
    expect(ieStyles).toMatch(/\.win97-ie-banner\s*\{[^}]*width:\s*100%;/);
    expect(ieStyles).toMatch(/\.win97-ie-construction\s*\{[^}]*#ffff00 0 12px, #000 12px 24px/);
    expect(ieStyles).toMatch(/\.win97-ie-construction-label\s*\{[^}]*background:\s*#c0c0c0/);

    const html = renderToStaticMarkup(createElement(RetroBrowser97));
    const page = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
    expect(page).toContain('class="win97-ie-page-content"');
    expect(page).toContain('class="win97-ie-page-intro"');
    expect(page).toContain('class="win97-ie-construction-label"');
  });

  it('places the 22px segmented status bar after the page viewport, not inside it', () => {
    const sourceStatusStart = stitchIeSource.indexOf('<!-- Segmented Window Status Bar -->');
    const sourceStatusEnd = stitchIeSource.indexOf('<!-- Retro Sticky Note', sourceStatusStart);
    const sourceStatus = stitchIeSource.slice(sourceStatusStart, sourceStatusEnd);
    const html = renderToStaticMarkup(createElement(RetroBrowser97));
    const mainEnd = html.indexOf('</main>');
    const statusbarStart = html.indexOf('class="win97-ie-statusbar"');
    const pageMarkup = html.slice(html.indexOf('<main'), mainEnd);

    expect(sourceStatusStart).toBeGreaterThanOrEqual(0);
    expect(sourceStatus).toContain('h-[22px]');
    expect(sourceStatus).toContain('h-[18px]');
    expect(sourceStatus).toContain('w-32');
    expect(sourceStatus).toContain('w-16');
    expect(ieStyles).toMatch(/\.win97-ie-statusbar\s*\{[^}]*height:\s*22px;[^}]*flex:\s*0 0 22px;/);
    expect(ieStyles).toMatch(/\.win97-ie-status-ready\s*\{[^}]*flex:\s*1 1 auto;/);
    expect(ieStyles).toMatch(/\.win97-ie-status-zone\s*\{[^}]*width:\s*128px;[^}]*flex:\s*0 0 128px;/);
    expect(ieStyles).toMatch(/\.win97-ie-status-ssl\s*\{[^}]*width:\s*64px;[^}]*flex:\s*0 0 64px;/);
    expect(mainEnd).toBeGreaterThan(0);
    expect(statusbarStart).toBeGreaterThan(mainEnd);
    expect(pageMarkup).not.toContain('win97-ie-statusbar');
    expect(html.slice(statusbarStart)).toContain('Internet zone');
    expect(html.slice(statusbarStart)).toContain('Protected Connection');
    expect(html.slice(statusbarStart)).toContain('SSL');
    expect(html.slice(statusbarStart)).toContain('Done');
  });
});
