export type CdPlaybackMode97 = 'shuffle' | 'repeat' | 'intro';

export interface CdPlaybackModes97 {
  shuffle: boolean;
  repeat: boolean;
  intro: boolean;
}

/** Shared state transition used by the Options menu and the player toggles. */
export function toggleCdPlaybackMode97(state: CdPlaybackModes97, mode: CdPlaybackMode97): CdPlaybackModes97 {
  return { ...state, [mode]: !state[mode] };
}
