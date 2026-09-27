import type { MediaAsset } from '../../features/media/media-types';
import { isBundledMediaSource } from '../../features/media/media-types';
import type { MediaFailure97 } from './media-failure97';

export default function MediaUnavailable97({ asset, failure }: { asset: MediaAsset; failure: MediaFailure97 }) {
  const standaloneSource = isBundledMediaSource(asset) ? asset.source : null;

  return <div className="win97-media-failure" role="alert" aria-live="assertive">
    <strong>{failure.status}</strong>
    <span>{failure.explanation}</span>
    {standaloneSource && <a href={standaloneSource} target="_blank" rel="noopener noreferrer">Open original video in a new tab ↗</a>}
  </div>;
}
