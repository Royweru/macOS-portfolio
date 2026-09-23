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
    const next = { ...active.startRect };
    if (active.direction.includes('e')) next.width = Math.max(minWidth, active.startRect.width + dx);
    if (active.direction.includes('s')) next.height = Math.max(minHeight, active.startRect.height + dy);
    if (active.direction.includes('w')) {
      const width = Math.max(minWidth, active.startRect.width - dx);
      next.x = active.startRect.x + active.startRect.width - width;
      next.width = width;
    }
    if (active.direction.includes('n')) {
      const height = Math.max(minHeight, active.startRect.height - dy);
      next.y = active.startRect.y + active.startRect.height - height;
      next.height = height;
    }
    onResize(next);
  }, [minHeight, minWidth, onResize]);

  const finish = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (!session.current || session.current.pointerId !== event.pointerId) return;
    session.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    onEnd?.();
  }, [onEnd]);

  return { start, onPointerMove, onPointerUp: finish, onPointerCancel: finish };
}
