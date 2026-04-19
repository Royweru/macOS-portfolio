// ─── hooks/useWindowManager.ts ────────────────────────────────────────────────
import { useState, useCallback } from 'react';
import type { WindowId, ViewMode, TagFilter } from '../types';

export interface WindowManagerActions {
  openWindow:     (id: WindowId) => void;
  closeWindow:    (id: string)   => void;
  minimizeWindow: (id: string)   => void;
  focusWindow:    (id: string)   => void;
  setSection:     (id: WindowId, section: TagFilter) => void;
  setView:        (id: WindowId, view: ViewMode)     => void;
  isOpen:         (id: WindowId) => boolean;
  isFocused:      (id: WindowId) => boolean;
  isMinimized:    (id: WindowId) => boolean;
  openWindows:    WindowId[];
  minimized:      WindowId[];
  focused:        WindowId | null;
  sections:       Partial<Record<WindowId, TagFilter>>;
  views:          Partial<Record<WindowId, ViewMode>>;
}

export function useWindowManager(initial: WindowId[] = []): WindowManagerActions {
  const [openWindows,  setOpenWindows]  = useState<WindowId[]>(initial);
  const [minimized,    setMinimized]    = useState<WindowId[]>([]);
  const [focused,      setFocused]      = useState<WindowId | null>(initial[0] ?? null);
  const [sections,     setSections]     = useState<Partial<Record<WindowId, TagFilter>>>({});
  const [views,        setViews]        = useState<Partial<Record<WindowId, ViewMode>>>({});

  const openWindow = useCallback((id: WindowId) => {
    setMinimized(m => m.filter(x => x !== id));
    setOpenWindows(w => w.includes(id) ? w : [...w, id]);
    setFocused(id);
  }, []);

  const closeWindow = useCallback((id: string) => {
    const wid = id as WindowId;
    setOpenWindows(w => w.filter(x => x !== wid));
    setMinimized(m => m.filter(x => x !== wid));
    setFocused(prev => prev === wid ? null : prev);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    const wid = id as WindowId;
    setMinimized(m => m.includes(wid) ? m : [...m, wid]);
    setFocused(prev => prev === wid ? null : prev);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setFocused(id as WindowId);
  }, []);

  const setSection = useCallback((id: WindowId, section: TagFilter) => {
    setSections(prev => ({ ...prev, [id]: section }));
  }, []);

  const setView = useCallback((id: WindowId, view: ViewMode) => {
    setViews(prev => ({ ...prev, [id]: view }));
  }, []);

  const isOpen      = useCallback((id: WindowId) => openWindows.includes(id) && !minimized.includes(id), [openWindows, minimized]);
  const isFocused   = useCallback((id: WindowId) => focused === id, [focused]);
  const isMinimized = useCallback((id: WindowId) => minimized.includes(id), [minimized]);

  return {
    openWindows, minimized, focused, sections, views,
    openWindow, closeWindow, minimizeWindow, focusWindow,
    setSection, setView, isOpen, isFocused, isMinimized,
  };
}
