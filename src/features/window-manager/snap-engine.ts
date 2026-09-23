import type { SnapSlot, WindowRect } from '../os/os-types';

export interface WorkArea {
  width: number;
  height: number;
  topInset: number;
  bottomInset: number;
}

export interface PointerPosition {
  x: number;
  y: number;
}

const isNear = (value: number, edge: number, activationDistance: number) =>
  Math.abs(value - edge) <= activationDistance;

/**
 * Converts a pointer location into a Windows-style edge/corner snap slot.
 * Corner zones take precedence over half-screen zones.
 */
export function getSnapSlot(
  pointer: PointerPosition,
  area: WorkArea,
  activationDistance = 28,
): SnapSlot | null {
  const top = area.topInset;
  const bottom = area.height - area.bottomInset;
  const nearLeft = isNear(pointer.x, 0, activationDistance);
  const nearRight = isNear(pointer.x, area.width, activationDistance);
  const nearTop = isNear(pointer.y, top, activationDistance);
  const nearBottom = isNear(pointer.y, bottom, activationDistance);

  if (nearTop && nearLeft) return 'top-left';
  if (nearTop && nearRight) return 'top-right';
  if (nearBottom && nearLeft) return 'bottom-left';
  if (nearBottom && nearRight) return 'bottom-right';
  if (nearLeft) return 'left';
  if (nearRight) return 'right';
  if (nearTop) return 'top';
  if (nearBottom) return 'bottom';

  return null;
}

/**
 * Calculates a snap rectangle inside the desktop work area.
 * The returned rectangle is safe to use as absolute-positioned window geometry.
 */
export function getSnapRect(slot: SnapSlot, area: WorkArea, gap = 0): WindowRect {
  const usableTop = area.topInset;
  const usableBottom = area.height - area.bottomInset;
  const usableHeight = Math.max(0, usableBottom - usableTop);
  const halfHeight = usableHeight / 2;

  const left = gap;
  const right = area.width / 2 + gap / 2;
  const top = usableTop + gap;
  const bottom = usableTop + halfHeight + gap / 2;
  const width = area.width / 2 - gap * 1.5;
  const height = halfHeight - gap * 1.5;

  switch (slot) {
    case 'left':
      return { x: left, y: usableTop + gap, width, height: usableHeight - gap * 2 };
    case 'right':
      return { x: right, y: usableTop + gap, width, height: usableHeight - gap * 2 };
    case 'top':
      return { x: gap, y: top, width: area.width - gap * 2, height: halfHeight - gap * 1.5 };
    case 'bottom':
      return { x: gap, y: bottom, width: area.width - gap * 2, height };
    case 'top-left':
      return { x: left, y: top, width, height };
    case 'top-right':
      return { x: right, y: top, width, height };
    case 'bottom-left':
      return { x: left, y: bottom, width, height };
    case 'bottom-right':
      return { x: right, y: bottom, width, height };
    default:
      return { x: 0, y: usableTop, width: area.width, height: usableHeight };
  }
}

export function clampWindowRect(
  rect: WindowRect,
  area: WorkArea,
  minWidth = 380,
  minHeight = 280,
): WindowRect {
  const width = Math.min(Math.max(rect.width, minWidth), area.width);
  const height = Math.min(Math.max(rect.height, minHeight), area.height - area.topInset - area.bottomInset);
  const maxX = Math.max(0, area.width - width);
  const maxY = Math.max(area.topInset, area.height - area.bottomInset - height);

  return {
    x: Math.min(Math.max(rect.x, 0), maxX),
    y: Math.min(Math.max(rect.y, area.topInset), maxY),
    width,
    height,
  };
}
