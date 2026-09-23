export type MediaKind = 'video' | 'audio' | 'image';

export interface MediaAsset {
  id: string;
  projectId: number;
  kind: MediaKind;
  title: string;
  source: string;
  mimeType: string;
  poster?: string;
  captionSource?: string;
  durationSeconds?: number;
  description?: string;
}

export interface ProjectMediaManifest {
  projectId: number;
  assets: MediaAsset[];
}

const ALLOWED_MEDIA_PREFIXES: Record<MediaKind, readonly string[]> = {
  video: ['/media/videos/'],
  audio: ['/media/music/', '/media/audio/'],
  image: ['/media/pictures/', '/media/images/'],
} as const;

export const isBundledMediaSource = (asset: Pick<MediaAsset, 'kind' | 'source'>) =>
  ALLOWED_MEDIA_PREFIXES[asset.kind].some(prefix => asset.source.startsWith(prefix));

export const isSupportedMediaMimeType = (kind: MediaKind, mimeType: string) => {
  const normalized = mimeType.toLowerCase();
  if (kind === 'video') return ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/x-msvideo'].includes(normalized);
  if (kind === 'audio') return ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm', 'audio/x-wav', 'audio/midi', 'audio/x-midi'].includes(normalized);
  return ['image/avif', 'image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/gif'].includes(normalized);
};

export const validateMediaAsset = (asset: MediaAsset) =>
  isBundledMediaSource(asset) && isSupportedMediaMimeType(asset.kind, asset.mimeType);
