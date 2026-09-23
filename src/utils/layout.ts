import { getLogicalWindowPosition, getLogicalWindowSize } from '../wm/geometry97';

/** Keep Stitch-authored window dimensions when they fit; otherwise size to the live work area. */
export function getResponsiveWindowSize(
  baseWidth: number,
  baseHeight: number,
  maxWidthPercent = 0.98,
  maxHeightPercent = 0.96
) {
  const rect = getLogicalWindowSize(baseWidth, baseHeight, maxWidthPercent, maxHeightPercent);
  return { width: rect.width, height: rect.height };
}

/** Center a window inside the logical Weru 97 work area. */
export function getWindowCenterPosition(width: number, height: number, offsetX = 0, offsetY = 0) {
  return getLogicalWindowPosition(width, height, offsetX, offsetY);
}
