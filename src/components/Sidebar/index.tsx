// ─── components/Sidebar/index.tsx ────────────────────────────────────────────
import React from 'react';
import type { WindowId, TagFilter } from '../../types';
import { WINDOW_CONFIGS, SIDEBAR_FAVORITES, SIDEBAR_TAGS } from '../../constants';

interface SidebarProps {
  windowId: WindowId;
  active: TagFilter;
  onSelect: (s: TagFilter) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ windowId, active, onSelect }) => {
  const cfg = WINDOW_CONFIGS[windowId];

  // Replace "All" label with window title for the first item
  const favorites = SIDEBAR_FAVORITES.map((f, i) =>
    i === 0 ? { ...f, label: cfg.title, icon: cfg.icon } : f
  );

  return (
    <>
      <div className="px-3 mb-1">
        <p className="sidebar-section-label mb-1">Favorites</p>
        {favorites.map(f => (
          <div
            key={f.id}
            className={`sidebar-item ${active === f.id ? 'active' : ''}`}
            onClick={() => onSelect(f.id as TagFilter)}
          >
            <span className="text-[13px]">{f.icon}</span>
            <span>{f.label}</span>
          </div>
        ))}
      </div>

      {/* Tags only shown on the Projects window */}
      {windowId === 'projects' && (
        <div className="px-3 mt-3">
          <p className="sidebar-section-label mb-1">Tags</p>
          {SIDEBAR_TAGS.map(t => (
            <div
              key={t.id}
              className={`sidebar-item ${active === t.id ? 'active' : ''}`}
              onClick={() => onSelect(t.id as TagFilter)}
            >
              <span
                style={{
                  width: 10, height: 10,
                  borderRadius: '50%',
                  background: t.color,
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Sidebar;
