import type { ProjectMediaManifest } from '../features/media/media-types';
import { isBundledMediaSource, isSupportedMediaMimeType } from '../features/media/media-types';

/**
 * Project media is declared in code and served from public/media. The empty
 * entries are intentional until real portfolio assets are supplied; the
 * filesystem can still represent the folders and links without fake media.
 */
export const PROJECT_MEDIA_MANIFEST: ProjectMediaManifest[] = [];

export const getProjectMedia = (projectId: number) =>
  PROJECT_MEDIA_MANIFEST.find(manifest => manifest.projectId === projectId)?.assets ?? [];

export const getPlayableProjectMedia = () => PROJECT_MEDIA_MANIFEST
  .flatMap(manifest => manifest.assets)
  .filter(asset => asset.kind !== 'image' && isBundledMediaSource(asset) && isSupportedMediaMimeType(asset.kind, asset.mimeType));
