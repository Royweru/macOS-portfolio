import { describe, expect, it, vi } from 'vitest';
import { advanceStarfield97, attachScreensaverExit97 } from './screensaver-motion97';

describe('Screensaver97 motion and exit behavior', () => {
  it('keeps star positions and depth fixed when reduced motion is enabled', () => {
    const stars = [{ x: 0.4, y: -0.6, z: 0.1 }];
    advanceStarfield97(stars, { reducedMotion: true, speed: 1, random: () => 0.9 });
    expect(stars).toEqual([{ x: 0.4, y: -0.6, z: 0.1 }]);
  });

  it('advances normal-motion stars and respawns a star that crosses the near plane', () => {
    const stars = [{ x: 0.4, y: -0.6, z: 0.1 }, { x: 0.2, y: 0.8, z: 0.025 }];
    advanceStarfield97(stars, { reducedMotion: false, speed: 1, random: () => 0.75 });
    expect(stars[0].z).toBeCloseTo(0.092);
    expect(stars[1]).toEqual({ x: 0.5, y: 0.5, z: 1 });
  });

  it('exits once on the first pointer, mouse, or keyboard input and removes sibling listeners', () => {
    const target = new EventTarget();
    const onExit = vi.fn();
    const cleanup = attachScreensaverExit97(target, onExit);

    target.dispatchEvent(new Event('keydown'));
    target.dispatchEvent(new Event('pointerdown'));
    target.dispatchEvent(new Event('mousemove'));

    expect(onExit).toHaveBeenCalledOnce();
    cleanup();
    target.dispatchEvent(new Event('keydown'));
    expect(onExit).toHaveBeenCalledOnce();
  });

  it('removes all exit listeners when unmounted before user input', () => {
    const target = new EventTarget();
    const onExit = vi.fn();
    const cleanup = attachScreensaverExit97(target, onExit);
    cleanup();

    target.dispatchEvent(new Event('pointerdown'));
    target.dispatchEvent(new Event('mousemove'));
    target.dispatchEvent(new Event('keydown'));
    expect(onExit).not.toHaveBeenCalled();
  });
});
