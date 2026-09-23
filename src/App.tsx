'use client';

import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

// ── Hooks ─────────────────────────────────────────────────────────────────────
import { useWindowManager } from './hooks/useWindowManager';
import { useFilesystemBootstrap } from './features/filesystem/use-filesystem-bootstrap';

// ── Constants & types ─────────────────────────────────────────────────────────
import { WINDOW_CONFIGS }               from './constants';
import type { WindowId } from './types';
import type { MediaAsset } from './features/media/media-types';

// ── Shell components (always loaded) ─────────────────────────────────────────
import ErrorBoundary from './components/common/ErrorBoundary';
import Shell97 from './shell/Shell97';
import BootSequence97 from './boot/BootSequence97';
import WelcomeWizard97 from './apps/system/WelcomeWizard97';
import Screensaver97 from './boot/Screensaver97';
import BlueScreen97 from './apps/system/BlueScreen97';
import WindowManager97 from './wm/WindowManager97';
import { soundEngine } from './os/sound/synth';
import Explorer97 from './apps/explorer/Explorer97';
import RecycleBin97 from './apps/recycle-bin/RecycleBin97';
import Calculator97 from './apps/calc/Calculator97';
import ControlPanel97 from './apps/system/ControlPanel97';
import SystemProperties97 from './apps/system/SystemProperties97';
import Minesweeper97 from './apps/games/Minesweeper97';
import MsDosPrompt97 from './apps/msdos/MsDosPrompt97';
import RetroBrowser97 from './apps/ie4/RetroBrowser97';
import Paint97 from './apps/paint/Paint97';
import CdPlayer97 from './apps/cd-player/CdPlayer97';
import MediaPlayer97 from './apps/media-player/MediaPlayer97';
import RunDialog97 from './apps/system/RunDialog97';
import FindFiles97 from './apps/system/FindFiles97';
import ShutDown97 from './apps/system/ShutDown97';
import Contact97 from './apps/system/Contact97';

// ── Utils ─────────────────────────────────────────────────────────────────────
import type { OsCommand } from './features/os/os-types';
import type { OpenTarget } from './features/os/os-types';
import { useOsStore } from './features/os/os-store';
import { resolveTarget, isAllowedExternalUrl } from './features/os/open-target';
import { getNode } from './features/filesystem/filesystem-service';
import { VIRTUAL_NODE_IDS } from './features/filesystem/virtual-paths';
import { STITCH_DESKTOP_EXPLORER_RECT } from './wm/geometry97';

// ── Lazy window content (separate JS chunks) ──────────────────────────────────
const NotepadContent      = lazy(() => import('./apps/notepad/Notepad97'));

const WindowSpinner = () => (
  <div className="win97-window-spinner" role="status" aria-label="Loading">
    <span className="win97-window-spinner-bars" aria-hidden="true">
      {[...Array(8)].map((_, i) => <i key={i} style={{ transform: `rotate(${i * 45}deg)` }} />)}
    </span>
    <span>Loading...</span>
  </div>
);

