export interface IeHistoryPosition97 {
  entries: string[];
  index: number;
}

/** Append a navigation and discard the old forward branch, like classic IE history. */
export function appendIeHistory97(entries: readonly string[], index: number, address: string): IeHistoryPosition97 {
  const safeIndex = Math.max(-1, Math.min(index, entries.length - 1));
  const nextEntries = [...entries.slice(0, safeIndex + 1), address];
  return { entries: nextEntries, index: nextEntries.length - 1 };
}

/** Return a bounded history destination, or null when Back/Forward is unavailable. */
export function stepIeHistory97(entries: readonly string[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= entries.length) return null;
  return { address: entries[nextIndex], index: nextIndex };
}
