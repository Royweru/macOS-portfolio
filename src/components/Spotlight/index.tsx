// ─── components/Spotlight/index.tsx ──────────────────────────────────────────
// macOS Spotlight-style command palette. Opens on Cmd+Space or Ctrl+Space.
// Searches window titles, projects, and quick actions.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import projectsData from '../../data/projects_data.json';
import type { WindowId } from '../../types';
import { WINDOW_CONFIGS } from '../../constants';
import './spotlight.css';

interface SpotlightResult {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  action: () => void;
}

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (id: WindowId) => void;
}

const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose, onOpenWindow }) => {
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef                = useRef<HTMLInputElement>(null);

  // Reset state during render when opened to avoid cascading renders
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery('');
      setSelected(0);
    }
  }

  // Reset selection during render when query changes
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSelected(0);
  }

  // Build result list from query
  const results: SpotlightResult[] = React.useMemo(() => {
    const q = query.toLowerCase().trim();

    const windowResults: SpotlightResult[] = (Object.keys(WINDOW_CONFIGS) as WindowId[])
      .filter(id => WINDOW_CONFIGS[id].title.toLowerCase().includes(q) || q === '')
      .map(id => ({
        id: `win-${id}`,
        label: WINDOW_CONFIGS[id].title,
        subtitle: 'Open window',
        icon: WINDOW_CONFIGS[id].icon,
        action: () => { onOpenWindow(id); onClose(); },
      }));

    const projectResults: SpotlightResult[] = projectsData
      .filter(p =>
        q === '' ? false :
        p.title.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.tech.some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 4)
      .map(p => ({
        id: `proj-${p.id}`,
        label: p.title,
        subtitle: `${p.tag} · ${p.tech.slice(0, 2).join(', ')}`,
        icon: p.icon,
        action: () => { onOpenWindow('projects'); onClose(); },
      }));

    const quickActions: SpotlightResult[] = q === '' ? [] : [
      { id: 'qa-contact',  label: 'Contact Weru',     subtitle: 'Open contact form', icon: '✉️', action: () => { onOpenWindow('contact'); onClose(); } },
      { id: 'qa-github',   label: 'View GitHub',      subtitle: 'github.com/weru',   icon: '🐙', action: () => { window.open('https://github.com/weru','_blank'); onClose(); } },
      { id: 'qa-linkedin', label: 'View LinkedIn',    subtitle: 'linkedin.com/in/weru', icon: '💼', action: () => { window.open('https://linkedin.com/in/weru','_blank'); onClose(); } },
    ].filter(a => a.label.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q));

    return [...windowResults, ...projectResults, ...quickActions];
  }, [query, onOpenWindow, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter')      { results[selected]?.action(); }
    if (e.key === 'Escape')     { onClose(); }
  }, [results, selected, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="spotlight-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="spotlight-panel"
            initial={{ opacity: 0, scale: 0.94, y: -20 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit={{    opacity: 0, scale: 0.94,  y: -10 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          >
            {/* Search input */}
            <div className="spotlight-input-row">
              <Search size={18} className="spotlight-search-icon" />
              <input
                ref={inputRef}
                className="spotlight-input"
                placeholder="Search portfolio…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKey}
              />
              {query && (
                <button className="spotlight-clear" onClick={() => setQuery('')}>⌫</button>
              )}
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="spotlight-results">
                {results.map((r, i) => (
                  <motion.div
                    key={r.id}
                    className={`spotlight-result ${i === selected ? 'selected' : ''}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onMouseEnter={() => setSelected(i)}
                    onClick={r.action}
                  >
                    <span className="spotlight-result-icon">{r.icon}</span>
                    <div className="spotlight-result-text">
                      <span className="spotlight-result-label">{r.label}</span>
                      <span className="spotlight-result-sub">{r.subtitle}</span>
                    </div>
                    {i === selected && (
                      <span className="spotlight-result-enter">↵</span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {query && results.length === 0 && (
              <div className="spotlight-empty">
                <span className="text-3xl">🔍</span>
                <span>No results for "<strong>{query}</strong>"</span>
              </div>
            )}

            {/* Footer hint */}
            <div className="spotlight-footer">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Spotlight;
