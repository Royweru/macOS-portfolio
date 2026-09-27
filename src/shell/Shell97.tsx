'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { OpenTarget, WindowInstance } from '../features/os/os-types';
import BlissWallpaper97 from './BlissWallpaper97';
import Desktop97 from './Desktop97';
import Taskbar97 from './Taskbar97';
import { BOOT_TASKBAR_REVEAL_DELAY_MS } from '../boot/boot-transition97';
import { registerShellDialogLayer97 } from './dialog-layer97';

export default function Shell97({ children, openInstances, focusedWindowId, onOpenTarget, onOpenWindow, onFocusWindow, animateBootReveal = false }: { children?: ReactNode; openInstances: WindowInstance[]; focusedWindowId: string | null; onOpenTarget: (target: OpenTarget) => void; onOpenWindow: (id: string) => void; onFocusWindow: (id: string) => void; animateBootReveal?: boolean }) {
  return <div className="shell97-viewport"><div className="shell97-stage" data-shell-scale="1" style={{ '--shell97-scale': 1 } as CSSProperties}><div className={`shell97 wallpaper-bliss ${animateBootReveal ? 'shell97-boot-reveal' : ''}`} style={{ '--boot97-taskbar-delay': `${BOOT_TASKBAR_REVEAL_DELAY_MS}ms` } as CSSProperties}><BlissWallpaper97 /><Desktop97 onOpenWindow={onOpenWindow} onOpenTarget={onOpenTarget} />{children}<div ref={registerShellDialogLayer97} className="shell97-dialog-layer" id="shell97-dialog-layer" aria-live="polite" /><Taskbar97 openInstances={openInstances} focusedWindowId={focusedWindowId} onOpenTarget={onOpenTarget} onFocusWindow={onFocusWindow} /><div className="shell97-crt-overlay" aria-hidden="true" /></div></div></div>;
}
