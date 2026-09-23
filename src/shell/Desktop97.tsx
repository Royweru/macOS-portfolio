'use client';

import { useEffect, useRef, useState } from 'react';
import type { WindowId } from '../types';
import type { OpenTarget } from '../features/os/os-types';
import { useOsStore } from '../features/os/os-store';
import { createFolderNode, createTextFileNode } from '../features/filesystem/filesystem-service';
import { VIRTUAL_NODE_IDS } from '../features/filesystem/virtual-paths';
import DesktopIconArt97 from './DesktopIconArt97';
import { DESKTOP97_ICON_ROW_PITCH, DESKTOP97_ICON_TOP, DESKTOP97_LEGACY_ICON_ROW_PITCH, getDesktopPropertiesTarget97, getDesktopShortcutPosition97 } from './desktop-layout97';
import { getStageScale97 } from '../wm/geometry97';

const STITCH_SHORTCUT_ORDER = [
  'shortcut-my-computer',
  'shortcut-my-documents',
  'shortcut-projects',
  'shortcut-videos',
  'shortcut-music',
  'shortcut-my-pictures',
  'shortcut-internet',
  'shortcut-games',
  'shortcut-recycle-bin',
  'shortcut-outlook-express',
] as const;
interface Desktop97Props {
  onOpenWindow: (id: WindowId) => void;
  onOpenTarget: (target: OpenTarget) => void;
}

export default function Desktop97({ onOpenWindow, onOpenTarget }: Desktop97Props) {
  const shortcuts = useOsStore((state) => state.shortcuts);
  const setShortcutPosition = useOsStore((state) => state.setShortcutPosition);
  const desktopRef = useRef<HTMLElement | null>(null);
  const [desktopHeight, setDesktopHeight] = useState(0);
  const [selected, setSelected] = useState<string | null>('shortcut-my-documents');
  const [menu, setMenu] = useState<{ x: number; y: number; shortcutId?: string } | null>(null);

  useEffect(() => {
    const desktop = desktopRef.current;
    if (!desktop) return;
    const measure = () => setDesktopHeight(desktop.clientHeight);
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(desktop);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const shortcutsById = new Map(shortcuts.map((shortcut) => [shortcut.id, shortcut]));
  const builtInShortcuts = STITCH_SHORTCUT_ORDER.map((id) => shortcutsById.get(id)).filter(
    (shortcut): shortcut is NonNullable<typeof shortcut> => Boolean(shortcut?.isVisible),
  );
  const builtInIds = new Set<string>(STITCH_SHORTCUT_ORDER);
  const customShortcuts = shortcuts.filter((shortcut) => !builtInIds.has(shortcut.id) && shortcut.isVisible);
  const orderedShortcuts = [...builtInShortcuts, ...customShortcuts];

  const openShortcut = (shortcutId: string) => {
    const shortcut = shortcuts.find((item) => item.id === shortcutId);
    if (!shortcut) return;
    if (shortcut.id === 'shortcut-projects') {
      onOpenTarget({ kind: 'application', appId: 'system-warning' });
      return;
    }
    if (shortcut.appId === 'recycle-bin') onOpenTarget({ kind: 'recycle-bin' });
    else if (shortcut.nodeId) onOpenTarget({ kind: 'file', nodeId: shortcut.nodeId });
    else if (shortcut.appId) onOpenTarget({ kind: 'application', appId: shortcut.appId });
  };

  return (
    <main ref={desktopRef} className="desktop97" onClick={() => { setSelected(null); setMenu(null); }} onContextMenu={(event) => { event.preventDefault(); setMenu({ x: event.clientX, y: event.clientY }); }}>
      <div className="desktop97-icons">
        {orderedShortcuts.map((item) => {
          const stitchIndex = STITCH_SHORTCUT_ORDER.indexOf(item.id as typeof STITCH_SHORTCUT_ORDER[number]);
          const usesStitchLayout = stitchIndex >= 0 && item.x === 12 && (
            item.y === DESKTOP97_ICON_TOP + stitchIndex * DESKTOP97_ICON_ROW_PITCH
            || item.y === DESKTOP97_ICON_TOP + stitchIndex * DESKTOP97_LEGACY_ICON_ROW_PITCH
          );
          const responsivePosition = usesStitchLayout ? getDesktopShortcutPosition97(stitchIndex, desktopHeight) : null;
          const left = responsivePosition?.left ?? item.x;
          const top = responsivePosition?.top ?? item.y;
          return (
          <button
            type="button"
            key={item.id}
            className={`desktop97-icon ${selected === item.id ? 'selected' : ''}`}
            style={{ left, top }}
            onClick={(event) => { event.stopPropagation(); setSelected(item.id); }}
            onDoubleClick={(event) => { event.stopPropagation(); openShortcut(item.id); }}
            onContextMenu={(event) => { event.preventDefault(); event.stopPropagation(); setSelected(item.id); setMenu({ x: event.clientX, y: event.clientY, shortcutId: item.id }); }}
            draggable
            onDragEnd={(event) => {
              const native = event.nativeEvent as DragEvent;
              const stage = event.currentTarget.closest<HTMLElement>('.shell97-stage');
              const scale = getStageScale97(stage);
              const bounds = stage?.getBoundingClientRect();
              if (native.clientX && native.clientY && bounds) setShortcutPosition(item.id, Math.max(0, (native.clientX - bounds.left) / scale - 36), Math.max(0, (native.clientY - bounds.top) / scale - 28));
            }}
          >
            <span className="desktop97-icon-image"><DesktopIconArt97 iconId={item.id} /></span>
            <span>{item.label}</span>
          </button>
          );
        })}
      </div>
      {menu && <div className="desktop97-context raised" style={{ left: Math.min(menu.x, window.innerWidth - 210), top: Math.max(4, Math.min(menu.y, window.innerHeight - (menu.shortcutId ? 150 : 350))) }} onClick={(event) => event.stopPropagation()}>
        {menu.shortcutId ? <>
          <button type="button" onClick={() => { openShortcut(menu.shortcutId!); setMenu(null); }}>Open</button>
          <button type="button" onClick={() => setMenu(null)}>Rename</button>
          <button type="button" disabled={!getDesktopPropertiesTarget97(menu.shortcutId)} onClick={() => { const target = getDesktopPropertiesTarget97(menu.shortcutId); if (target) onOpenTarget(target); setMenu(null); }}>Properties</button>
        </> : <>
          <button type="button" onClick={() => setMenu(null)}>Arrange Icons <span className="desktop97-context-arrow">►</span></button>
          <button type="button" onClick={() => setMenu(null)}>Line up Icons</button>
          <hr />
          <button type="button" onClick={() => setMenu(null)}>Refresh</button>
          <button type="button" disabled onClick={() => undefined}>Paste</button>
          <button type="button" disabled onClick={() => undefined}>Paste Shortcut</button>
          <hr />
          <button type="button" onClick={() => { void createFolderNode(VIRTUAL_NODE_IDS.myDocuments, 'New Folder'); setMenu(null); }}>New Folder <span className="desktop97-context-arrow">►</span></button>
          <button type="button" onClick={() => { void createTextFileNode(VIRTUAL_NODE_IDS.myDocuments, 'New Text Document.txt'); setMenu(null); }}>New Text Document</button>
          <button type="button" onClick={() => { onOpenWindow('msdos' as WindowId); setMenu(null); }}>MS-DOS Prompt Here</button>
          <button type="button" onClick={() => { const target = getDesktopPropertiesTarget97(); if (target) onOpenTarget(target); setMenu(null); }}>Properties</button>
        </>}
      </div>}
    </main>
  );
}
