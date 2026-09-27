import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import MediaPlayer97 from './MediaPlayer97';
import { createWin97Nodes } from '../../features/filesystem/filesystem-service';
import { PROJECTS } from '../../data/portfolio-manifest';
import { mediaAssetFromVfsNode97 } from '../../features/media/window-media-asset97';
import { WINDOW_CONFIGS } from '../../constants';
import { getMediaPlayerInitialRect97 } from './media-player-geometry97';

const stitchSource = readFileSync(join(process.cwd(), 'Stitch Designs', 'html', 'windows_97_media_player_6.4.html'), 'utf8');
const stitchStyles = readFileSync(join(process.cwd(), 'src', 'styles', 'stitch97.css'), 'utf8');
const playerSource = readFileSync(join(process.cwd(), 'src', 'apps', 'media-player', 'MediaPlayer97.tsx'), 'utf8');

describe('MediaPlayer97 Stitch satellite surfaces', () => {
  it('closes each open menu and modal surface when Escape is pressed', () => {
    const escapeHandler = playerSource.match(/if \(event\.key === 'Escape'\) \{([\s\S]*?)\n {4}\}/)?.[1] ?? '';

    expect(escapeHandler).toContain('setOpenMenu(null)');
    expect(escapeHandler).toContain('if (showLibrary) setShowLibrary(false)');
    expect(escapeHandler).toContain('if (showUrlDialog) setShowUrlDialog(false)');
    expect(escapeHandler).toContain('if (showProperties) setShowProperties(false)');
  });

  it('renders a separate compact player with minimize/close controls and the codec notice', () => {
    const html = renderToStaticMarkup(createElement(MediaPlayer97));

    expect(html).toContain('class="win97-media-compact"');
    expect(html).toContain('aria-label="WMP Compact Mode"');
    expect(html).toContain('aria-label="Minimize compact player"');
    expect(html).toContain('aria-label="Close compact player"');
    expect(html).toContain('role="dialog" aria-label="Codec Notice"');
  });

  it('binds a project video asset to the player element and enables its Play action', () => {
    const html = renderToStaticMarkup(createElement(MediaPlayer97, {
      asset: { id: 'gigaclaw-demo', projectId: 3, kind: 'video', title: 'Gigaclaw demo', source: '/media/videos/gigaclaw.mp4', mimeType: 'video/mp4' },
    }));

    expect(html).toContain('<video');
    expect(html).toContain('src="/media/videos/gigaclaw.mp4"');
    expect(html).toContain('aria-label="Gigaclaw demo"');
    expect(html).toContain('aria-label="Play"');
    expect(html).not.toMatch(/<button[^>]*aria-label="Play"[^>]*disabled=""/);
  });

  it('carries every project demo from its VFS node to the matching playable video element', () => {
    const nodes = createWin97Nodes();
    const projectsWithDemos = PROJECTS.filter(project => project.files?.demo);
    expect(projectsWithDemos).toHaveLength(4);

    for (const project of projectsWithDemos) {
      const node = nodes.find(candidate => candidate.id === `project-${project.id}-demo`);
      const asset = mediaAssetFromVfsNode97(node);
      expect(asset?.source).toBe(project.files!.demo!.src);
      expect(asset?.kind).toBe('video');

      const html = renderToStaticMarkup(createElement(MediaPlayer97, { asset }));
      expect(html).toContain(`<video`);
      expect(html).toContain(`src="${project.files!.demo!.src}"`);
      expect(html).toContain(`aria-label="${project.files!.demo!.title ?? `${project.title} Demo`}"`);
      expect(html).not.toMatch(/<button[^>]*aria-label="Play"[^>]*disabled=""/);
    }
  });

  it('keeps transport buttons at the 24px size authored in the Stitch screen', () => {
    expect(stitchSource).toMatch(/class="w-6 h-6[^"]*"[^>]*title="Play"/);
    expect(stitchStyles).toMatch(/\.win97-media-transport-buttons > \.win95-button \{[^}]*width: 24px; height: 24px; min-width: 24px; min-height: 24px;/);
  });

  it('uses the source-measured 640×396 outer window instead of the old oversized estimate', () => {
    expect(stitchSource).toMatch(/absolute left-20 top-6 z-30 w-\[640px\][^"]*flex flex-col/);
    expect(WINDOW_CONFIGS['media-player']).toMatchObject({ w: 640, h: 396 });
  });

  it('opens at Stitch coordinates, cascades duplicate media windows, and clamps to the live work area', () => {
    expect(getMediaPlayerInitialRect97(0, { width: 1422, workAreaHeight: 656, viewportHeight: 702 })).toEqual({ x: 80, y: 56, width: 640, height: 396 });
    expect(getMediaPlayerInitialRect97(44, { width: 1422, workAreaHeight: 656, viewportHeight: 702 })).toEqual({ x: 124, y: 100, width: 640, height: 396 });
    expect(getMediaPlayerInitialRect97(0, { width: 600, workAreaHeight: 400, viewportHeight: 446 })).toEqual({ x: 0, y: 4, width: 600, height: 396 });
  });

  it('keeps the Stitch-sized client rows and playlist controls inside the window', () => {
    expect(stitchSource).toContain('Classic Menu Bar');
    expect(stitchSource).toContain('h-[20px]');
    expect(stitchSource).toContain('h-[260px]');
    expect(stitchSource).toContain('mt-1');
    expect(stitchSource).toContain('h-3.5');
    expect(stitchSource).toContain('h-6 bg-surface-container border-t');
    expect(stitchSource).toContain('Window Status Bar');
    expect(stitchStyles).toMatch(/\.window97\[data-window-app-id='media-player'\] \{ border-width: 1px; \}/);
    expect(stitchStyles).toMatch(/\.win97-media-surface \{ display: flex; min-height: 0; flex-direction: column; overflow: hidden; \}/);
    expect(stitchStyles).toMatch(/\.win97-media-primary \{ display: flex; min-height: 0; flex-direction: column; gap: 4px; \}/);
    expect(stitchStyles).toMatch(/\.win97-media-screen-stitch \{[^}]*height: 260px;[^}]*margin: 0;/);
    expect(stitchStyles).toMatch(/\.win97-media-seek-row \{[^}]*height: 14px;[^}]*margin-top: 4px;/);
    expect(stitchStyles).toMatch(/\.win97-media-playlist-stitch footer > \.win95-button \{[^}]*min-width: 0;[^}]*min-height: 16px;/);
    expect(stitchStyles).toMatch(/\.win97-media-transport \{ height: 36px; min-height: 36px; flex: 0 0 36px;[^}]*padding-block: 5\.5px;/);
    expect(stitchStyles).toMatch(/\.win97-media-status-stitch \{ height: 20px; min-height: 20px; flex: 0 0 20px;/);
  });
});
