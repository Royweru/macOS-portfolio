'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { OpenTarget, WindowInstance } from '../features/os/os-types';
import BlissWallpaper97 from './BlissWallpaper97';
import Desktop97 from './Desktop97';
import Taskbar97 from './Taskbar97';

export default function Shell97({ children, openInstances, focusedWindowId, onOpenTarget, onOpenWindow, onFocusWindow }: { children?: ReactNode; openInstances: WindowInstance[]; focusedWindowId: string | null; onOpenTarget: (target: OpenTarget) => void; onOpenWindow: (id: string) => void; onFocusWindow: (id: string) => void }) {
  return <div className="shell97-viewport"><div className="shell97-stage" data-shell-scale="1" style={{ '--shell97-scale': 1 } as CSSProperties}><div className="shell97 wallpaper-bliss"><BlissWallpaper97 /><Desktop97 onOpenWindow={onOpenWindow} onOpenTarget={onOpenTarget} />{children}<Taskbar97 openInstances={openInstances} focusedWindowId={focusedWindowId} onOpenTarget={onOpenTarget} onFocusWindow={onFocusWindow} /></div></div></div>;
}
