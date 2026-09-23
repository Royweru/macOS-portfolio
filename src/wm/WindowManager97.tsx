'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type { WindowInstance, WindowRect } from '../features/os/os-types';
import Window97 from './Window97';
import { clampWindowRect97, getDesktopBounds97 } from './geometry97';

export interface WindowManager97Props {
  windows: WindowInstance[];
  focusedWindowId: string | null;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, rect: Pick<WindowRect, 'x' | 'y'>) => void;
  onResize: (id: string, rect: WindowRect) => void;
  onRepairRect: (id: string, rect: WindowRect) => void;
  renderContent: (instance: WindowInstance) => ReactNode;
}

export default function WindowManager97({ windows, focusedWindowId, onClose, onMinimize, onMaximize, onFocus, onMove, onResize, onRepairRect, renderContent }: WindowManager97Props) {
  const managerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;
    const repairVisibleWindows = () => {
      const bounds = manager.clientWidth && manager.clientHeight
        ? { width: manager.clientWidth, workAreaHeight: manager.clientHeight }
        : getDesktopBounds97();
      windows.forEach((instance) => {
        if (instance.mode === 'maximized') return;
        const rect = clampWindowRect97(instance, undefined, undefined, bounds);
        if (rect.x !== instance.x || rect.y !== instance.y || rect.width !== instance.width || rect.height !== instance.height) {
          onRepairRect(instance.id, rect);
        }
      });
    };
    repairVisibleWindows();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(repairVisibleWindows);
    observer.observe(manager);
    return () => observer.disconnect();
  }, [windows, onRepairRect]);

  const moveWithinStage = (id: string, next: Pick<WindowRect, 'x' | 'y'>) => {
    const instance = windows.find((window) => window.id === id);
    if (!instance) return;
    const rect = clampWindowRect97({ ...instance, ...next });
    onMove(id, { x: rect.x, y: rect.y });
  };
  const resizeWithinStage = (id: string, next: WindowRect) => {
    onResize(id, clampWindowRect97(next));
  };
  return <div ref={managerRef} className="window-manager97" aria-label="Open windows">{windows.map((instance) => <Window97 key={instance.id} instance={instance} isFocused={instance.id === focusedWindowId} onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} onFocus={onFocus} onMove={moveWithinStage} onResize={resizeWithinStage}>{renderContent(instance)}</Window97>)}</div>;
}
