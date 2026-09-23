import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WindowId } from '../types';
import type { OpenTarget } from '../features/os/os-types';
import { useOsStore } from '../features/os/os-store';
import AppIcon from './AppIcon';
import { createFolderNode, createTextFileNode } from '../features/filesystem/filesystem-service';
import { VIRTUAL_NODE_IDS } from '../features/filesystem/virtual-paths';

interface DesktopProps {
  onOpenWindow: (id: WindowId) => void;
  onOpenTarget: (target: OpenTarget) => void;
}

type ContextMenu = { x: number; y: number } | null;

const Desktop: React.FC<DesktopProps> = ({ onOpenWindow, onOpenTarget }) => {
  const shortcuts = useOsStore(state => state.shortcuts);
  const setShortcutPosition = useOsStore(state => state.setShortcutPosition);
  const [selected, setSelected] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu>(null);
  const [contextTarget, setContextTarget] = useState<string | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent, id?: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
    setContextTarget(id ?? null);
  }, []);

  const closeContext = useCallback(() => setContextMenu(null), []);

  const desktopContextItems = [
    'New folder',
    'New text document',
    'Refresh',
    '—',
    'Sort by name',
    'Sort by type',
    'Sort by date modified',
    '—',
    'Open Terminal here',
    'Personalize',
    'Display settings',
  ];

  const iconContextItems = contextTarget
    ? [`Open "${shortcuts.find(d=>d.id===contextTarget)?.label}"`, 'Open in Terminal', 'Show in folder', 'Rename', 'Delete', 'Properties']
    : [];

  const handleContextAction = useCallback(async (item: string) => {
    if (item === 'New folder') {
      await createFolderNode(VIRTUAL_NODE_IDS.desktop, 'New folder');
    } else if (item === 'New text document') {
      await createTextFileNode(VIRTUAL_NODE_IDS.desktop, 'New text document.txt');
    } else if (item === 'Open Terminal here') {
      onOpenWindow('terminal');
    } else if (item.startsWith('Open "') && contextTarget) {
      const shortcut = shortcuts.find(item => item.id === contextTarget);
      if (shortcut?.nodeId) onOpenTarget({ kind: 'file', nodeId: shortcut.nodeId });
      else if (shortcut?.appId === 'recycle-bin') onOpenTarget({ kind: 'recycle-bin' });
      else if (shortcut?.appId) onOpenTarget({ kind: 'application', appId: shortcut.appId });
    } else if (item === 'Open in Terminal') {
      onOpenWindow('terminal');
    } else if (item === 'Personalize') {
      onOpenWindow('settings');
    }
    closeContext();
  }, [closeContext, contextTarget, onOpenTarget, onOpenWindow, shortcuts]);

  return (
    <div
      ref={desktopRef}
      className="absolute inset-0 pt-7"
      onClick={() => { setSelected(null); closeContext(); }}
      onContextMenu={(e) => handleContextMenu(e)}
    >
      {/* Draggable Desktop Icons */}
      {shortcuts.filter(item => item.isVisible).map((item, i) => {
        const iconAppId: WindowId = item.appId === 'recycle-bin'
          ? 'recycle-bin'
          : item.id === 'shortcut-projects' || item.id === 'shortcut-this-pc'
            ? 'explorer'
            : item.appId === 'mail' ? 'mail' : 'notepad';
        const openTarget = item.nodeId
          ? { kind: 'file', nodeId: item.nodeId } as OpenTarget
          : item.appId === 'recycle-bin'
            ? { kind: 'recycle-bin' } as OpenTarget
            : { kind: 'application', appId: item.appId ?? 'explorer' } as OpenTarget;
        return (
        <motion.div
          key={item.id}
          drag
          dragMomentum={false}
          dragConstraints={desktopRef}
          className={`desktop-icon absolute ${selected === item.id ? 'ring-2 ring-blue-400/50 bg-white/20' : ''}`}
          style={{
            left: item.x,
            top: item.y,
            zIndex: selected === item.id ? 50 : 1,
          }}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 * i + 0.2, type: 'spring', stiffness: 300, damping: 24 }}
          onPointerDown={(e) => {
            e.stopPropagation();
            setSelected(item.id);
            closeContext();
          }}
          onDragEnd={(event, info) => {
            const bounds = desktopRef.current?.getBoundingClientRect();
            if (bounds) setShortcutPosition(item.id, Math.max(16, item.x + info.offset.x), Math.max(28, item.y + info.offset.y));
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onOpenTarget(openTarget);
          }}
          onContextMenu={(e) => {
            e.stopPropagation();
            handleContextMenu(e, item.id);
          }}
          role="button"
          aria-label={`Open ${item.label}`}
        >
          <span className="desktop-app-icon"><AppIcon appId={iconAppId} size={34} /></span>
          <span>{item.label}</span>
        </motion.div>
        );
      })}

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div className="fixed inset-0 z-[150]" onClick={closeContext} onContextMenu={(e) => { e.preventDefault(); closeContext(); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.1 }}
              className="fixed z-[160] py-1 overflow-hidden shadow-lg"
              style={{
                top: Math.min(contextMenu.y, window.innerHeight - 280),
                left: Math.min(contextMenu.x, window.innerWidth - 220),
                minWidth: 210,
                background: '#ffffff',
                border: '1px solid #b8b8b8',
                borderRadius: 4,
              }}
            >
              {(contextTarget ? iconContextItems : desktopContextItems).map((item, i) =>
                item === '—' ? (
                  <div key={i} className="my-1 mx-2 h-px bg-black/10" />
                ) : (
                  <div
                    key={i}
                    className="mx-1 px-3 py-1 text-[13px] text-[#1f1f1f] hover:bg-[#e5f1fb] hover:text-[#005a9e] cursor-default transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleContextAction(item);
                    }}
                  >
                    {item}
                  </div>
                )
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Desktop;
