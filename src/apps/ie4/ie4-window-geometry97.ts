import type { WindowRect } from '../../features/os/os-types';
import {
  clampWindowRect97,
  getDesktopBounds97,
  WIN97_MIN_WINDOW_WIDTH,
  WIN97_SHORTCUT_RAIL_WIDTH,
  type DesktopBounds97,
} from '../../wm/geometry97';

const STITCH_IE4_WIDTH = 940;
const STITCH_IE4_HEIGHT = 680;
const STITCH_SOURCE_CONTENT_LEFT = 96;
const STITCH_SOURCE_CONTENT_RIGHT = 16;
const STITCH_SOURCE_CONTENT_TOP = 16;
const STITCH_SOURCE_CONTENT_HEIGHT_REDUCTION = 58;

/**
 * Reproduce the Stitch IE window's actual padded content-column geometry.
 * Its 80px icon rail plus nested 8px insets place the 940px window at x=281
 * on a 1422px viewport; its source wrapper and padding leave 586px of content
 * height at a 644px viewport, so max-height:96% renders at 563px tall.
 * Weru's wider icon rail remains the minimum left boundary on smaller screens.
 */
export function getIe4InitialRect97(
  cascade = 0,
  bounds: DesktopBounds97 = getDesktopBounds97(),
): WindowRect {
  const viewportHeight = bounds.viewportHeight ?? bounds.workAreaHeight + 46;
  const sourceContentWidth = Math.max(
    1,
    bounds.width - STITCH_SOURCE_CONTENT_LEFT - STITCH_SOURCE_CONTENT_RIGHT,
  );
  const sourceContentHeight = Math.max(
    1,
    viewportHeight - STITCH_SOURCE_CONTENT_HEIGHT_REDUCTION,
  );
  const safeLeft = Math.min(
    WIN97_SHORTCUT_RAIL_WIDTH,
    Math.max(0, bounds.width - WIN97_MIN_WINDOW_WIDTH),
  );
  const width = Math.min(
    STITCH_IE4_WIDTH,
    Math.floor(sourceContentWidth * 0.98),
    Math.max(WIN97_MIN_WINDOW_WIDTH, bounds.width - safeLeft),
  );
  const height = Math.min(
    STITCH_IE4_HEIGHT,
    Math.round(sourceContentHeight * 0.96),
    bounds.workAreaHeight,
  );
  const sourceX = STITCH_SOURCE_CONTENT_LEFT
    + Math.floor((sourceContentWidth - width) / 2);
  const sourceY = STITCH_SOURCE_CONTENT_TOP
    + Math.round((sourceContentHeight - height) / 2);

  return clampWindowRect97({
    x: Math.max(safeLeft, sourceX) + cascade,
    y: sourceY + cascade,
    width,
    height,
  }, undefined, undefined, bounds);
}
