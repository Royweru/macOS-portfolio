type TimerHost97 = Pick<typeof globalThis, 'setTimeout' | 'clearTimeout'>;

const ACTIVITY_EVENTS_97 = ['mousemove', 'keydown', 'pointerdown'] as const;

/** Start/reset the inactivity timeout on pointer, mouse, or keyboard input. */
export function attachScreensaverIdleTimer97(
  target: EventTarget,
  timeoutMs: number,
  onActivate: () => void,
  onActivity: () => void = () => {},
  timerHost: TimerHost97 = globalThis,
) {
  let disposed = false;
  let timer: ReturnType<typeof timerHost.setTimeout>;
  const schedule = () => {
    timer = timerHost.setTimeout(() => {
      if (!disposed) onActivate();
    }, timeoutMs);
  };
  const reset = () => {
    if (disposed) return;
    onActivity();
    timerHost.clearTimeout(timer);
    schedule();
  };

  schedule();
  ACTIVITY_EVENTS_97.forEach((eventName) => target.addEventListener(eventName, reset));

  return () => {
    if (disposed) return;
    disposed = true;
    timerHost.clearTimeout(timer);
    ACTIVITY_EVENTS_97.forEach((eventName) => target.removeEventListener(eventName, reset));
  };
}