function WindowContent({ id, projectId, mediaAsset, fileId, locationId, terminalCwd, ieAddress, onOpenTarget, onTerminalEffect, onOpenApp, onClose }: { id: WindowId; projectId?: number; mediaAsset?: MediaAsset; fileId?: string; locationId?: string; terminalCwd?: string; ieAddress?: string; onOpenTarget: (target: OpenTarget) => void; onTerminalEffect: (effect: OsCommand) => void; onOpenApp: (appId: string) => void; onClose: () => void }) {
  const fileNode = useLiveQuery(() => fileId ? getNode(fileId) : undefined, [fileId]);
  const fileMediaAsset = fileNode?.media ? {
    id: fileNode.media.mediaId,
    projectId: fileNode.media.projectId,
    kind: fileNode.media.kind,
    title: fileNode.media.title,
    source: fileNode.media.source,
    mimeType: fileNode.mimeType,
    poster: fileNode.media.poster,
    captionSource: fileNode.media.captionSource,
    durationSeconds: fileNode.media.durationSeconds,
    description: fileNode.media.description,
  } satisfies MediaAsset : undefined;
  const resolvedMediaAsset = fileMediaAsset ?? mediaAsset;

  return (
    <ErrorBoundary>
      <Suspense fallback={<WindowSpinner />}>
        {id === 'about'      && <NotepadContent fileId={fileId ?? 'file-about-me'} />}
        {id === 'projects'   && <Explorer97 initialFolderId={locationId ?? VIRTUAL_NODE_IDS.projects} onOpenTarget={onOpenTarget} />}
        {id === 'project-detail' && <Explorer97 initialFolderId={locationId ?? (projectId ? `project-${projectId}` : VIRTUAL_NODE_IDS.projects)} onOpenTarget={onOpenTarget} />}
        {id === 'media-player' && <MediaPlayer97 asset={resolvedMediaAsset} />}
        {id === 'skills'     && <NotepadContent fileId={fileId ?? 'file-skills'} />}
        {id === 'experience' && <NotepadContent fileId={fileId ?? 'file-experience'} />}
        {id === 'contact'    && <Contact97 onClose={onClose} />}
        {id === 'mail'       && <Contact97 onClose={onClose} />}
        {id === 'photos'     && <Paint97 asset={resolvedMediaAsset} />}
        {id === 'explorer'   && <Explorer97 initialFolderId={locationId ?? VIRTUAL_NODE_IDS.root} onOpenTarget={onOpenTarget} />}
        {id === 'recycle-bin' && <RecycleBin97 />}
        {id === 'terminal'   && <MsDosPrompt97 initialCwd={terminalCwd} onEffect={onTerminalEffect} />}
        {id === 'notepad'    && <NotepadContent fileId={fileId} />}
        {id === 'settings'   && <ControlPanel97 onClose={onClose} />}
        {id === 'calculator' && <Calculator97 />}
        {id === 'control-panel' && <ControlPanel97 onClose={onClose} />}
        {id === 'system-properties' && <SystemProperties97 onClose={onClose} />}
        {id === 'minesweeper' && <Minesweeper97 />}
        {id === 'msdos' && <MsDosPrompt97 initialCwd={terminalCwd} onEffect={onTerminalEffect} />}
        {id === 'ie4' && <RetroBrowser97 key={ieAddress ?? 'weru-home'} initialAddress={ieAddress} />}
        {id === 'paint' && <Paint97 asset={resolvedMediaAsset} />}
        {id === 'cd-player' && <CdPlayer97 asset={resolvedMediaAsset} />}
        {id === 'run' && <RunDialog97 onOpenApp={onOpenApp} onClose={onClose} />}
        {id === 'find' && <FindFiles97 onOpenTarget={onOpenTarget} onClose={onClose} />}
        {id === 'shutdown' && <ShutDown97 onClose={onClose} />}
      </Suspense>
    </ErrorBoundary>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
  const initialWindows = useMemo(() => [] as WindowId[], []);
  const wm       = useWindowManager(initialWindows);
  const openWindow = wm.openWindow;
  const filesystem = useFilesystemBootstrap();
  const setSettings = useOsStore(state => state.setSettings);
  const setPhase = useOsStore(state => state.setPhase);
  const isStoreHydrated = useOsStore(state => state.isHydrated);
  const settings = useOsStore(state => state.settings);
  const [booted, setBooted] = React.useState(false);
  const [bootOverlayVisible, setBootOverlayVisible] = React.useState(true);
  const [showWizard, setShowWizard] = React.useState(false);
  const [screensaver, setScreensaver] = React.useState(false);
  const [blueScreen, setBlueScreen] = React.useState(false);
  const [mediaAsset, setMediaAsset] = React.useState<MediaAsset | undefined>();
  const [notepadFileId, setNotepadFileId] = React.useState<string | undefined>();
  const [ieAddress, setIeAddress] = React.useState<string | undefined>();
  const terminalCwd = undefined;
  const previousWindowCount = useRef(0);
  const stitchDesktopSeeded = useRef(false);

  const handleOpenTarget = useCallback(async (target: OpenTarget) => {
    const resolved = await resolveTarget(target);
    if (resolved.error) return;
    const effectiveTarget = resolved.target;
    if (effectiveTarget.kind === 'external') {
      if (isAllowedExternalUrl(effectiveTarget.url)) {
        setIeAddress(effectiveTarget.url);
        wm.openWindow('ie4', { title: `${effectiveTarget.label ?? 'case-study.url'} - Internet Explorer` });
      }
      return;
    }
    if (effectiveTarget.kind === 'recycle-bin') {
      wm.openWindow('recycle-bin');
      return;
    }
    if (effectiveTarget.kind === 'application') {
      if (effectiveTarget.appId === 'projects') {
        wm.openWindow('explorer', { instanceId: 'explorer-projects', locationId: VIRTUAL_NODE_IDS.projects, title: 'Projects', allowMultiple: false });
      } else if (effectiveTarget.appId === 'explorer') {
        wm.openWindow('explorer', { locationId: VIRTUAL_NODE_IDS.root, title: effectiveTarget.title ?? 'File Explorer' });
      } else if (effectiveTarget.appId === 'notepad') {
        setNotepadFileId('file-about-me');
        wm.openWindow('notepad', { instanceId: 'notepad-file-about-me', fileId: 'file-about-me', title: 'About Me.txt', allowMultiple: true, readOnly: true });
      } else if (effectiveTarget.appId === 'msdos') {
        wm.openWindow('msdos');
      } else if (effectiveTarget.appId in WINDOW_CONFIGS) {
        wm.openWindow(effectiveTarget.appId as WindowId);
      }
      return;
    }
    const node = resolved.resolvedNode;
    if (!node) return;
    if (node.kind === 'folder') {
      const isMyDocuments = node.id === 'folder-my-documents';
      wm.openWindow('explorer', {
        instanceId: isMyDocuments ? 'explorer-my-documents' : `explorer-${node.id}`,
        locationId: node.id,
        title: node.name,
        allowMultiple: !isMyDocuments,
        ...(isMyDocuments ? { rect: STITCH_DESKTOP_EXPLORER_RECT } : {}),
      });
      return;
    }
    if (node.media) {
      setMediaAsset({
        id: node.media.mediaId,
        projectId: node.media.projectId,
        kind: node.media.kind,
        title: node.media.title,
        source: node.media.source,
        mimeType: node.mimeType,
        poster: node.media.poster,
        captionSource: node.media.captionSource,
        durationSeconds: node.media.durationSeconds,
        description: node.media.description,
      });
      const mediaApp: 'paint' | 'media-player' = node.media.kind === 'image' ? 'paint' : 'media-player';
      wm.openWindow(mediaApp, { instanceId: `${mediaApp}-${node.id}`, fileId: node.id, title: node.name, allowMultiple: true });
      return;
    }
    setNotepadFileId(node.id);
    wm.openWindow('notepad', { instanceId: `notepad-${node.id}`, fileId: node.id, title: node.name, readOnly: Boolean(node.isReadOnly), allowMultiple: true });
  }, [wm]);

  const handleOpen = useCallback((id: string) => {
    if (id === 'explorer') {
      wm.openWindow('explorer', { locationId: VIRTUAL_NODE_IDS.root });
      return;
    }
    if (id === 'projects') {
      void handleOpenTarget({ kind: 'application', appId: 'projects' });
      return;
    }
    if (id === 'about') { void handleOpenTarget({ kind: 'file', nodeId: 'file-about-me' }); return; }
    if (id === 'skills') { void handleOpenTarget({ kind: 'file', nodeId: 'file-skills' }); return; }
    if (id === 'experience') { void handleOpenTarget({ kind: 'file', nodeId: 'file-experience' }); return; }
    if (id === 'contact') { void handleOpenTarget({ kind: 'application', appId: 'mail' }); return; }
    if (id in WINDOW_CONFIGS) wm.openWindow(id as WindowId);
  }, [handleOpenTarget, wm]);

  const handleOpenApp = useCallback((appId: string) => {
    void handleOpenTarget({ kind: 'application', appId });
  }, [handleOpenTarget]);

  const handleTerminalEffect = useCallback((effect: OsCommand) => {
    if (effect.type === 'open-target' && effect.target) void handleOpenTarget(effect.target);
    if (effect.type === 'open-app' && effect.appId) void handleOpenTarget({ kind: 'application', appId: effect.appId });
    if (effect.type === 'set-theme' && effect.themeId) setSettings({ themeId: effect.themeId });
    if (effect.type === 'set-wallpaper' && effect.wallpaperId) setSettings({ wallpaperId: effect.wallpaperId });
    if (effect.type === 'close-focused-window' && wm.focused) wm.closeWindow(wm.focused);
    if (effect.type === 'minimize-focused-window' && wm.focused) wm.minimizeWindow(wm.focused);
    if (effect.type === 'close-window' && effect.windowId) wm.closeWindow(effect.windowId);
    if (effect.type === 'minimize-window' && effect.windowId) wm.minimizeWindow(effect.windowId);
    if (effect.type === 'maximize-window' && effect.windowId) wm.toggleMaximize(effect.windowId as WindowId);
    if (effect.type === 'show-run-dialog') handleOpenApp('run');
    if (effect.type === 'show-find-dialog') handleOpenApp('find');
    if (effect.type === 'show-bsod') setBlueScreen(true);
  }, [handleOpenApp, handleOpenTarget, setSettings, wm]);

  const finishBoot = useCallback(() => {
    setBooted(true);
    setPhase('desktop');
    soundEngine.setEnabled(settings.soundEnabled);
    soundEngine.play('startup');
    if (typeof window !== 'undefined' && !window.localStorage.getItem('weru97-visited')) setShowWizard(true);
  }, [setPhase, settings.soundEnabled]);

  useEffect(() => {
    if (!booted || !isStoreHydrated || stitchDesktopSeeded.current) return;
    stitchDesktopSeeded.current = true;
    const state = useOsStore.getState();
    const firstVisit = typeof window !== 'undefined' && !window.localStorage.getItem('weru97-visited');
    // Stitch's desktop reference opens My Documents. Seed that composition for
    // a clean first visit, but leave any restored or user-created window state alone.
    if (firstVisit && Object.keys(state.windows).length === 0) {
      openWindow('explorer', {
        instanceId: 'explorer-my-documents',
        title: 'My Documents',
        locationId: 'folder-my-documents',
        rect: STITCH_DESKTOP_EXPLORER_RECT,
      });
    }
  }, [booted, isStoreHydrated, openWindow]);
  const hideBootOverlay = useCallback(() => setBootOverlayVisible(false), []);

  useEffect(() => { soundEngine.setEnabled(settings.soundEnabled); }, [settings.soundEnabled]);

  useEffect(() => {
    const count = wm.activeWindows.length;
    if (previousWindowCount.current > 0 && count > previousWindowCount.current) soundEngine.play('chord');
    if (count < previousWindowCount.current) soundEngine.play('click');
    previousWindowCount.current = count;
  }, [wm.activeWindows.length]);

  useEffect(() => {
    if (!booted || !settings.screensaverEnabled) return;
    let timer = window.setTimeout(() => setScreensaver(true), settings.screensaverTimeout * 1000);
    const reset = () => { setScreensaver(false); window.clearTimeout(timer); timer = window.setTimeout(() => setScreensaver(true), settings.screensaverTimeout * 1000); };
    window.addEventListener('mousemove', reset); window.addEventListener('keydown', reset); window.addEventListener('pointerdown', reset);
    return () => { window.clearTimeout(timer); window.removeEventListener('mousemove', reset); window.removeEventListener('keydown', reset); window.removeEventListener('pointerdown', reset); };
  }, [booted, settings.screensaverEnabled, settings.screensaverTimeout]);

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Do not dispatch desktop shortcuts while the screensaver is covering the shell.
      // Escape is reserved for the active overlay (for example, screensaver or menu),
      // never for closing whichever application happens to have focus.
      if (!booted || screensaver) return;

      if (!(e.metaKey || e.ctrlKey) || e.altKey || isTypingTarget(e.target)) return;

      const key = e.key.toLowerCase();

      // Ctrl/Cmd+Space opens the portfolio explorer.
      if (e.code === 'Space') {
        e.preventDefault();
        wm.openWindow('explorer', { locationId: VIRTUAL_NODE_IDS.root });
        return;
      }

      if (key === 'n' && !e.shiftKey) {
        e.preventDefault();
        void handleOpenTarget({ kind: 'application', appId: 'projects' });
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
  }, [booted, handleOpenTarget, screensaver, wm]);

  return (
    <div className="weru-app-root">
      {/* ── Boot ────────────────────────────────────────────────────────── */}
      {bootOverlayVisible && <BootSequence97 onRevealDesktop={finishBoot} onDone={hideBootOverlay} reducedMotion={settings.reducedMotion} />}

      {filesystem.error && (
        <div className="sr-only" role="status">
          Portfolio filesystem unavailable: {filesystem.error.message}
        </div>
      )}

      {/* ── Desktop icons ───────────────────────────────────────────────── */}
      {/* ── Windows ─────────────────────────────────────────────────────── */}
      {booted && <Shell97 openInstances={wm.activeWindows} focusedWindowId={wm.focusedWindowId} onOpenTarget={handleOpenTarget} onOpenWindow={handleOpen} onFocusWindow={wm.focusWindow}>
        <WindowManager97
        windows={wm.activeWindows}
        focusedWindowId={wm.focusedWindowId}
        onClose={wm.closeWindow}
        onMinimize={wm.minimizeWindow}
        onMaximize={wm.toggleMaximize}
        onFocus={wm.focusWindow}
        onMove={(id, rect) => { const current = wm.getRect(id); if (current) wm.updateRect(id, { ...current, ...rect }); }}
        onResize={wm.updateRect}
        onRepairRect={wm.updateRect}
        renderContent={(instance) => <WindowContent id={instance.appId as WindowId} projectId={instance.projectId} mediaAsset={mediaAsset} fileId={instance.fileId ?? notepadFileId} locationId={instance.locationId} terminalCwd={terminalCwd} ieAddress={ieAddress} onOpenTarget={handleOpenTarget} onTerminalEffect={handleTerminalEffect} onOpenApp={handleOpenApp} onClose={() => wm.closeWindow(instance.id)} />}
        />
      </Shell97>}
      {showWizard && <WelcomeWizard97 onFinish={() => setShowWizard(false)} />}
      {screensaver && <Screensaver97 onExit={() => setScreensaver(false)} />}
      {blueScreen && <BlueScreen97 onRecover={() => setBlueScreen(false)} />}
    </div>
  );
}

export default App;
