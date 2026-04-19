// ─── components/MenuBar.tsx ───────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Search } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_BAR_MENUS } from '../constants';

interface MenuBarProps {
  activeApp:   string;
  onSpotlight: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ activeApp, onSpotlight }) => {
  const [time, setTime]       = useState(new Date());
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuX,    setMenuX]    = useState(0);

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.menubar-item')) setOpenMenu(null);
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, []);

  const dayStr  = format(time, 'EEE MMM d');
  const timeStr = format(time, 'h:mm aa');

  const handleMenu = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuX(rect.left);
    setOpenMenu(prev => prev === label ? null : label);
  };

  const menuLabels = ['apple', 'File', 'Edit', 'View', 'Window', 'Help'];

  return (
    <>
      <div className="menubar absolute top-0 left-0 right-0 h-7 flex items-center px-2 z-[200] select-none">
        {/* Left menus */}
        <div className="flex items-center">
          {menuLabels.map(label => {
            const key      = label === 'apple' ? '' : label;
            const display  = label === 'apple' ? '⌘' : label === 'File' ? activeApp : label;
            const isBold   = label === 'apple' || label === 'File';
            const isActive = openMenu === key;
            return (
              <div
                key={label}
                className={`menubar-item menu-item ${isActive ? 'open' : ''}`}
                style={{
                  fontWeight: isBold ? 600 : 400,
                  fontSize: label === 'apple' ? 16 : 13,
                  padding: label === 'apple' ? '0 10px' : '1px 8px',
                }}
                onMouseDown={e => handleMenu(key, e)}
                onMouseEnter={e => {
                  if (openMenu !== null) {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setMenuX(rect.left);
                    setOpenMenu(key);
                  }
                }}
              >
                {display}
              </div>
            );
          })}
        </div>

        {/* Right status area */}
        <div className="ml-auto flex items-center gap-2.5 pr-1">
          <button
            onClick={onSpotlight}
            className="flex items-center opacity-65 hover:opacity-95 transition-opacity cursor-default"
            title="Spotlight (⌘Space)"
          >
            <Search size={13} />
          </button>
          <Wifi size={14} className="opacity-75" />
          <div className="flex items-center gap-0.5 opacity-75">
            <Battery size={16} />
            <span className="text-[11px]">84%</span>
          </div>
          <span className="text-[12px] font-medium tracking-tight whitespace-nowrap">
            {dayStr}&nbsp;&nbsp;{timeStr}
          </span>
        </div>
      </div>

      {/* Dropdown menus */}
      <AnimatePresence>
        {openMenu !== null && MENU_BAR_MENUS[openMenu] && (
          <motion.div
            key={openMenu}
            className="menu-dropdown fixed"
            style={{ top: 27, left: menuX, zIndex: 300 }}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit={{    opacity: 0, scale: 0.95,  y: -4  }}
            transition={{ duration: 0.1 }}
            onMouseLeave={() => setOpenMenu(null)}
          >
            {MENU_BAR_MENUS[openMenu].map((item, i) =>
              item === '—'
                ? <div key={i} className="menu-dropdown-separator" />
                : <div key={i} className="menu-dropdown-item" onClick={() => setOpenMenu(null)}>{item}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MenuBar;
