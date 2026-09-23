'use client';

import { useRef, useState } from 'react';
import AppIcon from './AppIcon';
import TitleBar95 from './win95/TitleBar95';
import type { WindowRect, SnapSlot } from '../features/os/os-types';
import type { WorkArea } from '../features/window-manager/snap-engine';
import type { WindowId } from '../types';

type ResizeDirection = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
interface PointerSession { kind: 'drag' | 'resize'; direction?: ResizeDirection; pointerId: number; startPoint: { x: number; y: number }; startRect: WindowRect; }

interface WindowProps {
  id: string;
  appId: WindowId;
  title: string;
  icon?: string;
  isOpen: boolean;
  isFocused: boolean;
  isMaximized: boolean;
  zIndex: number;
  statusText?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultX?: number;
  defaultY?: number;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove?: (id: string, position: Pick<WindowRect, 'x' | 'y'>) => void;
  onResize?: (id: string, rect: WindowRect) => void;
  onSnap?: (id: string, rect: WindowRect, slot: SnapSlot) => void;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
  viewControls?: React.ReactNode;
  workArea?: WorkArea;
}

export default function Window({ id, appId, title, icon, isOpen, isFocused, isMaximized, zIndex, statusText, defaultWidth = 640, defaultHeight = 440, defaultX = 80, defaultY = 50, onClose, onMinimize, onMaximize, onFocus, onMove, onResize, children, sidebar, showSidebar = false, viewControls }: WindowProps) {
  const [rect, setRect] = useState<WindowRect>({ x: defaultX, y: defaultY, width: defaultWidth, height: defaultHeight });
  const session = useRef<PointerSession | null>(null);

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!session.current || session.current.pointerId !== event.pointerId) return;
    const active = session.current;
    session.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (active.kind === 'drag') onMove?.(id, { x: rect.x, y: rect.y });
    else onResize?.(id, rect);
  };

  const movePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const active = session.current;
    if (!active || active.pointerId !== event.pointerId || isMaximized) return;
    const dx = event.clientX - active.startPoint.x;
    const dy = event.clientY - active.startPoint.y;
    if (active.kind === 'drag') {
      const next = { ...rect, x: Math.max(0, active.startRect.x + dx), y: Math.max(0, active.startRect.y + dy) };
      setRect(next);
    } else if (active.direction) {
      const next = { ...active.startRect };
      if (active.direction.includes('e')) next.width = Math.max(320, active.startRect.width + dx);
      if (active.direction.includes('s')) next.height = Math.max(220, active.startRect.height + dy);
      if (active.direction.includes('w')) { next.x = active.startRect.x + dx; next.width = Math.max(320, active.startRect.width - dx); }
      if (active.direction.includes('n')) { next.y = active.startRect.y + dy; next.height = Math.max(220, active.startRect.height - dy); }
      setRect(next);
    }
  };

  const startPointer = (kind: 'drag' | 'resize', event: React.PointerEvent<HTMLDivElement>, direction?: ResizeDirection) => {
    if (event.button !== 0 || isMaximized) return;
    event.stopPropagation();
    onFocus(id);
    session.current = { kind, direction, pointerId: event.pointerId, startPoint: { x: event.clientX, y: event.clientY }, startRect: rect };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  if (!isOpen) return null;
  const style = isMaximized ? { left: 0, top: 0, width: '100%', height: 'calc(100% - var(--w95-taskbar-h))' } : { left: rect.x, top: rect.y, width: rect.width, height: rect.height };
  return <section className={`window97 window-frame ${isFocused ? 'focused' : 'inactive'} ${isMaximized ? 'maximized' : ''}`} style={{ ...style, zIndex }} onPointerDown={() => onFocus(id)}>
    <div onPointerDown={(event) => startPointer('drag', event)} onPointerMove={movePointer} onPointerUp={endPointer}>
      <TitleBar95 title={title} icon={icon ? <span>{icon}</span> : <AppIcon appId={appId} size={13} />} isActive={isFocused} onMinimize={() => onMinimize(id)} onMaximize={() => onMaximize(id)} onClose={() => onClose(id)} onDoubleClick={() => onMaximize(id)} />
    </div>
    {showSidebar && sidebar && <aside className="window97-sidebar">{sidebar}</aside>}
    <div className="window97-content">{viewControls && <div className="window97-view-controls">{viewControls}</div>}{children}</div>
    <div className="window97-status"><span>{statusText ?? 'Ready'}</span><span>{isFocused ? 'Weru 97' : 'Inactive'}</span></div>
    {!isMaximized && (['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'] as ResizeDirection[]).map((direction) => <div key={direction} className={`window97-resize window97-resize-${direction}`} onPointerDown={(event) => startPointer('resize', event, direction)} onPointerMove={movePointer} onPointerUp={endPointer} />)}
  </section>;
}
