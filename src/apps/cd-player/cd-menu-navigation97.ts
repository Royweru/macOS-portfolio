export type CdMenuNavigationKey97 = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End';

export function nextCdMenuItemIndex97(itemCount: number, currentIndex: number, key: CdMenuNavigationKey97): number {
  if (itemCount <= 0) return -1;
  if (key === 'Home') return 0;
  if (key === 'End') return itemCount - 1;
  if (currentIndex < 0) return key === 'ArrowDown' ? 0 : itemCount - 1;
  const step = key === 'ArrowDown' ? 1 : -1;
  return (currentIndex + step + itemCount) % itemCount;
}
