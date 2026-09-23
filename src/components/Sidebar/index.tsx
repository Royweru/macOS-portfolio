// ─── components/Sidebar/index.tsx ────────────────────────────────────────────
import React from 'react';
import { Clock3, Star } from 'lucide-react';
import type { WindowId, TagFilter } from '../../types';
import { WINDOW_CONFIGS, SIDEBAR_FAVORITES, SIDEBAR_TAGS } from '../../constants';
import AppIcon from '../AppIcon';

interface SidebarProps {
  windowId: WindowId;
  active: TagFilter;
  onSelect: (s: TagFilter) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ windowId, active, onSelect }) => {
  const cfg = WINDOW_CONFIGS[windowId];

  // Replace "All" label with window title for the first item
  const favorites = SIDEBAR_FAVORITES.map((f, i) => i === 0 ? { ...f, label: cfg.title } : f);

  return (
    <>
      <div className="px-3 mb-1">
        <p className="sidebar-section-label mb-1">Favorites</p>
        {favorites.map((f, i) => (
          <div
            key={f.id}
            className={`sidebar-item ${active === f.id ? 'active' : ''}`}
            onClick={() => onSelect(f.id as TagFilter)}
          >
            <span className="sidebar-item-icon">
              {i === 0 ? <AppIcon appId={windowId} size={15} /> : i === 1 ? <Clock3 size={15} /> : <Star size={15} />}
            </span>
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
