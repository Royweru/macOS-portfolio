import type { MediaAsset } from '../../features/media/media-types';
import { mediaAssetKey } from '../../features/media/media-playlist';

/** Session-scoped Favorites behavior; no signed remote URL is persisted. */
export function toggleMediaFavorite97(favorites: readonly MediaAsset[], asset: MediaAsset): MediaAsset[] {
  const key = mediaAssetKey(asset);
  return favorites.some(item => mediaAssetKey(item) === key)
    ? favorites.filter(item => mediaAssetKey(item) !== key)
    : [...favorites, asset];
}
