'use client';

import { useRef, useState, type ReactNode } from 'react';
import AppIcon from '../components/AppIcon';
import TitleBar95 from '../components/win95/TitleBar95';
import type { WindowInstance, WindowRect } from '../features/os/os-types';
import { useDrag97 } from './useDrag97';
import { useResize97, type ResizeDirection97 } from './useResize97';
import { getWindowCloseAction97, hasUnsavedChangesInWindow97, shouldHandleWindowCloseShortcut97 } from './window-close97';
import { getWindowControlPolicy97 } from './window-control-policy97';

export interface Window97Props {
  instance: WindowInstance;
  isFocused: boolean;
  onClose: (id: string) => void;
  onRequestDiscardConfirmation: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, rect: Pick<WindowRect, 'x' | 'y'>) => void;
  onResize: (id: string, rect: WindowRect) => void;
  keyboardShortcutsEnabled?: boolean;
  children: ReactNode;
}

export default function Window97({ instance, isFocused, onClose, onRequestDiscardConfirmation, onMinimize, onMaximize, onFocus, onMove, onResize, keyboardShortcutsEnabled = true, children }: Window97Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMaximized = instance.mode === 'maximized';
  const controls = getWindowControlPolicy97(instance);
  const rect = { x: instance.x, y: instance.y, width: instance.width, height: instance.height };
  const drag = useDrag97({ rect, disabled: isMaximized, onStart: () => { if (!isFocused) onFocus(instance.id); }, onMove: (next) => onMove(instance.id, next) });
  const resize = useResize97({ rect, disabled: isMaximized, minWidth: 240, minHeight: 160, onStart: () => onFocus(instance.id), onResize: (next) => onResize(instance.id, next) });
  const resizeDirections: ResizeDirection97[] = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];

  if (instance.mode === 'minimized') return null;
  const requestClose = () => {
    const isDirty = hasUnsavedChangesInWindow97(contentRef.current);
    const action = getWindowCloseAction97(controls.canClose, isDirty);
    if (action === 'blocked') return;
    if (action === 'confirm-discard') onRequestDiscardConfirmation(instance.id);
    else onClose(instance.id);
    setMenuOpen(false);
  };
  const onWindowKeyDownCapture = (event: React.KeyboardEvent<HTMLElement>) => {
    if (isFocused && shouldHandleWindowCloseShortcut97(event, keyboardShortcutsEnabled)) {
      event.preventDefault();
      event.stopPropagation();
      requestClose();
    }
  };
  const style = isMaximized
    ? { left: 0, top: 0, width: '100%', height: '100%' }
    : { left: instance.x, top: instance.y, width: instance.width, height: instance.height };
  const titlebarIconId = instance.appId === 'system-properties' ? 'system-properties-titlebar' : instance.appId;
  const titlebarIconSize = instance.appId === 'system-properties' ? 14 : 13;

  return (
    <section data-window-instance={instance.id} data-window-app-id={instance.appId} className={`window97 window-frame ${isFocused ? 'focused' : 'inactive'} ${isMaximized ? 'maximized' : ''}`} style={{ ...style, zIndex: instance.zIndex }} onPointerDown={() => { onFocus(instance.id); setMenuOpen(false); }} onKeyDownCapture={onWindowKeyDownCapture} aria-label={instance.title}>
      <div className="window97-drag-surface" style={{ touchAction: 'none' }} {...drag} onContextMenu={(event) => { event.preventDefault(); event.stopPropagation(); setMenuOpen(true); }}>
        <TitleBar95
          title={instance.title}
          icon={<AppIcon appId={titlebarIconId} size={titlebarIconSize} />}
          isActive={isFocused}
          onMinimize={controls.canMinimize ? () => onMinimize(instance.id) : undefined}
          onMaximize={controls.canMaximize ? () => onMaximize(instance.id) : undefined}
          showMaximize={controls.showMaximize}
          maximizeDisabled={!controls.canMaximize}
          onClose={controls.canClose ? requestClose : undefined}
          onDoubleClick={controls.canMaximize && controls.showMaximize ? () => onMaximize(instance.id) : undefined}
        />
      </div>
      {menuOpen && <div className="window97-title-context" role="menu" onPointerDown={event => event.stopPropagation()}>
        {isMaximized && controls.canMaximize && <button type="button" onClick={() => { onMaximize(instance.id); setMenuOpen(false); }}>Restore</button>}
        {controls.canMinimize && <button type="button" onClick={() => { onMinimize(instance.id); setMenuOpen(false); }}>Minimize</button>}
        {controls.canMaximize && controls.showMaximize && !isMaximized && <button type="button" onClick={() => { onMaximize(instance.id); setMenuOpen(false); }}>Maximize</button>}
        {controls.canClose && (controls.canMinimize || (controls.canMaximize && controls.showMaximize)) && <hr />}
        {controls.canClose && <button type="button" onClick={requestClose}>Close</button>}
      </div>}
      <div className="window97-content" ref={contentRef}>{children}</div>
      {!isMaximized && resizeDirections.map((direction) => (
        <div key={direction} data-window-resize={direction} className={`window97-resize window97-resize-${direction}`} style={{ touchAction: 'none', userSelect: 'none' }} onPointerDown={(event) => resize.start(direction, event)} onPointerMove={resize.onPointerMove} onPointerUp={resize.onPointerUp} onPointerCancel={resize.onPointerCancel} />
      ))}
    </section>
  );
}
