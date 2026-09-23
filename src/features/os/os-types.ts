export type OsPhase = 'bios' | 'starting' | 'logo' | 'desktop';

export type WindowMode = 'normal' | 'minimized' | 'maximized';

/** @deprecated Retained only for the legacy window adapter until Phase 4 is complete. */
export type SnapSlot = string;

export interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MenuBarConfig {
  id: string;
  label: string;
  items: Array<{ id: string; label: string; disabled?: boolean }>;
}

export interface WindowInstance extends WindowRect {
  id: string;
  appId: string;
  mode: WindowMode;
  restoreRect?: WindowRect;
  zIndex: number;
  title: string;
  icon?: string;
  projectId?: number;
  fileId?: string;
  locationId?: string;
  target?: OpenTarget;
  readOnly?: boolean;
  documentTitle?: string;
  restoreFocusTarget?: string;
  menuBar?: MenuBarConfig[];
  canClose: boolean;
  canMinimize: boolean;
  canMaximize: boolean;
}

export type OpenTarget =
  | { kind: 'folder'; nodeId: string; title?: string }
  | { kind: 'file'; nodeId: string; title?: string; preferredAppId?: string }
  | { kind: 'application'; appId: string; title?: string; nodeId?: string }
  | { kind: 'external'; url: string; label?: string }
  | { kind: 'recycle-bin'; title?: string }
  | { kind: 'media'; nodeId: string; title?: string };

export interface DesktopShortcut {
  id: string;
  label: string;
  icon: string;
  targetPath?: string;
  appId?: string;
  nodeId?: string;
  x: number;
  y: number;
  isVisible: boolean;
}

export interface OsSettings {
  themeId: string;
  wallpaperId: string;
  reducedMotion: boolean;
  startupSequenceEnabled: boolean;
  soundEnabled: boolean;
  screensaverEnabled: boolean;
  screensaverTimeout: number;
  /** @deprecated Legacy setting kept until the old settings window is replaced. */
  taskbarAlignment?: 'left' | 'center';
}

export interface OsCommand {
  type:
    | 'open-app'
    | 'open-target'
    | 'close-window'
    | 'minimize-window'
    | 'maximize-window'
    | 'close-focused-window'
    | 'minimize-focused-window'
    | 'toggle-start-menu'
    | 'show-run-dialog'
    | 'show-find-dialog'
    | 'show-bsod'
    | 'toggle-search'
    | 'set-theme'
    | 'set-wallpaper';
  appId?: string;
  themeId?: string;
  wallpaperId?: string;
  windowId?: string;
  target?: OpenTarget;
}
