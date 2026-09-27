import type { WindowInstance } from '../features/os/os-types';

export type WindowClosePolicy97 = Pick<WindowInstance, 'id' | 'canClose' | 'canMinimize'>;

export type WindowCloseShortcutEvent97 = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>;

export function hasUnsavedChangesInWindow97(content: Pick<ParentNode, 'querySelector'> | null | undefined): boolean {
  return Boolean(content?.querySelector('[data-window-dirty="true"]'));
}

export function shouldHandleWindowCloseShortcut97(event: WindowCloseShortcutEvent97, enabled = true): boolean {
  return enabled && (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'w';
}

export function canRequestWindowClose97(
  canClose: boolean,
  hasUnsavedChanges: boolean,
  confirmDiscard: () => boolean,
): boolean {
  if (!canClose) return false;
  return !hasUnsavedChanges || confirmDiscard();
}

export function dispatchWindowShortcut97(
  event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'preventDefault'>,
  focusedWindow: WindowClosePolicy97 | undefined,
  actions: {
    hasUnsavedChanges: boolean;
    confirmDiscard: () => boolean;
    close: (id: string) => void;
    minimize: (id: string) => void;
    shortcutsEnabled?: boolean;
  },
): boolean {
  if (actions.shortcutsEnabled === false) return false;
  if (!focusedWindow || !(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return false;

  const key = event.key.toLowerCase();
  if (shouldHandleWindowCloseShortcut97(event, actions.shortcutsEnabled)) {
    event.preventDefault();
    if (canRequestWindowClose97(focusedWindow.canClose, actions.hasUnsavedChanges, actions.confirmDiscard)) {
      actions.close(focusedWindow.id);
    }
    return true;
  }

  if (key === 'm') {
    event.preventDefault();
    if (focusedWindow.canMinimize) actions.minimize(focusedWindow.id);
    return true;
  }

  return false;
}
