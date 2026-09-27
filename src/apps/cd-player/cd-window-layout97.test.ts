import { describe, expect, it, vi } from 'vitest';
import { getCdPlayerCompanionCloseIds97, getCdPlayerWindowRects97, openCdPlayerPair97 } from './cd-window-layout97';

describe('CD Player Stitch companion-window layout', () => {
  it('centers both source-sized windows as siblings on a wide desktop', () => {
    const rects = getCdPlayerWindowRects97(1280);
    expect(rects.player).toEqual({ x: 163, y: 40, width: 540, height: 420 });
    expect(rects.equalizer).toEqual({ x: 727, y: 40, width: 390, height: 360 });
    expect(rects.equalizer.x).toBeGreaterThan(rects.player.x + rects.player.width);
  });

  it('stacks the source windows below the Stitch large-screen breakpoint', () => {
    const rects = getCdPlayerWindowRects97(768);
    expect(rects.player.x).toBe(114);
    expect(rects.equalizer.x).toBe(189);
    expect(rects.equalizer.y).toBe(rects.player.y + rects.player.height + 24);
  });

  it('opens the no-maximize equalizer first and focuses the player above it', () => {
    const openWindow = vi.fn();
    const rects = getCdPlayerWindowRects97(1280);
    openCdPlayerPair97(openWindow, 'audio-track-1', 1280);

    expect(openWindow).toHaveBeenNthCalledWith(1, 'cd-equalizer', {
      instanceId: 'cd-equalizer',
      title: 'Now Playing - Graphic Equalizer',
      rect: rects.equalizer,
      allowMultiple: false,
      canMaximize: false,
      showMaximize: false,
    });
    expect(openWindow).toHaveBeenNthCalledWith(2, 'cd-player', {
      instanceId: 'cd-player',
      title: 'CD Player',
      rect: rects.player,
      fileId: 'audio-track-1',
      allowMultiple: false,
      canMaximize: false,
    });
  });

  it('closes the equalizer companion with its player, but not vice versa', () => {
    const windows = [
      { id: 'cd-player', appId: 'cd-player' },
      { id: 'cd-equalizer', appId: 'cd-equalizer' },
      { id: 'other-window', appId: 'explorer' },
    ];
    expect(getCdPlayerCompanionCloseIds97('cd-player', windows)).toEqual(['cd-equalizer']);
    expect(getCdPlayerCompanionCloseIds97('cd-equalizer', windows)).toEqual([]);
  });
});
