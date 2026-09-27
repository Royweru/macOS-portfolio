import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import BlissWallpaper97 from './BlissWallpaper97';

const stitchDesktopSource = readFileSync(join(process.cwd(), 'Stitch Designs', 'html', 'windows_97_os_desktop.html'), 'utf8');
const shellStyles = readFileSync(join(process.cwd(), 'src', 'styles', 'shell97.css'), 'utf8');
const renderedWallpaper = renderToStaticMarkup(createElement(BlissWallpaper97));

const svgAttribute = (attributes: string, name: string) => attributes.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1] ?? '';

const ellipses = (markup: string) => [...markup.matchAll(/<ellipse\b([^>]*)>/g)].map(([, attributes]) =>
  ['cx', 'cy', 'opacity', 'rx', 'ry'].map(name => Number(svgAttribute(attributes, name)).toString()),
);

const paths = (markup: string) => [...markup.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(([, path]) => path);
const stopColors = (markup: string) => [...markup.matchAll(/stop-color="(#[\da-f]{6})"/gi)].map(([, color]) => color.toLowerCase());

describe('BlissWallpaper97 Stitch source contract', () => {
  it('preserves all cloud ellipse coordinates and the three authored hill paths', () => {
    const sourceCloudStart = stitchDesktopSource.indexOf('<!-- Bliss Clouds');
    const sourceHillStart = stitchDesktopSource.indexOf('<!-- Rolling Green Hills', sourceCloudStart);
    const sourceWallpaperEnd = stitchDesktopSource.indexOf('<!-- END: Bliss Wallpaper -->', sourceHillStart);
    const appCloudStart = renderedWallpaper.indexOf('class="bliss97-clouds"');
    const appCloudEnd = renderedWallpaper.indexOf('</svg>', appCloudStart) + '</svg>'.length;
    const appHillsStart = renderedWallpaper.indexOf('class="bliss97-hills"');
    const appHillsEnd = renderedWallpaper.indexOf('</svg>', appHillsStart) + '</svg>'.length;

    expect(sourceCloudStart).toBeGreaterThanOrEqual(0);
    expect(sourceHillStart).toBeGreaterThan(sourceCloudStart);
    expect(sourceWallpaperEnd).toBeGreaterThan(sourceHillStart);
    expect(appCloudStart).toBeGreaterThanOrEqual(0);
    expect(appHillsStart).toBeGreaterThan(appCloudStart);

    const sourceClouds = stitchDesktopSource.slice(sourceCloudStart, sourceHillStart);
    const appClouds = renderedWallpaper.slice(appCloudStart, appCloudEnd);
    const sourceHills = stitchDesktopSource.slice(sourceHillStart, sourceWallpaperEnd);
    const appHills = renderedWallpaper.slice(appHillsStart, appHillsEnd);

    expect(ellipses(sourceClouds)).toHaveLength(12);
    expect(ellipses(appClouds)).toEqual(ellipses(sourceClouds));
    expect(paths(sourceHills)).toHaveLength(3);
    expect(paths(appHills)).toEqual(paths(sourceHills));
    expect(stopColors(appHills)).toEqual(stopColors(sourceHills));
    expect(shellStyles).toContain('.bliss97-clouds g { filter: blur(2px); }');
    expect(sourceClouds).toContain('filter="blur(2px)"');
  });

  it('keeps the Stitch sky colors and full-width 65%/48% wallpaper layers', () => {
    expect(stitchDesktopSource).toContain('from-[#1b6ee0] via-[#4d9ef5] to-[#99cdfb] h-[65%]');
    expect(stitchDesktopSource).toContain('h-[48%] overflow-hidden');
    expect(shellStyles).toMatch(/\.bliss97-wallpaper\s*\{[^}]*inset:\s*0;/);
    expect(shellStyles).toMatch(/\.bliss97-sky\s*\{[^}]*height:\s*65%;[^}]*linear-gradient\(to bottom, #1b6ee0 0%, #4d9ef5 50%, #99cdfb 100%\)/);
    expect(shellStyles).toMatch(/\.bliss97-clouds\s*\{[^}]*width:\s*100%;[^}]*height:\s*65%;/);
    expect(shellStyles).toMatch(/\.bliss97-hills\s*\{[^}]*inset:\s*auto 0 0;[^}]*height:\s*48%;/);
  });

  it('preserves Stitch’s intentional black horizon while keeping the app shell full-bleed', () => {
    expect(stitchDesktopSource).toMatch(/<body class="[^"]*\bbg-black\b/);
    expect(stitchDesktopSource).toContain('h-[65%]');
    expect(stitchDesktopSource).toContain('h-[48%] overflow-hidden');
    expect(shellStyles).toMatch(/\.shell97-viewport\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;/);
    expect(shellStyles).toMatch(/\.shell97\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;/);
    expect(shellStyles).toMatch(/\.bliss97-wallpaper\s*\{[^}]*inset:\s*0;[^}]*background:\s*#000;/);
  });
});
