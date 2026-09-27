export type ShutdownAction97 = 'shutdown' | 'restart' | 'logon';
export type ShutdownResult97 = 'shutdown' | 'logon';

export interface ShutdownActionEffects97 {
  playShutdownSound: () => void;
  reload: () => void;
  setResult: (result: ShutdownResult97) => void;
}

/** Run the chosen Shutdown dialog action through explicit, testable effects. */
export function executeShutdownAction97(
  action: ShutdownAction97,
  effects: ShutdownActionEffects97,
): void {
  effects.playShutdownSound();

  if (action === 'restart') {
    effects.reload();
    return;
  }

  effects.setResult(action);
}
