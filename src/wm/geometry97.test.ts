import { describe, expect, it } from 'vitest';
import { clampWindowRect97, getCenteredWindowPosition97, getLogicalWindowPosition, getLogicalWindowSize, positionWindowClearOfShortcuts97, WIN97_WORK_AREA_HEIGHT } from './geometry97';

describe('Weru 97 logical window geometry', () => {
  const sourceBounds = { width: 1024, workAreaHeight: WIN97_WORK_AREA_HEIGHT };

  it('keeps the 1024×768 Stitch composition as a deterministic fallback only', () => {
    expect(clampWindowRect97({ x: 690, y: 260, width: 720, height: 520 }, undefined, undefined, sourceBounds))
      .toEqual({ x: 304, y: 202, width: 720, height: 520 });
  });

  it('keeps minimum sizes and the taskbar work area intact', () => {
    const rect = clampWindowRect97({ x: -40, y: -20, width: 20, height: 20 }, undefined, undefined, sourceBounds);
    expect(rect.x).toBe(0);
    expect(rect.y).toBe(0);
    expect(rect.width).toBe(240);
    expect(rect.height).toBe(160);
    expect(rect.y + rect.height).toBeLessThanOrEqual(WIN97_WORK_AREA_HEIGHT);
  });

  it('moves source-positioned windows past the desktop shortcut rail and adapts on narrow screens', () => {
    expect(positionWindowClearOfShortcuts97({ x: 60, y: 40, width: 440, height: 320 }, { width: 1422, workAreaHeight: 656 }))
      .toEqual({ x: 240, y: 40, width: 440, height: 320 });
    expect(positionWindowClearOfShortcuts97({ x: 88, y: 26, width: 620, height: 430 }, { width: 800, workAreaHeight: 700 }))
      .toEqual({ x: 240, y: 26, width: 560, height: 430 });
    expect(positionWindowClearOfShortcuts97({ x: 60, y: 10, width: 620, height: 430 }, { width: 400, workAreaHeight: 700 }))
      .toEqual({ x: 160, y: 10, width: 240, height: 430 });
    expect(positionWindowClearOfShortcuts97({ x: 320, y: 90, width: 580, height: 450 }, { width: 1422, workAreaHeight: 656 }).x)
      .toBe(320);
  });

  it('uses the full live viewport to position source-sized windows on wide displays', () => {
    const wideViewport = { width: 1422, workAreaHeight: 598 };
    expect(getLogicalWindowSize(900, 600, 0.9, 0.8, sourceBounds)).toEqual({ x: 0, y: 0, width: 900, height: 577 });
    expect(getLogicalWindowPosition(900, 590, 0, 0, sourceBounds)).toEqual({ x: 62, y: 44 });
    expect(getLogicalWindowSize(900, 600, 0.9, 0.8, wideViewport)).toEqual({ x: 0, y: 0, width: 900, height: 478 });
    expect(getLogicalWindowPosition(900, 590, 0, 0, wideViewport)).toEqual({ x: 261, y: 2 });
    expect(getLogicalWindowPosition(680, 520, 20, 30, wideViewport)).toEqual({ x: 391, y: 56 });
  });

  it('positions tall-screen windows in the live work area instead of capping at the source composition', () => {
    const tallWideViewport = { width: 1422, workAreaHeight: 854 };
    expect(getLogicalWindowPosition(900, 590, 0, 0, tallWideViewport)).toEqual({ x: 261, y: 88 });
  });

  it('retains Stitch-authored app sizes until the live work area requires a clamp', () => {
    const wideViewport = { width: 1422, workAreaHeight: 598 };
    expect(getLogicalWindowSize(940, 680, 0.98, 0.96, sourceBounds)).toEqual({ x: 0, y: 0, width: 940, height: 680 });
    expect(getLogicalWindowSize(940, 680, 0.98, 0.96, wideViewport)).toEqual({ x: 0, y: 0, width: 940, height: 574 });
  });

  it('centers source-authored dialogs in the live viewport with their measured vertical bias', () => {
    const sourceBounds = { width: 1280, viewportHeight: 1024, workAreaHeight: 978 };
    expect(getCenteredWindowPosition97(460, 420, -21, sourceBounds)).toEqual({ x: 410, y: 281 });
  });

  it('repairs an old saved rectangle against the current full-width work area', () => {
    const currentViewport = { width: 1422, workAreaHeight: 598 };
    expect(clampWindowRect97({ x: 404, y: 184, width: 620, height: 538 }, undefined, undefined, currentViewport))
      .toEqual({ x: 404, y: 60, width: 620, height: 538 });
  });
});
