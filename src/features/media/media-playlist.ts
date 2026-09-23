import type { MediaAsset } from './media-types';
import { isSupportedMediaMimeType } from './media-types';

export const mediaAssetKey = (asset: Pick<MediaAsset, 'id' | 'source'>) => JSON.stringify([asset.id, asset.source]);

const isPlayableAsset = (asset: MediaAsset) =>
  (asset.kind === 'audio' || asset.kind === 'video') && isSupportedMediaMimeType(asset.kind, asset.mimeType);

/** Returns supported audio/video assets once each, retaining library order and the opened item. */
export const buildPlayableMediaList = (library: readonly MediaAsset[], openedAsset?: MediaAsset) => {
  const candidates = openedAsset ? [openedAsset, ...library] : [...library];
  const seenSources = new Set<string>();

  return candidates.filter((asset) => {
    if (!isPlayableAsset(asset)) return false;
    const source = asset.source.trim();
    if (seenSources.has(source)) return false;
    seenSources.add(source);
    return true;
  });
};

export const adjacentMediaAsset = (
  playlist: readonly MediaAsset[],
  selectedKey: string | null,
  direction: -1 | 1,
) => {
  if (playlist.length < 2) return undefined;
  const selectedIndex = playlist.findIndex((asset) => mediaAssetKey(asset) === selectedKey);
  const startIndex = selectedIndex < 0 ? (direction > 0 ? -1 : 0) : selectedIndex;
  return playlist[(startIndex + direction + playlist.length) % playlist.length];
};

export const formatMediaDuration = (seconds?: number) => {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds < 0) return '--:--';
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};

export const mediaAssetFilename = (asset: MediaAsset) => {
  const path = asset.source.split(/[?#]/, 1)[0];
  const encodedName = path.split('/').filter(Boolean).at(-1);
  if (!encodedName) return asset.title;
  try {
    return decodeURIComponent(encodedName);
  } catch {
    return encodedName;
  }
};
