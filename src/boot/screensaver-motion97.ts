export interface ScreensaverStar97 {
  x: number;
  y: number;
  z: number;
}

export interface StarfieldMotion97 {
  reducedMotion: boolean;
  speed: number;
  random?: () => number;
}

/** Advance the starfield in-place; reduced-motion users get a stable still frame. */
export function advanceStarfield97(
  stars: ScreensaverStar97[],
  { reducedMotion, speed, random = Math.random }: StarfieldMotion97,
) {
  if (reducedMotion) return;
  stars.forEach((star) => {
    star.z -= 0.008 * speed;
    if (star.z <= 0.02) {
      star.x = random() * 2 - 1;
      star.y = random() * 2 - 1;
      star.z = 1;
    }
  });
}

/**
 * Any user input exits the saver. The guard and shared cleanup ensure a rapid
 * pointer + key sequence cannot request multiple exits before React unmounts it.
 */
export function attachScreensaverExit97(target: EventTarget, onExit: () => void) {
  let exited = false;
  const events = ['pointerdown', 'mousemove', 'keydown'] as const;
  const cleanup = () => events.forEach((event) => target.removeEventListener(event, exit));
  const exit = () => {
    if (exited) return;
    exited = true;
    cleanup();
    onExit();
  };
  events.forEach((event) => target.addEventListener(event, exit, { once: true }));
  return cleanup;
}
