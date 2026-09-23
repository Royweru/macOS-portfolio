import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WINDOW_CONFIGS } from '../constants';
import type { WindowId, ViewMode, TagFilter } from '../types';
import type { WindowInstance, WindowRect } from '../features/os/os-types';
import { useOsStore } from '../features/os/os-store';
import { getResponsiveWindowSize, getWindowCenterPosition } from '../utils/layout';
import { getCenteredWindowPosition97 } from '../wm/geometry97';

export interface WindowManagerActions {
  openWindow: (id: WindowId, options?: { instanceId?: string; projectId?: number; allowMultiple?: boolean; title?: string; fileId?: string; locationId?: string; readOnly?: boolean; rect?: WindowRect }) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  setSection: (id: WindowId, section: TagFilter) => void;
  setView: (id: WindowId, view: ViewMode) => void;
  isOpen: (id: WindowId) => boolean;
  isFocused: (id: string) => boolean;
  isMinimized: (id: WindowId) => boolean;
  isMaximized: (id: WindowId) => boolean;
  getRect: (id: string) => WindowRect | undefined;
  updateRect: (id: string, rect: WindowRect) => void;
  snapWindow: (id: string, rect: WindowRect, slot: string) => void;
  openWindows: WindowId[];
  minimized: WindowId[];
  maximized: WindowId[];
  focused: WindowId | null;
  stack: WindowId[];
  sections: Partial<Record<WindowId, TagFilter>>;
  views: Partial<Record<WindowId, ViewMode>>;
  activeWindows: WindowInstance[];
  focusedWindowId: string | null;
}

export function useWindowManager(initial: WindowId[] = []): WindowManagerActions {
  const windows = useOsStore((state) => state.windows);
  const zOrder = useOsStore((state) => state.zOrder);
  const focusedWindowId = useOsStore((state) => state.focusedWindowId);
  const open = useOsStore((state) => state.openWindow);
  const close = useOsStore((state) => state.closeWindow);
  const focus = useOsStore((state) => state.focusWindow);
  const minimize = useOsStore((state) => state.minimizeWindow);
  const restore = useOsStore((state) => state.restoreWindow);
  const maximize = useOsStore((state) => state.toggleMaximize);
  const updateWindowRect = useOsStore((state) => state.updateWindowRect);
  const initialKey = initial.join('|');
  const seededRef = useRef<string | null>(null);
  const [sections, setSections] = useState<Partial<Record<WindowId, TagFilter>>>({});
  const [views, setViews] = useState<Partial<Record<WindowId, ViewMode>>>({});

  useEffect(() => {
    if (seededRef.current === initialKey) return;
    seededRef.current = initialKey;
    const currentWindows = useOsStore.getState().windows;
    initial.forEach((id) => {
      if (Object.values(currentWindows).some((window) => window.appId === id)) return;
      const cfg = WINDOW_CONFIGS[id];
      if (!cfg) return;
      const { width, height } = getResponsiveWindowSize(cfg.w, cfg.h);
      const { x, y } = getWindowCenterPosition(width, height, cfg.ox, cfg.oy);
      open(id, { id, title: cfg.title, icon: cfg.icon, rect: { x, y, width, height } });
    });
  }, [initial, initialKey, open]);

  const activeWindows = useMemo(() => Object.values(windows), [windows]);
  const orderedIds = useMemo(() => zOrder.map((id) => windows[id]).filter(Boolean), [windows, zOrder]);
  const openWindows = useMemo(() => orderedIds.map((window) => window.appId as WindowId), [orderedIds]);
  const minimized = useMemo(() => activeWindows.filter((window) => window.mode === 'minimized').map((window) => window.appId as WindowId), [activeWindows]);
  const maximized = useMemo(() => activeWindows.filter((window) => window.mode === 'maximized').map((window) => window.appId as WindowId), [activeWindows]);
  const stack = useMemo(() => orderedIds.map((window) => window.appId as WindowId), [orderedIds]);

  const openWindow = useCallback((id: WindowId, options?: { instanceId?: string; projectId?: number; allowMultiple?: boolean; title?: string; fileId?: string; locationId?: string; readOnly?: boolean; rect?: WindowRect }) => {
    const cfg = WINDOW_CONFIGS[id];
    if (!cfg) return;
    const { width, height } = getResponsiveWindowSize(cfg.w, cfg.h);
    const existingInstances = Object.values(useOsStore.getState().windows).filter((window) => window.appId === id);
    const cascade = options?.allowMultiple && existingInstances.length > 0
      ? Math.min(existingInstances.length * 44, 176)
      : 0;
    const rect = options?.rect ?? (() => {
      const { x, y } = cfg.centered
        ? getCenteredWindowPosition97(width, height, cfg.verticalBias ?? 0)
        : getWindowCenterPosition(width, height, (cfg.ox ?? 0) + cascade, (cfg.oy ?? 0) + cascade);
      return { x, y, width, height };
    })();
    open(id, { id: options?.instanceId ?? id, projectId: options?.projectId, allowMultiple: options?.allowMultiple, title: options?.title ?? cfg.title, icon: cfg.icon, rect, fileId: options?.fileId, locationId: options?.locationId, readOnly: options?.readOnly });
  }, [open]);

  const getRect = useCallback((id: string) => {
    const window = windows[id];
    return window ? { x: window.x, y: window.y, width: window.width, height: window.height } : undefined;
  }, [windows]);

  return {
    openWindows,
    minimized,
    maximized,
    focused: focusedWindowId as WindowId | null,
    stack,
    sections,
    views,
    activeWindows,
    focusedWindowId,
    openWindow,
    closeWindow: close,
    minimizeWindow: minimize,
    focusWindow: (id) => { if (windows[id]?.mode === 'minimized') restore(id); focus(id); },
    toggleMaximize: maximize,
    setSection: (id, section) => setSections((prev) => ({ ...prev, [id]: section })),
    setView: (id, view) => setViews((prev) => ({ ...prev, [id]: view })),
    isOpen: (id) => Boolean(windows[id] && windows[id].mode !== 'minimized'),
    isFocused: (id) => focusedWindowId === id,
    isMinimized: (id) => Boolean(windows[id]?.mode === 'minimized'),
    isMaximized: (id) => Boolean(windows[id]?.mode === 'maximized'),
    getRect,
    updateRect: updateWindowRect,
    snapWindow: (id, rect) => updateWindowRect(id, rect),
  };
}
