// ─── components/Window.tsx ───────────────────────────────────────────────────
// Draggable, resizable macOS window chrome.
// Features: traffic lights, snap-back on out-of-bounds drag, minimize swoosh,
// maximize toggle, inactive dimming, title bar with icon.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useRef, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface WindowProps {
  id: string;
  title: string;
  icon?: string;
  isOpen: boolean;
  isFocused: boolean;
  isMaximized: boolean;
  zIndex: number;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultX?: number;
  defaultY?: number;
  onClose:    (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus:    (id: string) => void;
  children:     React.ReactNode;
  sidebar?:     React.ReactNode;
  showSidebar?: boolean;
  viewControls?: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
  id, title, icon, isOpen, isFocused, isMaximized, zIndex,
  defaultWidth = 800, defaultHeight = 520,
  defaultX, defaultY,
  onClose, onMinimize, onMaximize, onFocus,
  children, sidebar, showSidebar = true, viewControls,
}) => {
  const [showLabels,    setShowLabels]    = useState(false);
  const [isMinimizing,  setIsMinimizing]  = useState(false);
  const rndRef = useRef<Rnd>(null);

  const sx = defaultX ?? (window.innerWidth  - (defaultWidth))  / 2;
  const sy = defaultY ?? (window.innerHeight - (defaultHeight)) / 3;

  // Snap back if dragged out of bounds
  const handleDragStop = useCallback((_e: unknown, d: { x: number; y: number }) => {
    if (!rndRef.current) return;
    const margin = 30;
    let nx = d.x;
    let ny = d.y;
    const maxX = window.innerWidth  - margin;
    const maxY = window.innerHeight - margin;
    if (nx < -margin)   nx = margin;
    if (ny < 28)        ny = 28;          // never above menu bar
    if (nx > maxX)      nx = maxX - 100;
    if (ny > maxY)      ny = maxY - 60;
    if (nx !== d.x || ny !== d.y) {
      rndRef.current.updatePosition({ x: nx, y: ny });
    }
  }, []);

  // Animated minimize → swoosh down then hide
  const handleMinimize = useCallback(() => {
    setIsMinimizing(true);
    setTimeout(() => {
      setIsMinimizing(false);
      onMinimize(id);
    }, 340);
  }, [id, onMinimize]);

  const minimizeVariants: Variants = {
    visible:   { opacity: 1, scale: 1,    y: 0,   scaleY: 1   },
    minimizing:{ opacity: 0, scale: 0.35, y: 320, scaleY: 0.3,
                 transition: { duration: 0.32, ease: [0.4, 0, 1, 1] } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Rnd
          ref={rndRef}
          default={{ x: sx, y: sy, width: defaultWidth, height: defaultHeight }}
          minWidth={380}
          minHeight={280}
          bounds="parent"
          dragHandleClassName="win-drag-handle"
          enableResizing={!isMaximized}
          disableDragging={isMaximized}
          size={isMaximized ? { width: '100%', height: 'calc(100% - 28px)' } : undefined}
          position={isMaximized ? { x: 0, y: 28 } : undefined}
          style={{ zIndex, position: 'absolute' }}
          onMouseDown={() => onFocus(id)}
          onDragStop={handleDragStop}
        >
          <motion.div
            className="window-glass flex flex-col h-full overflow-hidden"
            variants={minimizeVariants}
            animate={isMinimizing ? 'minimizing' : 'visible'}
            initial={{ opacity: 0, scale: 0.90, y: 28 }}
            exit={{    opacity: 0, scale: 0.88, y: 20,
                       transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
            style={{
              filter:        isFocused ? 'none' : 'brightness(0.95)',
              transformOrigin: 'bottom center',
            }}
            // entry spring
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          >
            {/* ── Title bar ───────────────────────────────────────────── */}
            <div
              className="win-drag-handle window-titlebar flex items-center px-3 h-11 shrink-0 relative select-none"
              onMouseEnter={() => setShowLabels(true)}
              onMouseLeave={() => setShowLabels(false)}
            >
              {/* Traffic lights */}
              <div className="flex items-center gap-[6px] z-10 relative">
                <button
                  className="traffic-light traffic-light-close flex items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); onClose(id); }}
                >
                  {showLabels && (
                    <svg width="6" height="6" viewBox="0 0 6 6">
                      <path d="M1 1l4 4M5 1L1 5" stroke="#6e0000" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>

                <button
                  className="traffic-light traffic-light-min flex items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
                >
                  {showLabels && (
                    <svg width="6" height="6" viewBox="0 0 6 6">
                      <path d="M1 3h4" stroke="#704f00" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>

                <button
                  className="traffic-light traffic-light-max flex items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); onMaximize(id); }}
                >
                  {showLabels && (
                    <svg width="7" height="7" viewBox="0 0 7 7">
                      <path d="M1 3.5L3.5 1L6 3.5M1 3.5L3.5 6L6 3.5" stroke="#006300" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Centred title */}
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none">
                {icon && <span className="text-[14px] leading-none">{icon}</span>}
                <span
                  className="text-[13px] font-semibold text-gray-700 tracking-tight"
                  style={{ opacity: isFocused ? 1 : 0.45 }}
                >
                  {title}
                </span>
              </div>

              {/* Right controls */}
              {viewControls && (
                <div className="ml-auto z-10 relative">{viewControls}</div>
              )}
            </div>

            {/* ── Body ────────────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">
              {showSidebar && sidebar && (
                <div className="finder-sidebar w-44 shrink-0 flex flex-col py-2 overflow-y-auto">
                  {sidebar}
                </div>
              )}
              <div className="flex-1 overflow-hidden" style={{ background: 'rgba(252,252,254,0.75)' }}>
                {children}
              </div>
            </div>

            {/* ── Status bar ──────────────────────────────────────────── */}
            <div className="window-statusbar">
              <span>{statusText || 'weru.dev'}</span>
              {isFocused && (
                <>
                  <span style={{ opacity: 0.35 }}>·</span>
                  <span style={{ color: '#34c759' }}>● Available for work</span>
                </>
              )}
            </div>
          </motion.div>
        </Rnd>
      )}
    </AnimatePresence>
  );
};

export default Window;
</AnimatePresence>
  );
};

export default Window;

          </motion.div>
        </Rnd>
      )}
    </AnimatePresence>
  );
};

export default Window;
