// ─── components/ViewControls/index.tsx ───────────────────────────────────────
import React from 'react';
import { LayoutGrid, List, Search } from 'lucide-react';
import type { ViewMode } from '../../types';

interface ViewControlsProps {
  view: ViewMode;
  onToggle: (v: ViewMode) => void;
}

const ViewControls: React.FC<ViewControlsProps> = ({ view, onToggle }) => (
  <div className="flex items-center gap-0.5 bg-black/5 rounded-md p-0.5">
    <button
      onClick={() => onToggle('grid')}
      title="Grid view"
      className={`p-1 rounded transition-all ${view === 'grid' ? 'bg-white shadow-sm' : 'opacity-40 hover:opacity-70'}`}
    >
      <LayoutGrid size={13} />
    </button>
    <button
      onClick={() => onToggle('list')}
      title="List view"
      className={`p-1 rounded transition-all ${view === 'list' ? 'bg-white shadow-sm' : 'opacity-40 hover:opacity-70'}`}
    >
      <List size={13} />
    </button>
    <button
      title="Search"
      className="p-1 rounded opacity-40 hover:opacity-70 ml-1 transition-opacity"
    >
      <Search size={13} />
    </button>
  </div>
);

export default ViewControls;
