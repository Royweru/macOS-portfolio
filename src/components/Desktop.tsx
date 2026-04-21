import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WindowId } from '../types';

interface DesktopProps {
  onOpenWindow: (id: WindowId) => void;
}

const FolderIcon = ({ color = '#1A73E8' }: { color?: string }) => (
  <svg width="52" height="44" viewBox="0 0 52 44" fill="none">
    <path d="M2 10C2 7.79 3.79 6 6 6H20L25 12H46C48.21 12 50 13.79 50 16V38C50 40.21 48.21 42 46 42H6C3.79 42 2 40.21 2 38V10Z"
      fill="url(#fg)" />
    <defs>
      <linearGradient id="fg" x1="2" y1="6" x2="50" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
        <stop offset="100%" stopColor={color} stopOpacity="0.7"/>
      </linearGradient>
    </defs>
  </svg>
);

const desktopItems: { id: WindowId; label: string; color: string }[] = [
  { id: 'projects',   label: 'Projects',   color: '#1A73E8' },
  { id: 'skills',     label: 'Skills',     color: '#2E7D32' },
  { id: 'experience', label: 'Experience', color: '#E65100' },
];

type ContextMenu = { x: number; y: number } | null;

const Desktop: React.FC<DesktopProps> = ({ onOpenWindow }) => {
  const [selected, setSelected] = useState<WindowId | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu>(null);
  const [contextTarget, setContextTarget] = useState<WindowId | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent, id?: WindowId) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
    setContextTarget(id ?? null);
  }, []);

  const closeContext = useCallback(() => setContextMenu(null), []);

  const desktopContextItems = [
    'New Folder',
    'New Folder with Selection',
    '—',
    'Get Info',
    'Change Desktop Background…',
    '—',
    'Use Stacks',
    'Sort By',
    'Clean Up',
    '—',
    'Import from iPhone…',
  ];

  const iconContextItems = contextTarget
    ? [`Open "${desktopItems.find(d=>d.id===contextTarget)?.label}"`, 'Get Info', '—', 'Move to Trash', '—', 'Compress', 'Duplicate']
    : [];

  return (
    <div
      ref={desktopRef}
      className="absolute inset-0 pt-7"
      onClick={() => { setSelected(null); closeContext(); }}
      onContextMenu={(e) => handleContextMenu(e)}
    >
      {/* Draggable Desktop Icons */}
      {desktopItems.map((item, i) => (
        <motion.div
          key={item.id}
          drag
          dragMomentum={false}
          dragConstraints={desktopRef}
          className={`desktop-icon absolute ${selected === item.id ? 'ring-2 ring-blue-400/50 bg-white/20' : ''}`}
          style={{
            right: 24,
            top: 40 + (i * 100), // Initial grid layout
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
          onDoubleClick={(e) => {
            e.stopPropagation();
            onOpenWindow(item.id);
          }}
          onContextMenu={(e) => {
            e.stopPropagation();
            handleContextMenu(e, item.id);
          }}
          role="button"
          aria-label={`${item.label} folder`}
        >
          <FolderIcon color={item.color} />
          <span>{item.label}</span>
        </motion.div>
      ))}

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
              className="fixed z-[160] py-1 rounded-xl overflow-hidden shadow-2xl"
              style={{
                top: Math.min(contextMenu.y, window.innerHeight - 280),
                left: Math.min(contextMenu.x, window.innerWidth - 220),
                minWidth: 210,
                background: 'rgba(235,235,242,0.96)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.55)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {(contextTarget ? iconContextItems : desktopContextItems).map((item, i) =>
                item === '—' ? (
                  <div key={i} className="my-1 mx-2 h-px bg-black/10" />
                ) : (
                  <div
                    key={i}
                    className="px-4 py-[3px] text-[13px] text-gray-800 hover:bg-blue-500 hover:text-white cursor-default mx-1 rounded-sm transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.startsWith('Open') && contextTarget) onOpenWindow(contextTarget);
                      closeContext();
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
