// ─── App.tsx ──────────────────────────────────────────────────────────────────
import React, { lazy, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Styles ────────────────────────────────────────────────────────────────────
import './styles/base.css';
import './styles/wallpaper.css';
import './styles/menubar.css';
import './styles/window.css';
import './styles/dock.css';
import './styles/tokens.css';
import './styles/boot.css';

// ── Hooks ─────────────────────────────────────────────────────────────────────
import { useWindowManager } from './hooks/useWindowManager';
import { useParallax }      from './hooks/useParallax';
import { useSpotlight }     from './hooks/useSpotlight';

// ── Constants & types ─────────────────────────────────────────────────────────
import { WINDOW_CONFIGS }               from './constants';
import type { WindowId, ViewMode, TagFilter } from './types';

// ── Shell components (always loaded) ─────────────────────────────────────────
import MenuBar      from './components/MenuBar';
import Desktop      from './components/Desktop';
import Dock         from './components/Dock';
import Window       from './components/Window';
import Sidebar      from './components/Sidebar';
import ViewControls from './components/ViewControls';
import BootScreen   from './components/BootScreen';
import Spotlight    from './components/Spotlight';

// ── Lazy window content (separate JS chunks) ──────────────────────────────────
const AboutContent      = lazy(() => import('./windows/AboutContent'));
const ProjectsContent   = lazy(() => import('./windows/ProjectsContent'));
const SkillsContent     = lazy(() => import('./windows/SkillsContent'));
const ExperienceContent = lazy(() => import('./windows/ExperienceContent'));
const ContactContent    = lazy(() => import('./windows/ContactContent'));

const WindowSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-blue-500"
    />
  </div>
);

function WindowContent({ id, section, view }: { id: WindowId; section: TagFilter; view: ViewMode }) {
  return (
    <Suspense fallback={<WindowSpinner />}>
      {id === 'about'      && <AboutContent />}
      {id === 'projects'   && <ProjectsContent sidebarSection={section} viewMode={view} />}
      {id === 'skills'     && <SkillsContent />}
      {id === 'experience' && <ExperienceContent />}
      {id === 'contact'    && <ContactContent />}
    </Suspense>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
  const wm       = useWindowManager(['projects']);
  const parallax = useParallax();
  const spotlight = useSpotlight();
  const [booted, setBooted] = React.useState(false);

  const appName = wm.focused ? WINDOW_CONFIGS[wm.focused].title : 'Portfolio';

  const handleOpen = useCallback((id: string) => {
    if (id in WINDOW_CONFIGS) wm.openWindow(id as WindowId);
  }, [wm]);

  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      onMouseMove={parallax.onMouseMove}
    >
      {/* ── Boot ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!booted && <BootScreen onDone={() => setBooted(true)} />}
      </AnimatePresence>

      {/* ── Wallpaper ───────────────────────────────────────────────────── */}
      <motion.div
        className="wallpaper absolute"
        style={{ 
          inset: '-2%', 
          x: parallax.bgX, 
          y: parallax.bgY 
        }}
      >
        <div className="mist-layer" />
      </motion.div>

      {/* ── Menu bar ────────────────────────────────────────────────────── */}
      <MenuBar activeApp={appName} onSpotlight={spotlight.open} />

      {/* ── Desktop icons ───────────────────────────────────────────────── */}
      <Desktop onOpenWindow={handleOpen} />

      {/* ── Windows ─────────────────────────────────────────────────────── */}
      {(Object.keys(WINDOW_CONFIGS) as WindowId[]).map(id => {
        const cfg     = WINDOW_CONFIGS[id];
        const section = (wm.sections[id] ?? 'main') as TagFilter;
        const view    = (wm.views[id]    ?? 'grid') as ViewMode;

        return (
          <Window
            key={id}
            id={id}
            title={cfg.title}
            icon={cfg.icon}
            isOpen={wm.isOpen(id)}
            isFocused={wm.isFocused(id)}
            defaultWidth={cfg.w}
            defaultHeight={cfg.h}
            defaultX={(window.innerWidth  - cfg.w) / 2 + (cfg.ox ?? 0)}
            defaultY={(window.innerHeight - cfg.h) / 3 + (cfg.oy ?? 0)}
            onClose={wm.closeWindow}
            onMinimize={wm.minimizeWindow}
            onFocus={wm.focusWindow}
            showSidebar={cfg.hasSidebar}
            sidebar={
              <Sidebar
                windowId={id}
                active={section}
                onSelect={s => wm.setSection(id, s)}
              />
            }
            viewControls={
              cfg.hasViewControls
                ? <ViewControls view={view} onToggle={v => wm.setView(id, v)} />
                : undefined
            }
          >
            <WindowContent id={id} section={section} view={view} />
          </Window>
        );
      })}

      {/* ── Dock ────────────────────────────────────────────────────────── */}
      <Dock
        openWindows={wm.openWindows.filter(id => !wm.isMinimized(id))}
        onOpen={handleOpen}
      />

      {/* ── Spotlight ───────────────────────────────────────────────────── */}
      <Spotlight
        isOpen={spotlight.isOpen}
        onClose={spotlight.close}
        onOpenWindow={(id) => { wm.openWindow(id); spotlight.close(); }}
      />
    </div>
  );
}

export default App;
