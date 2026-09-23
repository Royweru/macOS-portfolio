'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { DesktopShortcut, OpenTarget, OsCommand, OsPhase, OsSettings, WindowInstance, WindowMode, WindowRect } from './os-types';
import { getBrowserProfileId } from './profile-storage';
import { clampWindowRect97, getDesktopBounds97, WIN97_DESKTOP_WIDTH, WIN97_WORK_AREA_HEIGHT } from '../../wm/geometry97';
import { VIRTUAL_NODE_IDS } from '../filesystem/virtual-paths';

const defaultSettings: OsSettings = {
  themeId: 'classic',
  wallpaperId: 'bliss',
  reducedMotion: false,
  startupSequenceEnabled: true,
  soundEnabled: true,
  screensaverEnabled: true,
  screensaverTimeout: 300,
};

const defaultShortcuts: DesktopShortcut[] = [
  { id: 'shortcut-my-computer', label: 'My Computer', icon: 'computer', targetPath: 'C:\\', appId: 'explorer', x: 12, y: 12, isVisible: true },
  { id: 'shortcut-my-documents', label: 'My Documents', icon: 'folder', targetPath: 'C:\\My Documents', nodeId: 'folder-my-documents', x: 12, y: 100, isVisible: true },
  { id: 'shortcut-projects', label: 'Projects', icon: 'folder', targetPath: 'C:\\Projects', nodeId: 'folder-projects', x: 12, y: 188, isVisible: true },
  { id: 'shortcut-videos', label: 'Videos', icon: 'video', targetPath: 'C:\\Videos', nodeId: 'folder-videos', x: 12, y: 276, isVisible: true },
  { id: 'shortcut-music', label: 'My Music', icon: 'music', targetPath: 'C:\\Music', nodeId: 'folder-music', x: 12, y: 364, isVisible: true },
  { id: 'shortcut-my-pictures', label: 'My Pictures', icon: 'paint', targetPath: 'C:\\Pictures', nodeId: 'folder-pictures', x: 12, y: 452, isVisible: true },
  { id: 'shortcut-internet', label: 'Internet', icon: 'ie4', appId: 'ie4', x: 12, y: 540, isVisible: true },
  { id: 'shortcut-games', label: 'Games', icon: 'minesweeper', appId: 'minesweeper', x: 12, y: 628, isVisible: true },
  { id: 'shortcut-recycle-bin', label: 'Recycle Bin', icon: 'recycle', appId: 'recycle-bin', x: 12, y: 716, isVisible: true },
  // Keep the persisted default on the same canonical first-column flow as the
  // other shell icons. Desktop97 reflows built-ins from this marker per viewport.
  { id: 'shortcut-outlook-express', label: 'Outlook Express', icon: 'mail', appId: 'mail', x: 12, y: 804, isVisible: true },
  { id: 'shortcut-msdos', label: 'MS-DOS Prompt', icon: 'msdos', appId: 'msdos', x: 150, y: 184, isVisible: false },
];

export interface OpenWindowOptions {
  id?: string;
  projectId?: number;
  allowMultiple?: boolean;
  title: string;
  icon?: string;
  rect?: WindowRect;
  canClose?: boolean;
  canMinimize?: boolean;
  canMaximize?: boolean;
  fileId?: string;
  locationId?: string;
  target?: OpenTarget;
  readOnly?: boolean;
  documentTitle?: string;
}

interface OsStore {
  phase: OsPhase;
  isHydrated: boolean;
  windows: Record<string, WindowInstance>;
  zOrder: string[];
  focusedWindowId: string | null;
  nextZIndex: number;
  shortcuts: DesktopShortcut[];
  settings: OsSettings;
  startMenuOpen: boolean;
  searchOpen: boolean;

