// ─── App.tsx ──────────────────────────────────────────────────────────────────
import React, { lazy, Suspense, useCallback, useEffect } from 'react';
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
import ErrorBoundary from './components/common/ErrorBoundary';

// ── Utils ─────────────────────────────────────────────────────────────────────
import { getResponsiveWindowSize, getWindowCenterPosition } from './utils/layout';

// ── Lazy window content (separate JS chunks) ──────────────────────────────────
const AboutContent      = lazy(() => import('./windows/AboutContent'));
const ProjectsContent   = lazy(() => import('./windows/ProjectsContent'));
const SkillsContent     = lazy(() => import('./windows/SkillsContent'));
const ExperienceContent = lazy(() => import('./windows/ExperienceContent'));
const ContactContent    = lazy(() => import('./windows/ContactContent'));

const WindowSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <div className="relative w-8 h-8">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2.5px] h-[7px] bg-gray-400 rounded-full"
          style={{
            left: '50%',
            top: '0',
            marginLeft: '-1.25px',
            transformOrigin: '50% 16px',
            rotate: i * 45,
          }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  </div>
);

function WindowContent({ id, section, view }: { id: WindowId; section: TagFilter; view: ViewMode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<WindowSpinner />}>
        {id === 'about'      && <AboutContent />}
        {id === 'projects'   && <ProjectsContent sidebarSection={section} viewMode={view} />}
        {id === 'skills'     && <SkillsContent />}
        {id === 'experience' && <ExperienceContent />}
        {id === 'contact'    && <ContactContent />}
      </Suspense>
    </ErrorBoundary>
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

  const handleMenuCommand = useCallback((command: string) => {
    if (command === 'close-focused') {
      if (wm.focused) wm.closeWindow(wm.focused);
      return;
    }

    if (command === 'minimize-focused') {
      if (wm.focused) wm.minimizeWindow(wm.focused);
      return;
    }

    if (command === 'bring-front') {
      if (wm.focused) {
        wm.focusWindow(wm.focused);
        return;
      }

      for (let i = wm.openWindows.length - 1; i >= 0; i -= 1) {
        const id = wm.openWindows[i];
        if (!wm.isMinimized(id)) {
          wm.focusWindow(id);
          break;
        }
      }
    }
  }, [wm]);

  const hasWindowToFocus = wm.openWindows.some((id) => !wm.isMinimized(id));

  const handleOpenExternal = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Escape key to close spotlight or focused window
      if (e.key === 'Escape') {
        if (spotlight.isOpen) {
          spotlight.close();
          return;
        }
      }

      if (!(e.metaKey || e.ctrlKey) || e.altKey || isTypingTarget(e.target)) return;

      const key = e.key.toLowerCase();

      // Cmd+Space for Spotlight
      if (e.code === 'Space') {
        e.preventDefault();
        spotlight.isOpen ? spotlight.close() : spotlight.open();
        return;
      }

      if (key === 'n' && !e.shiftKey) {
        e.preventDefault();
        wm.openWindow('projects');
        return;
      }

      if (key === 'w' && !e.shiftKey && wm.focused) {
        e.preventDefault();
        wm.closeWindow(wm.focused);
        return;
      }

      if (key === 'm' && !e.shiftKey && wm.focused) {
        e.preventDefault();
        wm.minimizeWindow(wm.focused);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
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
      <MenuBar
        activeApp={appName}
        onSpotlight={spotlight.open}
        onOpenWindow={wm.openWindow}
        onOpenExternal={handleOpenExternal}
        onCommand={handleMenuCommand}
        hasFocusedWindow={wm.focused !== null}
        hasWindowToFocus={hasWindowToFocus}
      />

      {/* ── Desktop icons ───────────────────────────────────────────────── */}
      <motion.div
        animate={{ opacity: wm.maximized.length > 0 ? 0.4 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <Desktop onOpenWindow={handleOpen} />
      </motion.div>

      {/* ── Windows ─────────────────────────────────────────────────────── */}
      {(Object.keys(WINDOW_CONFIGS) as WindowId[]).map(id => {
        const cfg     = WINDOW_CONFIGS[id];
        const section = (wm.sections[id] ?? 'main') as TagFilter;
        const view    = (wm.views[id]    ?? 'grid') as ViewMode;

        // Calculate responsive sizing
        const { width, height } = getResponsiveWindowSize(cfg.w, cfg.h);
        const { x, y }          = getWindowCenterPosition(width, height, cfg.ox, cfg.oy);

        return (
          <Window
            key={id}
            id={id}
            title={cfg.title}
            icon={cfg.icon}
            isOpen={wm.isOpen(id)}
            isFocused={wm.isFocused(id)}
            isMaximized={wm.isMaximized(id)}
            zIndex={wm.getZIndex(id)}
            defaultWidth={width}
            defaultHeight={height}
            defaultX={x}
            defaultY={y}
            onClose={wm.closeWindow}
            onMinimize={wm.minimizeWindow}
            onMaximize={() => wm.toggleMaximize(id)}
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
