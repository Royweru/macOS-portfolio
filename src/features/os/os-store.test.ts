import { describe, expect, it } from 'vitest';
import { migrateOsState, useOsStore } from './os-store';

const ACTIVE_WINDOW_APP_IDS = [
  'about', 'projects', 'project-detail', 'media-player', 'experience', 'skills', 'contact',
  'explorer', 'recycle-bin', 'terminal', 'notepad', 'settings', 'photos', 'mail', 'ie4',
  'paint', 'cd-player', 'calculator', 'minesweeper', 'msdos', 'system-properties',
  'control-panel', 'run', 'find', 'shutdown',
] as const;

describe('Weru 97 persisted window repair', () => {
  it('clamps invalid saved rectangles and preserves profile data', () => {
    const migrated = migrateOsState({
      windows: {
        'explorer-test': { id: 'explorer-test', appId: 'explorer', x: -900, y: 999, width: 1800, height: 1200 },
      },
      shortcuts: [],
      settings: { themeId: 'classic' },
      marker: 'keep-me',
    }, 5) as unknown as { windows: Record<string, { x: number; y: number; width: number; height: number }>; marker: string };

    expect(migrated.windows['explorer-test']).toMatchObject({ x: 0, y: 0, width: 1024, height: 722 });
    expect(migrated.marker).toBe('keep-me');
  });

  it('rebases vertical placement to the current work area without shifting Stitch-anchored x positions', () => {
    const migrated = migrateOsState({
      windows: {
        explorer: {
          id: 'explorer', appId: 'explorer', x: 258, y: 130, width: 560, height: 410,
          restoreRect: { x: 232, y: 104, width: 560, height: 410 },
        },
      },
    }, 11, { width: 1422, workAreaHeight: 598 }) as unknown as {
      windows: Record<string, { x: number; y: number; restoreRect: { x: number; y: number } }>;
    };

    expect(migrated.windows.explorer).toMatchObject({ x: 258, y: 88 });
    expect(migrated.windows.explorer.restoreRect).toEqual({ x: 232, y: 62, width: 560, height: 410 });
  });

  it('repositions legacy default shortcuts once while retaining custom shortcuts', () => {
    const migrated = migrateOsState({
      shortcuts: [
        { id: 'shortcut-my-computer', label: 'My Computer', icon: 'computer', x: 900, y: 900, isVisible: true },
        { id: 'custom-shortcut', label: 'Custom', icon: 'file', x: 700, y: 500, isVisible: true },
      ],
    }, 4) as unknown as { shortcuts: Array<{ id: string; x: number; y: number }> };

    expect(migrated.shortcuts.find(shortcut => shortcut.id === 'shortcut-my-computer')).toMatchObject({ x: 12, y: 12 });
    expect(migrated.shortcuts.find(shortcut => shortcut.id === 'custom-shortcut')).toMatchObject({ x: 700, y: 500 });
    expect(migrated.shortcuts.some(shortcut => shortcut.id === 'shortcut-msdos')).toBe(true);
    expect(migrated.shortcuts.find(shortcut => shortcut.id === 'shortcut-my-pictures')).toMatchObject({ icon: 'paint', nodeId: 'folder-pictures', targetPath: 'C:\\My Pictures', x: 12, y: 452 });
  });

  it('migrates saved media desktop shortcuts to their standalone library folders', () => {
    const migrated = migrateOsState({
      shortcuts: [
        { id: 'shortcut-videos', label: 'Videos', icon: 'video', targetPath: 'C:\\My Documents\\Videos', nodeId: 'folder-videos', x: 12, y: 276, isVisible: true },
        { id: 'shortcut-my-pictures', label: 'My Pictures', icon: 'paint', appId: 'paint', x: 12, y: 452, isVisible: true },
      ],
    }, 15) as unknown as { shortcuts: Array<{ id: string; targetPath?: string; nodeId?: string; appId?: string }> };

    expect(migrated.shortcuts.find(shortcut => shortcut.id === 'shortcut-videos')).toMatchObject({ targetPath: 'C:\\Videos', nodeId: 'folder-videos' });
    expect(migrated.shortcuts.find(shortcut => shortcut.id === 'shortcut-my-pictures')).toMatchObject({ targetPath: 'C:\\My Pictures', nodeId: 'folder-pictures' });
    expect(migrated.shortcuts.find(shortcut => shortcut.id === 'shortcut-my-pictures')?.appId).toBeUndefined();
  });

  it('migrates built-in shortcuts to the Stitch desktop while preserving custom shortcuts and visibility', () => {
    const migrated = migrateOsState({
      shortcuts: [
        { id: 'shortcut-games', label: 'Games', icon: 'minesweeper', x: 150, y: 24, isVisible: false },
        { id: 'shortcut-recycle-bin', label: 'Recycle Bin', icon: 'recycle', x: 150, y: 104, isVisible: true },
        { id: 'shortcut-internet', label: 'Internet Explorer', icon: 'ie4', x: 24, y: 504, isVisible: true },
        { id: 'custom-games', label: 'Custom', icon: 'minesweeper', x: 700, y: 500, isVisible: true },
      ],
    }, 14) as unknown as { shortcuts: Array<{ id: string; label: string; x: number; y: number }> };

    expect(migrated.shortcuts.map(shortcut => shortcut.id).slice(0, 9)).toEqual([
      'shortcut-my-computer', 'shortcut-my-documents', 'shortcut-projects', 'shortcut-videos',
      'shortcut-music', 'shortcut-my-pictures', 'shortcut-internet', 'shortcut-games', 'shortcut-recycle-bin',
    ]);
    expect(migrated.shortcuts.find(shortcut => shortcut.id === 'shortcut-games')).toMatchObject({ x: 12, y: 628 });
    expect(migrated.shortcuts.find(shortcut => shortcut.id === 'shortcut-games')).toHaveProperty('isVisible', false);
    expect(migrated.shortcuts.find(shortcut => shortcut.id === 'shortcut-recycle-bin')).toMatchObject({ x: 12, y: 716 });
    expect(migrated.shortcuts.find(shortcut => shortcut.id === 'shortcut-internet')).toMatchObject({ label: 'Internet' });
    expect(migrated.shortcuts.find(shortcut => shortcut.id === 'custom-games')).toMatchObject({ x: 700, y: 500 });
  });

  it('keeps keyed multiple Explorer instances independent', () => {
    const firstId = 'test-explorer-one';
    const secondId = 'test-explorer-two';
    const store = useOsStore.getState();
    store.closeWindow(firstId);
    store.closeWindow(secondId);

    const first = store.openWindow('explorer', { id: firstId, allowMultiple: true, title: 'Documents', locationId: 'folder-my-documents' });
    const second = useOsStore.getState().openWindow('explorer', { id: secondId, allowMultiple: true, title: 'Projects', locationId: 'folder-projects' });
    const windows = useOsStore.getState().windows;

    expect(first).toBe(firstId);
    expect(second).toBe(secondId);
    expect(windows[firstId]).toMatchObject({ appId: 'explorer', title: 'Documents', locationId: 'folder-my-documents' });
    expect(windows[secondId]).toMatchObject({ appId: 'explorer', title: 'Projects', locationId: 'folder-projects' });

    useOsStore.getState().closeWindow(firstId);
    useOsStore.getState().closeWindow(secondId);
  });

  it('keeps the shared window lifecycle clamped through move, resize, and restore', () => {
    const id = 'test-window-lifecycle';
    useOsStore.getState().closeWindow(id);
    useOsStore.getState().openWindow('calculator', {
      id,
      title: 'Lifecycle test',
      rect: { x: 80, y: 60, width: 278, height: 265 },
    });

    useOsStore.getState().moveWindow(id, { x: 130, y: 110 });
    expect(useOsStore.getState().windows[id]).toMatchObject({ x: 130, y: 110 });

    useOsStore.getState().moveWindow(id, { x: 900, y: 900 });
    expect(useOsStore.getState().windows[id]).toMatchObject({ x: 746, y: 457, mode: 'normal' });

    useOsStore.getState().moveWindow(id, { x: 0, y: 0 });
    useOsStore.getState().resizeWindow(id, { width: 10, height: 10 });
    expect(useOsStore.getState().windows[id]).toMatchObject({ x: 0, y: 0, width: 240, height: 160, mode: 'normal' });

    useOsStore.getState().toggleMaximize(id);
    expect(useOsStore.getState().windows[id]).toMatchObject({ mode: 'maximized', restoreRect: { x: 0, y: 0, width: 240, height: 160 } });
    useOsStore.getState().toggleMaximize(id);
    expect(useOsStore.getState().windows[id]).toMatchObject({ mode: 'normal', x: 0, y: 0, width: 240, height: 160 });

    useOsStore.getState().minimizeWindow(id);
    expect(useOsStore.getState().windows[id]?.mode).toBe('minimized');
    useOsStore.getState().restoreWindow(id);
    expect(useOsStore.getState().windows[id]?.mode).toBe('normal');
    expect(useOsStore.getState().focusedWindowId).toBe(id);

    useOsStore.getState().closeWindow(id);
    expect(useOsStore.getState().windows[id]).toBeUndefined();
  });

  it.each(ACTIVE_WINDOW_APP_IDS)('applies the shared window-state lifecycle to the %s route', (appId) => {
    const id = `route-lifecycle-${appId}`;
    const initialRect = { x: 80, y: 60, width: 278, height: 265 };
    useOsStore.getState().closeWindow(id);

    useOsStore.getState().openWindow(appId, { id, title: `${appId} lifecycle`, rect: initialRect });
    expect(useOsStore.getState().windows[id]).toMatchObject({ appId, mode: 'normal', ...initialRect });

    useOsStore.getState().moveWindow(id, { x: 2000, y: 2000 });
    expect(useOsStore.getState().windows[id]).toMatchObject({ x: 746, y: 457 });

    useOsStore.getState().resizeWindow(id, { width: 1, height: 1 });
    expect(useOsStore.getState().windows[id]).toMatchObject({ x: 746, y: 457, width: 240, height: 160 });

    useOsStore.getState().toggleMaximize(id);
    expect(useOsStore.getState().windows[id]?.mode).toBe('maximized');
    useOsStore.getState().toggleMaximize(id);
    expect(useOsStore.getState().windows[id]).toMatchObject({ mode: 'normal', x: 746, y: 457, width: 240, height: 160 });

    useOsStore.getState().minimizeWindow(id);
    expect(useOsStore.getState().windows[id]?.mode).toBe('minimized');
    useOsStore.getState().restoreWindow(id);
    expect(useOsStore.getState().windows[id]?.mode).toBe('normal');
    expect(useOsStore.getState().focusedWindowId).toBe(id);

    useOsStore.getState().closeWindow(id);
    expect(useOsStore.getState().windows[id]).toBeUndefined();
    expect(useOsStore.getState().zOrder).not.toContain(id);
  });
});