  setPhase: (phase: OsPhase) => void;
  setHydrated: (value: boolean) => void;
  openWindow: (appId: string, options: OpenWindowOptions) => string;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  toggleMaximize: (windowId: string) => void;
  setWindowMode: (windowId: string, mode: WindowMode) => void;
  moveWindow: (windowId: string, rect: Pick<WindowRect, 'x' | 'y'>) => void;
  resizeWindow: (windowId: string, rect: Pick<WindowRect, 'width' | 'height'>) => void;
  updateWindowRect: (windowId: string, rect: WindowRect) => void;
  setShortcutPosition: (shortcutId: string, x: number, y: number) => void;
  setSettings: (settings: Partial<OsSettings>) => void;
  setStartMenuOpen: (open: boolean) => void;
  toggleStartMenu: () => void;
  setSearchOpen: (open: boolean) => void;
  dispatchCommand: (command: OsCommand) => void;
}

const defaultRect: WindowRect = { x: 80, y: 48, width: 640, height: 440 };

const createWindowId = (appId: string) => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `${appId}-${crypto.randomUUID()}`;
  return `${appId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

/**
 * Repair persisted state without deleting the virtual filesystem or other
 * profile data. This is kept pure so the migration invariant can be tested
 * independently of browser storage.
 */
export function migrateOsState(persistedState: unknown, version: number, bounds = getDesktopBounds97()) {
  const state = (persistedState ?? {}) as Partial<OsStore>;
  const migrateRect = (rect: WindowRect) => {
    const sourceLayoutWidth = Math.min(WIN97_DESKTOP_WIDTH, bounds.width);
    const sourceLayoutHeight = Math.min(WIN97_WORK_AREA_HEIGHT, bounds.workAreaHeight);
    const xOffset = version < 12
      ? Math.floor((sourceLayoutWidth - rect.width) / 2) - Math.floor((WIN97_DESKTOP_WIDTH - rect.width) / 2)
      : 0;
    const yOffset = version < 12
      ? Math.floor((sourceLayoutHeight - rect.height) / 3) - Math.floor((WIN97_WORK_AREA_HEIGHT - rect.height) / 3)
      : 0;
    return clampWindowRect97({ ...rect, x: rect.x + xOffset, y: rect.y + yOffset }, undefined, undefined, bounds);
  };
  const windows = Object.fromEntries(Object.entries(state.windows ?? {}).map(([id, window]) => [id, {
    ...window,
    ...migrateRect(window as WindowRect),
    ...(id === 'explorer' && window.appId === 'explorer' ? { locationId: VIRTUAL_NODE_IDS.root } : {}),
    ...(window.restoreRect ? { restoreRect: migrateRect(window.restoreRect) } : {}),
  }]));
  const savedShortcuts = state.shortcuts ?? [];
  const savedIds = new Set(savedShortcuts.map(shortcut => shortcut.id));
  const defaultById = new Map(defaultShortcuts.map(shortcut => [shortcut.id, shortcut]));
  const repositioned = version < 10 ? savedShortcuts.map(shortcut => {
    const migrated = defaultById.get(shortcut.id);
    const next = migrated ? { ...shortcut, x: migrated.x, y: migrated.y } : shortcut;
    return version < 10 && next.id === 'shortcut-msdos' ? { ...next, isVisible: false } : next;
  }) : version < 15 ? savedShortcuts.map(shortcut => {
    const migrated = defaultById.get(shortcut.id);
    if (!migrated) return shortcut;
    return { ...shortcut, x: migrated.x, y: migrated.y, label: migrated.label };
  }) : savedShortcuts;
  const migratedShortcuts = version < 16 ? repositioned.map(shortcut => {
    const canonical = defaultById.get(shortcut.id);
    if (!canonical || (shortcut.id !== 'shortcut-videos' && shortcut.id !== 'shortcut-my-pictures')) return shortcut;
    return { ...shortcut, label: canonical.label, icon: canonical.icon, targetPath: canonical.targetPath, nodeId: canonical.nodeId, appId: canonical.appId };
  }) : repositioned;
  const canonicalMediaShortcuts = version < 19 ? migratedShortcuts.map(shortcut => {
    const canonical = defaultById.get(shortcut.id);
    if (!canonical || (shortcut.id !== 'shortcut-music' && shortcut.id !== 'shortcut-my-pictures')) return shortcut;
    return { ...shortcut, label: canonical.label, icon: canonical.icon, targetPath: canonical.targetPath, nodeId: canonical.nodeId, appId: canonical.appId };
  }) : migratedShortcuts;
  // Version 19 introduced Outlook Express at (104, 12), which collides with
  // Games after the viewport-aware column flow wraps. Repair only that known
  // generated coordinate; retain any other user-positioned Outlook shortcut.
  const nonCollidingDesktopShortcuts = version < 20 ? canonicalMediaShortcuts.map(shortcut => (
    shortcut.id === 'shortcut-outlook-express' && shortcut.x === 104 && shortcut.y === 12
      ? { ...shortcut, x: 12, y: 804 }
      : shortcut
  )) : canonicalMediaShortcuts;
  const migratedIds = new Set(nonCollidingDesktopShortcuts.map(shortcut => shortcut.id));
  const shortcutById = new Map(nonCollidingDesktopShortcuts.map(shortcut => [shortcut.id, shortcut]));
  const shortcuts = [
    ...defaultShortcuts.map(shortcut => shortcutById.get(shortcut.id) ?? shortcut),
    ...nonCollidingDesktopShortcuts.filter(shortcut => !defaultById.has(shortcut.id)),
    ...defaultShortcuts.filter(shortcut => !migratedIds.has(shortcut.id) && !savedIds.has(shortcut.id)),
  ];
  return { ...state, windows, shortcuts } as OsStore;
}

const focusState = (state: OsStore, windowId: string) => {
  const window = state.windows[windowId];
  if (!window) return state;
  const zOrder = [...state.zOrder.filter((id) => id !== windowId), windowId];
  const nextZIndex = state.nextZIndex + 1;
  return {
    ...state,
    zOrder,
    focusedWindowId: windowId,
    nextZIndex,
    windows: { ...state.windows, [windowId]: { ...window, zIndex: nextZIndex, mode: window.mode === 'minimized' ? 'normal' : window.mode } },
  };
};

export const useOsStore = create<OsStore>()(
  persist(
    (set, get) => ({
      phase: 'bios',
      isHydrated: false,
      windows: {},
      zOrder: [],
      focusedWindowId: null,
      nextZIndex: 100,
      shortcuts: defaultShortcuts,
      settings: defaultSettings,
      startMenuOpen: false,
      searchOpen: false,

      setPhase: (phase) => set({ phase }),
      setHydrated: (isHydrated) => set({ isHydrated }),
      openWindow: (appId, options) => {
        const state = get();
        const keyedWindow = options.id ? state.windows[options.id] : undefined;
        const existing = keyedWindow?.appId === appId
          ? keyedWindow
          : options.id
            ? undefined
            : Object.values(state.windows).find((window) => window.appId === appId && (!options.allowMultiple || options.projectId === undefined || window.projectId === options.projectId));
        if (existing) {
          const shouldRefreshExplorerLocation = appId === 'explorer'
            && existing.id === 'explorer'
            && options.locationId !== undefined
            && existing.locationId !== options.locationId;
          const nextState = shouldRefreshExplorerLocation
            ? { ...state, windows: { ...state.windows, [existing.id]: { ...existing, locationId: options.locationId, title: options.title } } }
            : state;
          set(focusState(nextState, existing.id));
          return existing.id;
        }
        const id = options.id ?? createWindowId(appId);
        const rect = clampWindowRect97(options.rect ?? defaultRect);
        const zIndex = state.nextZIndex + 1;
        const window: WindowInstance = {
          ...rect,
          id,
          appId,
          mode: 'normal',
          zIndex,
          title: options.title,
          icon: options.icon,
          projectId: options.projectId,
          canClose: options.canClose ?? true,
          canMinimize: options.canMinimize ?? true,
          canMaximize: options.canMaximize ?? true,
          fileId: options.fileId,
          locationId: options.locationId,
          target: options.target,
          readOnly: options.readOnly,
          documentTitle: options.documentTitle,
        };
        set({ windows: { ...state.windows, [id]: window }, zOrder: [...state.zOrder, id], focusedWindowId: id, nextZIndex: zIndex, startMenuOpen: false });
        return id;
      },
      closeWindow: (windowId) => set((state) => {
        const windows = { ...state.windows };
        delete windows[windowId];
        const zOrder = state.zOrder.filter((id) => id !== windowId);
        return { windows, zOrder, focusedWindowId: state.focusedWindowId === windowId ? zOrder[zOrder.length - 1] ?? null : state.focusedWindowId };
      }),
      focusWindow: (windowId) => set((state) => {
        const focused = state.windows[windowId];
        if (!focused) return state;
        return focusState({ ...state, windows: { ...state.windows, [windowId]: { ...focused, ...clampWindowRect97(focused) } } }, windowId);
      }),
      minimizeWindow: (windowId) => set((state) => {
        const window = state.windows[windowId];
        if (!window) return state;
        const zOrder = state.zOrder.filter((id) => id !== windowId);
        return { windows: { ...state.windows, [windowId]: { ...window, mode: 'minimized' } }, zOrder, focusedWindowId: state.focusedWindowId === windowId ? zOrder[zOrder.length - 1] ?? null : state.focusedWindowId };
      }),
      restoreWindow: (windowId) => set((state) => {
        const window = state.windows[windowId];
        if (!window) return state;
        return focusState({ ...state, windows: { ...state.windows, [windowId]: { ...window, ...clampWindowRect97({ ...window, ...(window.restoreRect ?? {}) }), mode: 'normal', restoreRect: undefined } } }, windowId);
      }),
      toggleMaximize: (windowId) => set((state) => {
        const window = state.windows[windowId];
        if (!window) return state;
        if (window.mode === 'maximized') return focusState({ ...state, windows: { ...state.windows, [windowId]: { ...window, ...clampWindowRect97({ ...window, ...(window.restoreRect ?? {}) }), mode: 'normal', restoreRect: undefined } } }, windowId);
        return focusState({ ...state, windows: { ...state.windows, [windowId]: { ...window, restoreRect: { x: window.x, y: window.y, width: window.width, height: window.height }, mode: 'maximized' } } }, windowId);
      }),
      setWindowMode: (windowId, mode) => set((state) => state.windows[windowId] ? { windows: { ...state.windows, [windowId]: { ...state.windows[windowId], mode } } } : state),
      moveWindow: (windowId, rect) => set((state) => state.windows[windowId] ? { windows: { ...state.windows, [windowId]: { ...state.windows[windowId], ...clampWindowRect97({ ...state.windows[windowId], ...rect }), mode: 'normal' } } } : state),
      resizeWindow: (windowId, rect) => set((state) => state.windows[windowId] ? { windows: { ...state.windows, [windowId]: { ...state.windows[windowId], ...clampWindowRect97({ ...state.windows[windowId], ...rect }), mode: 'normal' } } } : state),
      updateWindowRect: (windowId, rect) => set((state) => state.windows[windowId] ? { windows: { ...state.windows, [windowId]: { ...state.windows[windowId], ...clampWindowRect97(rect) } } } : state),
      setShortcutPosition: (shortcutId, x, y) => set((state) => ({ shortcuts: state.shortcuts.map((shortcut) => shortcut.id === shortcutId ? { ...shortcut, x, y } : shortcut) })),
      setSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),
      setStartMenuOpen: (startMenuOpen) => set({ startMenuOpen }),
      toggleStartMenu: () => set((state) => ({ startMenuOpen: !state.startMenuOpen })),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      dispatchCommand: (command) => {
        const state = get();
        if (command.type === 'close-focused-window' && state.focusedWindowId) state.closeWindow(state.focusedWindowId);
        else if (command.type === 'minimize-focused-window' && state.focusedWindowId) state.minimizeWindow(state.focusedWindowId);
        else if (command.type === 'toggle-start-menu') state.toggleStartMenu();
        else if (command.type === 'toggle-search') state.setSearchOpen(!state.searchOpen);
        else if (command.type === 'set-theme' && command.themeId) state.setSettings({ themeId: command.themeId });
        else if (command.type === 'set-wallpaper' && command.wallpaperId) state.setSettings({ wallpaperId: command.wallpaperId });
      },
    }),
    {
      name: `weru97-state-${getBrowserProfileId()}`,
      version: 20,
      migrate: migrateOsState,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ windows: state.windows, zOrder: state.zOrder, nextZIndex: state.nextZIndex, shortcuts: state.shortcuts, settings: state.settings }),
      onRehydrateStorage: () => (state) => { state?.setHydrated(true); },
    },
  ),
);
