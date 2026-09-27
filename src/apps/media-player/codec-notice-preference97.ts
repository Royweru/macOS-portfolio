const STORAGE_KEY = 'weru97-media-player-codec-notice-dismissed';

type PreferenceStorage = Pick<Storage, 'getItem' | 'setItem'>;

function getBrowserStorage(): PreferenceStorage | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function hasDismissedCodecNotice97(storage = getBrowserStorage()): boolean {
  try {
    return storage?.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function rememberCodecNoticeDismissal97(storage = getBrowserStorage()): void {
  try {
    storage?.setItem(STORAGE_KEY, 'true');
  } catch {
    // Storage can be disabled; the current dismissal still works in memory.
  }
}
