export function getScrollbarThumbOffset97(scrollPosition: number, scrollRange: number, trackLength: number, thumbLength: number) {
  if (scrollRange <= 0) return 0;
  const travel = Math.max(0, trackLength - thumbLength);
  return Math.max(0, Math.min(travel, scrollPosition / scrollRange * travel));
}

export function getScrollPositionFromThumbDrag97(initialScroll: number, pointerDelta: number, scrollRange: number, trackLength: number, thumbLength: number) {
  if (scrollRange <= 0) return 0;
  const travel = Math.max(1, trackLength - thumbLength);
  return Math.max(0, Math.min(scrollRange, initialScroll + pointerDelta / travel * scrollRange));
}
