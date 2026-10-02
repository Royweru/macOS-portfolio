import type { WindowInstance } from '../features/os/os-types';

export type WindowClosePolicy97 = Pick<WindowInstance, 'id' | 'canClose' | 'canMinimize'>;
export type WindowCloseAction97 = 'blocked' | 'confirm-discard' | 'close';

export type WindowCloseShortcutEvent97 = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>;

export function hasUnsavedChangesInWindow97(content: Pick<ParentNode, 'querySelector'> | null | undefined): boolean {
  return Boolean(content?.querySelector('[data-window-dirty="true"]'));
}

export function shouldHandleWindowCloseShortcut97(event: WindowCloseShortcutEvent97, enabled = true): boolean {
  return enabled && (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'w';
}

export function getWindowCloseAction97(canClose: boolean, hasUnsavedChanges: boolean): WindowCloseAction97 {
  if (!canClose) return 'blocked';
  return hasUnsavedChanges ? 'confirm-discard' : 'close';
}

export function dispatchWindowShortcut97(
  event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'preventDefault'>,
  focusedWindow: WindowClosePolicy97 | undefined,
  actions: {
    hasUnsavedChanges: boolean;
    requestDiscardConfirmation: (id: string) => void;
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
    const action = getWindowCloseAction97(focusedWindow.canClose, actions.hasUnsavedChanges);
    if (action === 'confirm-discard') actions.requestDiscardConfirmation(focusedWindow.id);
    else if (action === 'close') actions.close(focusedWindow.id);
    return true;
  }

  if (key === 'm') {
    event.preventDefault();
    if (focusedWindow.canMinimize) actions.minimize(focusedWindow.id);
    return true;
  }

  return false;
}
