import type { WindowRect } from '../features/os/os-types';

/** Stitch's source-composition dimensions; never used to size the live shell. */
export const WIN97_DESKTOP_WIDTH = 1024;
export const WIN97_DESKTOP_HEIGHT = 768;
export const WIN97_TASKBAR_HEIGHT = 46;
export const WIN97_WORK_AREA_HEIGHT = WIN97_DESKTOP_HEIGHT - WIN97_TASKBAR_HEIGHT;
export const WIN97_MIN_WINDOW_WIDTH = 240;
export const WIN97_MIN_WINDOW_HEIGHT = 160;

/** Source-authored initial My Documents window from the Stitch desktop screen. */
export const STITCH_DESKTOP_EXPLORER_RECT: WindowRect = { x: 240, y: 60, width: 560, height: 410 };

export interface DesktopBounds97 {
  width: number;
  workAreaHeight: number;
}

/**
 * Use the real browser viewport for visibility bounds. The 1024×768 Stitch
 * composition remains an anchor for source-authored window positions, but it
 * is never rendered as a fixed-size desktop or used to create side borders.
 */
export function getDesktopBounds97(): DesktopBounds97 {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { width: WIN97_DESKTOP_WIDTH, workAreaHeight: WIN97_WORK_AREA_HEIGHT };
  }
  const width = document.documentElement.clientWidth || window.innerWidth || WIN97_DESKTOP_WIDTH;
  const height = document.documentElement.clientHeight || window.innerHeight || WIN97_DESKTOP_HEIGHT;
  return {
    width: Math.max(1, Math.round(width)),
    workAreaHeight: Math.max(1, Math.round(height - WIN97_TASKBAR_HEIGHT)),
  };
}

export function clampWindowRect97(
  rect: WindowRect,
  minWidth = WIN97_MIN_WINDOW_WIDTH,
  minHeight = WIN97_MIN_WINDOW_HEIGHT,
  bounds = getDesktopBounds97(),
): WindowRect {
  const maxWidth = Math.max(1, Math.round(bounds.width));
  const maxHeight = Math.max(1, Math.round(bounds.workAreaHeight));
  const width = Math.min(Math.max(Math.min(minWidth, maxWidth), Math.round(rect.width)), maxWidth);
  const height = Math.min(Math.max(Math.min(minHeight, maxHeight), Math.round(rect.height)), maxHeight);
  const x = Math.min(Math.max(0, Math.round(rect.x)), maxWidth - width);
  const y = Math.min(Math.max(0, Math.round(rect.y)), maxHeight - height);
  return { x, y, width, height };
}

export function getLogicalWindowSize(
  baseWidth: number,
  baseHeight: number,
  maxWidthPercent = 0.9,
  maxHeightPercent = 0.8,
  bounds = getDesktopBounds97(),
) {
  return clampWindowRect97({
    x: 0,
    y: 0,
    width: Math.min(baseWidth, Math.floor(Math.min(WIN97_DESKTOP_WIDTH, bounds.width) * maxWidthPercent)),
    height: Math.min(baseHeight, Math.floor(Math.min(WIN97_WORK_AREA_HEIGHT, bounds.workAreaHeight) * maxHeightPercent)),
  }, WIN97_MIN_WINDOW_WIDTH, WIN97_MIN_WINDOW_HEIGHT, bounds);
}

export function getLogicalWindowPosition(
  width: number,
  height: number,
  offsetX = 0,
  offsetY = 0,
  bounds = getDesktopBounds97(),
) {
  const layoutWidth = Math.min(WIN97_DESKTOP_WIDTH, bounds.width);
  const layoutHeight = Math.min(WIN97_WORK_AREA_HEIGHT, bounds.workAreaHeight);
  const rect = clampWindowRect97({
    x: Math.floor((layoutWidth - width) / 2) + offsetX,
    y: Math.floor((layoutHeight - height) / 3) + offsetY,
    width,
    height,
  }, WIN97_MIN_WINDOW_WIDTH, WIN97_MIN_WINDOW_HEIGHT, bounds);
  return { x: rect.x, y: rect.y };
}

/** Read the explicit CSS-to-logical scale used by pointer math. */
export function getStageScale97(stage: HTMLElement | null): number {
  if (!stage) return 1;
  const value = Number(stage.dataset.shellScale ?? getComputedStyle(stage).getPropertyValue('--shell97-scale'));
  return Number.isFinite(value) && value > 0 ? value : 1;
}
