/**
 * Utility to calculate responsive window dimensions based on viewport size.
 * Ensures windows don't exceed screen bounds and maintain a balanced aspect ratio.
 */
export function getResponsiveWindowSize(
  baseWidth: number,
  baseHeight: number,
  maxWidthPercent = 0.9,
  maxHeightPercent = 0.8
) {
  const vW = window.innerWidth;
  const vH = window.innerHeight;

  let width = baseWidth;
  let height = baseHeight;

  // Scale down if the base width exceeds the viewport width (with margin)
  if (width > vW * maxWidthPercent) {
    width = Math.floor(vW * maxWidthPercent);
  }

  // Scale down if the base height exceeds the viewport height (with margin)
  if (height > vH * maxHeightPercent) {
    height = Math.floor(vH * maxHeightPercent);
  }

  // Ensure minimum functional sizes
  width = Math.max(width, 380);
  height = Math.max(height, 280);

  return { width, height };
}

/**
 * Centering helper for window placement.
 */
export function getWindowCenterPosition(width: number, height: number, offsetX = 0, offsetY = 0) {
  const x = (window.innerWidth - width) / 2 + offsetX;
  const y = (window.innerHeight - height) / 3 + offsetY; // Slightly above center for macOS feel
  return { x: Math.max(0, x), y: Math.max(28, y) }; // Avoid menu bar overlap
}
