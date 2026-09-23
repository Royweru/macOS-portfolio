export const PROPERTY_TABS97 = [
  ['general', 'General'],
  ['device', 'Device Manager'],
  ['hardware', 'Hardware Profiles'],
  ['performance', 'Performance'],
] as const;

export type PropertyTab97 = (typeof PROPERTY_TABS97)[number][0];

export function getAdjacentPropertyTab97(current: PropertyTab97, key: string): PropertyTab97 | undefined {
  const currentIndex = PROPERTY_TABS97.findIndex(([id]) => id === current);
  if (key === 'Home') return PROPERTY_TABS97[0][0];
  if (key === 'End') return PROPERTY_TABS97[PROPERTY_TABS97.length - 1][0];
  if (key === 'ArrowRight' || key === 'ArrowDown') return PROPERTY_TABS97[(currentIndex + 1) % PROPERTY_TABS97.length][0];
  if (key === 'ArrowLeft' || key === 'ArrowUp') return PROPERTY_TABS97[(currentIndex + PROPERTY_TABS97.length - 1) % PROPERTY_TABS97.length][0];
  return undefined;
}
