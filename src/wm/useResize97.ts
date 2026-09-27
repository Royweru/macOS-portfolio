import { useCallback, useRef } from 'react';
import type { WindowRect } from '../features/os/os-types';
import { getStageScale97 } from './geometry97';

export type ResizeDirection97 = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface ResizeSession {
  pointerId: number;
  startX: number;
  startY: number;
  startRect: WindowRect;
  direction: ResizeDirection97;
}

export interface Resize97Options {
  rect: WindowRect;
  minWidth?: number;
  minHeight?: number;
  disabled?: boolean;
  onResize: (rect: WindowRect) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Apply a pointer delta in logical desktop coordinates. West/north resizing
 * keeps the opposite edge anchored and stops at the desktop origin instead
 * of letting a clamped position silently move that anchored edge.
 */
export function resizeRectFromPointer97(
  startRect: WindowRect,
  direction: ResizeDirection97,
  dx: number,
  dy: number,
  minWidth: number,
  minHeight: number,
): WindowRect {
  const next = { ...startRect };
  if (direction.includes('e')) next.width = Math.max(minWidth, startRect.width + dx);
  if (direction.includes('s')) next.height = Math.max(minHeight, startRect.height + dy);
  if (direction.includes('w')) {
    const boundedDelta = Math.max(-startRect.x, Math.min(startRect.width - minWidth, dx));
    next.x = startRect.x + boundedDelta;
    next.width = startRect.width - boundedDelta;
  }
  if (direction.includes('n')) {
    const boundedDelta = Math.max(-startRect.y, Math.min(startRect.height - minHeight, dy));
    next.y = startRect.y + boundedDelta;
    next.height = startRect.height - boundedDelta;
  }
  return next;
}

export function useResize97({ rect, minWidth = 240, minHeight = 160, disabled = false, onResize, onStart, onEnd }: Resize97Options) {
  const session = useRef<ResizeSession | null>(null);

  const start = useCallback((direction: ResizeDirection97, event: React.PointerEvent<HTMLElement>) => {
    if (disabled || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    session.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, startRect: rect, direction };
    event.currentTarget.setPointerCapture(event.pointerId);
    onStart?.();
  }, [disabled, onStart, rect]);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const active = session.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const stage = event.currentTarget.closest<HTMLElement>('.shell97-stage');
    const scale = getStageScale97(stage);
    const dx = (event.clientX - active.startX) / scale;
    const dy = (event.clientY - active.startY) / scale;
    onResize(resizeRectFromPointer97(active.startRect, active.direction, dx, dy, minWidth, minHeight));
  }, [minHeight, minWidth, onResize]);

  const finish = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (!session.current || session.current.pointerId !== event.pointerId) return;
    session.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    onEnd?.();
  }, [onEnd]);

  return { start, onPointerMove, onPointerUp: finish, onPointerCancel: finish };
}
