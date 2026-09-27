import type { WindowRect } from '../../features/os/os-types';
import { clampWindowRect97, getDesktopBounds97 } from '../../wm/geometry97';
import type { DesktopBounds97 } from '../../wm/geometry97';

/** Rendered bounds measured from the retained Stitch source in Chromium. */
export const MEDIA_PLAYER_STITCH_WINDOW_SIZE97 = { width: 640, height: 396 } as const;

/** Stitch's authored first-window position in the full desktop composition. */
export const MEDIA_PLAYER_STITCH_RECT97: WindowRect = { x: 80, y: 56, ...MEDIA_PLAYER_STITCH_WINDOW_SIZE97 };

export function getMediaPlayerInitialRect97(cascade = 0, bounds: DesktopBounds97 = getDesktopBounds97()): WindowRect {
  return clampWindowRect97({
    ...MEDIA_PLAYER_STITCH_RECT97,
    x: MEDIA_PLAYER_STITCH_RECT97.x + cascade,
    y: MEDIA_PLAYER_STITCH_RECT97.y + cascade,
  }, undefined, undefined, bounds);
}

/** The incorrect default shipped before the source-height re-audit. */
export const LEGACY_MEDIA_PLAYER_WINDOW_SIZE97 = { width: 640, height: 520 } as const;
