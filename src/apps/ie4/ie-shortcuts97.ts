export type IeShortcutCommand97 =
  | 'new-window'
  | 'open-address'
  | 'print'
  | 'close'
  | 'select-page'
  | 'copy-address'
  | 'refresh'
  | 'back'
  | 'forward'
  | 'home';

export interface IeShortcutKey97 {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
}

/** Resolve only shortcuts visibly advertised by the simulated IE menus. */
export function resolveIeShortcut97(event: IeShortcutKey97): IeShortcutCommand97 | null {
  const key = event.key.toLowerCase();
  const commandKey = Boolean(event.ctrlKey || event.metaKey);

  if (event.altKey && !commandKey && !event.shiftKey) {
    if (event.key === 'ArrowLeft') return 'back';
    if (event.key === 'ArrowRight') return 'forward';
    if (key === 'home') return 'home';
    if (key === 'f4') return 'close';
    return null;
  }

  if (commandKey && !event.altKey && !event.shiftKey) {
    switch (key) {
      case 'n': return 'new-window';
      case 'l': return 'open-address';
      case 'p': return 'print';
      case 'a': return 'select-page';
      case 'c': return 'copy-address';
      default: return null;
    }
  }

  return !commandKey && !event.altKey && !event.shiftKey && key === 'f5' ? 'refresh' : null;
}
