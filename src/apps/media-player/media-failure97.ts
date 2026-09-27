export interface MediaFailureLike97 {
  code?: number | null;
  name?: string;
}

export interface MediaFailure97 {
  status: string;
  explanation: string;
}

/** Translate browser media errors into useful, non-technical player feedback. */
export function describeMediaFailure97(error: MediaFailureLike97 | null | undefined): MediaFailure97 {
  if (error?.name === 'NotAllowedError') {
    return { status: 'Playback blocked', explanation: 'The browser blocked playback. Press Play again to retry.' };
  }
  if (error?.name === 'NotSupportedError') {
    return { status: 'Unsupported media', explanation: 'This browser cannot play the media format or codec.' };
  }
  if (error?.name === 'AbortError' || error?.code === 1) {
    return { status: 'Playback interrupted', explanation: 'The media load was interrupted before playback finished.' };
  }

  switch (error?.code) {
    case 2:
      return { status: 'Media network error', explanation: 'The browser could not retrieve the video file. Check the file URL and network response.' };
    case 3:
      return { status: 'Media decode error', explanation: 'The file loaded, but this browser could not decode its video stream.' };
    case 4:
      return { status: 'Unsupported media', explanation: 'This browser cannot play the media container or codec.' };
    default:
      return { status: 'Media playback failed', explanation: 'The browser could not start this media. Try opening the original file separately.' };
  }
}
