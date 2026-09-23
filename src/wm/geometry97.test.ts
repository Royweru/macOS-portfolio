import { describe, expect, it } from 'vitest';
import { clampWindowRect97, getLogicalWindowPosition, getLogicalWindowSize, WIN97_WORK_AREA_HEIGHT } from './geometry97';

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

  it('keeps Stitch window anchors while sizing to the measured work area', () => {
    const wideViewport = { width: 1422, workAreaHeight: 598 };
    expect(getLogicalWindowSize(900, 600, 0.9, 0.8, sourceBounds)).toEqual({ x: 0, y: 0, width: 900, height: 577 });
    expect(getLogicalWindowPosition(900, 590, 0, 0, sourceBounds)).toEqual({ x: 62, y: 44 });
    expect(getLogicalWindowSize(900, 600, 0.9, 0.8, wideViewport)).toEqual({ x: 0, y: 0, width: 900, height: 478 });
    expect(getLogicalWindowPosition(900, 590, 0, 0, wideViewport)).toEqual({ x: 62, y: 2 });
  });

  it('retains Stitch-authored app sizes until the live work area requires a clamp', () => {
    const wideViewport = { width: 1422, workAreaHeight: 598 };
    expect(getLogicalWindowSize(940, 680, 0.98, 0.96, sourceBounds)).toEqual({ x: 0, y: 0, width: 940, height: 680 });
    expect(getLogicalWindowSize(940, 680, 0.98, 0.96, wideViewport)).toEqual({ x: 0, y: 0, width: 940, height: 574 });
  });

  it('repairs an old saved rectangle against the current full-width work area', () => {
    const currentViewport = { width: 1422, workAreaHeight: 598 };
    expect(clampWindowRect97({ x: 404, y: 184, width: 620, height: 538 }, undefined, undefined, currentViewport))
      .toEqual({ x: 404, y: 60, width: 620, height: 538 });
  });
});
