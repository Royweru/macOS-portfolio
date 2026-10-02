import type { WindowRect } from '../../features/os/os-types';
import {
  clampWindowRect97,
  getDesktopBounds97,
  getLogicalWindowSize,
  type DesktopBounds97,
} from '../../wm/geometry97';

const PAINT_SOURCE_WIDTH = 840;
const PAINT_SOURCE_HEIGHT = 478;
const SOURCE_ICON_RAIL_WIDTH = 80;
const SOURCE_CONTENT_RIGHT_GUTTER = 24;
const SOURCE_CONTENT_TOP_GUTTER = 16;

/**
 * Stitch's Paint page centers its window in the content column beside the
 * 80px desktop icon rail and starts that column 16px below the viewport top.
 * Keep that authored placement while clamping on smaller browser work areas.
 */
export function getPaintInitialRect97(
  cascade = 0,
  bounds: DesktopBounds97 = getDesktopBounds97(),
): WindowRect {
  const { width, height } = getLogicalWindowSize(
    PAINT_SOURCE_WIDTH,
    PAINT_SOURCE_HEIGHT,
    0.98,
    0.96,
    bounds,
  );
  const sourceContentLeft = SOURCE_ICON_RAIL_WIDTH + 8;
  const x = sourceContentLeft
    + Math.floor((bounds.width - sourceContentLeft - SOURCE_CONTENT_RIGHT_GUTTER - width) / 2)
    + cascade;

  return clampWindowRect97({
    x,
    y: SOURCE_CONTENT_TOP_GUTTER + cascade,
    width,
    height,
  }, undefined, undefined, bounds);
}
