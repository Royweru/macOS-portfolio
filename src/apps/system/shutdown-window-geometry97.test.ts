import { describe, expect, it } from 'vitest';
import { getShutdownInitialRect97, SHUTDOWN_STITCH_RECT97 } from './shutdown-window-geometry97';

describe('Shutdown Stitch window geometry', () => {
  it('keeps the retained source dimensions and top-left placement on a wide viewport', () => {
    expect(getShutdownInitialRect97({ width: 1422, workAreaHeight: 656, viewportHeight: 702 }))
      .toEqual(SHUTDOWN_STITCH_RECT97);
  });

  it('clamps the dialog into a narrow and short viewport without changing its anchor unnecessarily', () => {
    expect(getShutdownInitialRect97({ width: 280, workAreaHeight: 154, viewportHeight: 200 }))
      .toEqual({ x: 0, y: 0, width: 280, height: 154 });
  });
});
