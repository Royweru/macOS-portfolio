'use client';

import { useRef, useState, type ReactNode } from 'react';
import AppIcon from '../components/AppIcon';
import TitleBar95 from '../components/win95/TitleBar95';
import type { WindowInstance, WindowRect } from '../features/os/os-types';
import type { WindowId } from '../types';
import { useDrag97 } from './useDrag97';
import { useResize97, type ResizeDirection97 } from './useResize97';

export interface Window97Props {
  instance: WindowInstance;
  isFocused: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, rect: Pick<WindowRect, 'x' | 'y'>) => void;
  onResize: (id: string, rect: WindowRect) => void;
  children: ReactNode;
}

export default function Window97({ instance, isFocused, onClose, onMinimize, onMaximize, onFocus, onMove, onResize, children }: Window97Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMaximized = instance.mode === 'maximized';
  const rect = { x: instance.x, y: instance.y, width: instance.width, height: instance.height };
  const drag = useDrag97({ rect, disabled: isMaximized, onStart: () => { if (!isFocused) onFocus(instance.id); }, onMove: (next) => onMove(instance.id, next) });
  const resize = useResize97({ rect, disabled: isMaximized, minWidth: 240, minHeight: 160, onStart: () => onFocus(instance.id), onResize: (next) => onResize(instance.id, next) });
  const resizeDirections: ResizeDirection97[] = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];

  if (instance.mode === 'minimized') return null;
  const requestClose = () => {
    if (contentRef.current?.dataset.windowDirty === 'true' && !window.confirm('This document has unsaved changes. Close without saving?')) return;
    onClose(instance.id);
    setMenuOpen(false);
  };
  const style = isMaximized
    ? { left: 0, top: 0, width: '100%', height: '100%' }
    : { left: instance.x, top: instance.y, width: instance.width, height: instance.height };

  return (
    <section className={`window97 window-frame ${isFocused ? 'focused' : 'inactive'} ${isMaximized ? 'maximized' : ''}`} style={{ ...style, zIndex: instance.zIndex }} onPointerDown={() => { onFocus(instance.id); setMenuOpen(false); }} aria-label={instance.title}>
      <div className="window97-drag-surface" {...drag} onContextMenu={(event) => { event.preventDefault(); event.stopPropagation(); setMenuOpen(true); }}>
        <TitleBar95
          title={instance.title}
          icon={<AppIcon appId={instance.appId as WindowId} size={13} />}
          isActive={isFocused}
          onMinimize={instance.canMinimize ? () => onMinimize(instance.id) : undefined}
          onMaximize={instance.canMaximize ? () => onMaximize(instance.id) : undefined}
          onClose={instance.canClose ? requestClose : undefined}
          onDoubleClick={() => onMaximize(instance.id)}
        />
      </div>
      {menuOpen && <div className="window97-title-context" role="menu"><button type="button" onClick={() => { if (isMaximized) onMaximize(instance.id); setMenuOpen(false); }}>Restore</button><button type="button" onClick={() => { onMinimize(instance.id); setMenuOpen(false); }}>Minimize</button><button type="button" onClick={() => { onMaximize(instance.id); setMenuOpen(false); }}>Maximize</button><hr /><button type="button" onClick={requestClose}>Close</button></div>}
      <div className="window97-content" ref={contentRef}>{children}</div>
      {!isMaximized && resizeDirections.map((direction) => (
        <div key={direction} data-window-resize={direction} className={`window97-resize window97-resize-${direction}`} onPointerDown={(event) => resize.start(direction, event)} onPointerMove={resize.onPointerMove} onPointerUp={resize.onPointerUp} onPointerCancel={resize.onPointerCancel} />
      ))}
    </section>
  );
}
