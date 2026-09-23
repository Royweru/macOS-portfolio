import { useCallback, useRef } from 'react';
import type { WindowRect } from '../features/os/os-types';
import { getStageScale97 } from './geometry97';

interface DragSession {
  pointerId: number;
  startX: number;
  startY: number;
  startRect: WindowRect;
}

export interface Drag97Options {
  rect: WindowRect;
  disabled?: boolean;
  onMove: (rect: Pick<WindowRect, 'x' | 'y'>) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export function useDrag97({ rect, disabled = false, onMove, onStart, onEnd }: Drag97Options) {
  const session = useRef<DragSession | null>(null);

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (disabled || event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [data-window-control], [data-window-resize]')) return;
    event.preventDefault();
    event.stopPropagation();
    session.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, startRect: rect };
    event.currentTarget.setPointerCapture(event.pointerId);
    onStart?.();
  }, [disabled, onStart, rect]);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const active = session.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const stage = event.currentTarget.closest<HTMLElement>('.shell97-stage');
    const scale = getStageScale97(stage);
    onMove({
      x: Math.max(0, active.startRect.x + (event.clientX - active.startX) / scale),
      y: Math.max(0, active.startRect.y + (event.clientY - active.startY) / scale),
    });
  }, [onMove]);

  const finish = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (!session.current || session.current.pointerId !== event.pointerId) return;
    session.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    onEnd?.();
  }, [onEnd]);

  return { onPointerDown, onPointerMove, onPointerUp: finish, onPointerCancel: finish };
}
