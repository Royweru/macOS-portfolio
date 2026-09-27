export type PauseableMedia97 = Pick<HTMLMediaElement, 'pause'>;

export function pauseMedia97(media: PauseableMedia97 | null | undefined): void {
  media?.pause();
}
