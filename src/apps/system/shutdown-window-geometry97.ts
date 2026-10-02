import type { WindowRect } from '../../features/os/os-types';
import { clampWindowRect97, getDesktopBounds97, type DesktopBounds97 } from '../../wm/geometry97';

/** The retained Stitch Shutdown dialog's authored top-left composition. */
export const SHUTDOWN_STITCH_RECT97: WindowRect = {
  x: 56,
  y: 64,
  width: 320,
  height: 196,
};

/** Keep the source-authored dialog placement while making it fit small viewports. */
export function getShutdownInitialRect97(
  bounds: DesktopBounds97 = getDesktopBounds97(),
): WindowRect {
  return clampWindowRect97(SHUTDOWN_STITCH_RECT97, 240, 160, bounds);
}
