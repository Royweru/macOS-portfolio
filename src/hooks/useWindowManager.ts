// ─── hooks/useWindowManager.ts ────────────────────────────────────────────────
import { useState, useCallback } from 'react';
import type { WindowId, ViewMode, TagFilter } from '../types';

export interface WindowManagerActions {
  openWindow:     (id: WindowId) => void;
  closeWindow:    (id: string)   => void;
  minimizeWindow: (id: string)   => void;
  focusWindow:    (id: string)   => void;
  toggleMaximize: (id: WindowId) => void;
  setSection:     (id: WindowId, section: TagFilter) => void;
  setView:        (id: WindowId, view: ViewMode)     => void;
  
  isOpen:         (id: WindowId) => boolean;
  isFocused:      (id: WindowId) => boolean;
  isMinimized:    (id: WindowId) => boolean;
  isMaximized:    (id: WindowId) => boolean;
  getZIndex:      (id: WindowId) => number;

  openWindows:    WindowId[];
  minimized:      WindowId[];
  maximized:      WindowId[];
  focused:        WindowId | null;
  stack:          WindowId[]; // The order of windows from back to front
  sections:       Partial<Record<WindowId, TagFilter>>;
  views:          Partial<Record<WindowId, ViewMode>>;
}

export function useWindowManager(initial: WindowId[] = []): WindowManagerActions {
  const [openWindows,  setOpenWindows]  = useState<WindowId[]>(initial);
  const [minimized,    setMinimized]    = useState<WindowId[]>([]);
  const [maximized,    setMaximized]    = useState<WindowId[]>([]);
  const [focused,      setFocused]      = useState<WindowId | null>(initial[0] ?? null);
  const [stack,        setStack]        = useState<WindowId[]>(initial);
  const [sections,     setSections]     = useState<Partial<Record<WindowId, TagFilter>>>({});
  const [views,        setViews]        = useState<Partial<Record<WindowId, ViewMode>>>({});

  const bringToFront = useCallback((id: WindowId) => {
    setStack(prev => {
      const next = prev.filter(x => x !== id);
      return [...next, id];
    });
    setFocused(id);
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    setMinimized(m => m.filter(x => x !== id));
    setOpenWindows(w => w.includes(id) ? w : [...w, id]);
    bringToFront(id);
  }, [bringToFront]);

  const closeWindow = useCallback((id: string) => {
    const wid = id as WindowId;
    setOpenWindows(w => w.filter(x => x !== wid));
    setMinimized(m => m.filter(x => x !== wid));
    setMaximized(m => m.filter(x => x !== wid));
    setStack(s => s.filter(x => x !== wid));
    setFocused(prev => {
      if (prev !== wid) return prev;
      // Focus the next window in the stack that isn't minimized
      const remaining = stack.filter(x => x !== wid && !minimized.includes(x));
      return remaining.length > 0 ? remaining[remaining.length - 1] : null;
    });
  }, [minimized, stack]);

  const minimizeWindow = useCallback((id: string) => {
    const wid = id as WindowId;
    setMinimized(m => m.includes(wid) ? m : [...m, wid]);
    setFocused(prev => {
      if (prev !== wid) return prev;
      const remaining = stack.filter(x => x !== wid && !minimized.includes(wid));
      return remaining.length > 0 ? remaining[remaining.length - 1] : null;
    });
  }, [minimized, stack]);

  const toggleMaximize = useCallback((id: WindowId) => {
    setMaximized(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    bringToFront(id);
  }, [bringToFront]);

  const focusWindow = useCallback((id: string) => {
    bringToFront(id as WindowId);
  }, [bringToFront]);

  const setSection = useCallback((id: WindowId, section: TagFilter) => {
    setSections(prev => ({ ...prev, [id]: section }));
  }, []);

  const setView = useCallback((id: WindowId, view: ViewMode) => {
    setViews(prev => ({ ...prev, [id]: view }));
  }, []);

  const isOpen      = useCallback((id: WindowId) => openWindows.includes(id) && !minimized.includes(id), [openWindows, minimized]);
  const isFocused   = useCallback((id: WindowId) => focused === id, [focused]);
  const isMinimized = useCallback((id: WindowId) => minimized.includes(id), [minimized]);
  const isMaximized = useCallback((id: WindowId) => maximized.includes(id), [maximized]);
  
  const getZIndex = useCallback((id: WindowId) => {
    const index = stack.indexOf(id);
    return index === -1 ? 10 : 100 + index;
  }, [stack]);

  return {
    openWindows, minimized, maximized, focused, stack, sections, views,
    openWindow, closeWindow, minimizeWindow, focusWindow, toggleMaximize,
    setSection, setView, isOpen, isFocused, isMinimized, isMaximized, getZIndex,
  };
}
