export type CdTimeMode97 = 'elapsed' | 'remain' | 'disc';

export interface CdTimeInput97 {
  mode: CdTimeMode97;
  elapsedSeconds: number;
  trackDurationSeconds: number;
  trackDurationsSeconds: readonly (number | undefined)[];
  selectedIndex: number;
}

export interface CdTimeOutput97 {
  displayedSeconds: number;
  totalSeconds: number;
}

const seconds97 = (value: number | undefined) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0;

/** Calculate elapsed/remaining displays against the ordered CD playlist. */
export function calculateCdTime97(input: CdTimeInput97): CdTimeOutput97 {
  const durations = input.trackDurationsSeconds.map(seconds97);
  const selectedIndex = Number.isInteger(input.selectedIndex) ? input.selectedIndex : -1;
  const trackDuration = seconds97(input.trackDurationSeconds);
  if (selectedIndex >= 0 && selectedIndex < durations.length && trackDuration > 0) {
    // Prefer the duration reported by the loaded media element over stale manifest metadata.
    durations[selectedIndex] = trackDuration;
  }

  const totalSeconds = durations.reduce((total, duration) => total + duration, 0);
  const elapsedSeconds = seconds97(input.elapsedSeconds);
  const selectedDuration = selectedIndex >= 0 && selectedIndex < durations.length
    ? durations[selectedIndex]
    : trackDuration;
  const trackElapsed = selectedDuration > 0 ? Math.min(elapsedSeconds, selectedDuration) : elapsedSeconds;

  if (input.mode === 'elapsed') return { displayedSeconds: trackElapsed, totalSeconds };
  if (input.mode === 'remain') {
    return { displayedSeconds: Math.max(0, selectedDuration - trackElapsed), totalSeconds };
  }

  const completedTrackSeconds = selectedIndex > 0
    ? durations.slice(0, selectedIndex).reduce((total, duration) => total + duration, 0)
    : 0;
  return {
    displayedSeconds: Math.max(0, totalSeconds - completedTrackSeconds - trackElapsed),
    totalSeconds,
  };
}
