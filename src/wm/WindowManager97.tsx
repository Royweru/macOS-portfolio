'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { WindowInstance, WindowRect } from '../features/os/os-types';
import Window97 from './Window97';
import UnsavedChangesDialog97 from './UnsavedChangesDialog97';
import { clampWindowRect97, getDesktopBounds97 } from './geometry97';
import { dispatchWindowShortcut97, hasUnsavedChangesInWindow97 } from './window-close97';
import { getWindowControlPolicy97 } from './window-control-policy97';

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
  keyboardShortcutsEnabled?: boolean;
}

export default function WindowManager97({ windows, focusedWindowId, onClose, onMinimize, onMaximize, onFocus, onMove, onResize, onRepairRect, renderContent, keyboardShortcutsEnabled = true }: WindowManager97Props) {
  const managerRef = useRef<HTMLDivElement>(null);
  const [pendingCloseWindowId, setPendingCloseWindowId] = useState<string | null>(null);
  const closeWindow = useCallback((id: string) => {
    setPendingCloseWindowId(current => current === id ? null : current);
    onClose(id);
  }, [onClose]);

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

  useEffect(() => {
    if (!keyboardShortcutsEnabled) return;
    const handleWindowShortcut = (event: KeyboardEvent) => {
      const focusedWindow = windows.find(instance => instance.id === focusedWindowId);
      if (!focusedWindow || pendingCloseWindowId) return;
      const element = [...(managerRef.current?.querySelectorAll<HTMLElement>('[data-window-instance]') ?? [])]
        .find(candidate => candidate.dataset.windowInstance === focusedWindow.id);
      const hasUnsavedChanges = hasUnsavedChangesInWindow97(element);
      dispatchWindowShortcut97(event, { ...focusedWindow, ...getWindowControlPolicy97(focusedWindow) }, {
        hasUnsavedChanges,
        requestDiscardConfirmation: setPendingCloseWindowId,
        close: closeWindow,
        minimize: onMinimize,
        shortcutsEnabled: keyboardShortcutsEnabled,
      });
    };
    window.addEventListener('keydown', handleWindowShortcut);
    return () => window.removeEventListener('keydown', handleWindowShortcut);
  }, [closeWindow, focusedWindowId, keyboardShortcutsEnabled, onMinimize, pendingCloseWindowId, windows]);

  const moveWithinStage = (id: string, next: Pick<WindowRect, 'x' | 'y'>) => {
    const instance = windows.find((window) => window.id === id);
    if (!instance) return;
    const rect = clampWindowRect97({ ...instance, ...next });
    onMove(id, { x: rect.x, y: rect.y });
  };
  const resizeWithinStage = (id: string, next: WindowRect) => {
    onResize(id, clampWindowRect97(next));
  };
  const pendingCloseWindow = windows.find(instance => instance.id === pendingCloseWindowId);
  return <div ref={managerRef} className="window-manager97" aria-label="Open windows">
    {windows.map((instance) => <Window97 key={instance.id} instance={instance} isFocused={instance.id === focusedWindowId} onClose={closeWindow} onRequestDiscardConfirmation={setPendingCloseWindowId} onMinimize={onMinimize} onMaximize={onMaximize} onFocus={onFocus} onMove={moveWithinStage} onResize={resizeWithinStage} keyboardShortcutsEnabled={keyboardShortcutsEnabled}>{renderContent(instance)}</Window97>)}
    {pendingCloseWindow && <UnsavedChangesDialog97
      title={pendingCloseWindow.title}
      onDiscard={() => { setPendingCloseWindowId(null); closeWindow(pendingCloseWindow.id); }}
      onCancel={() => setPendingCloseWindowId(null)}
    />}
  </div>;
}
