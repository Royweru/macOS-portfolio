import type { MediaAsset } from '../../features/media/media-types';

const DIRECT_MEDIA_TYPES: Record<string, Pick<MediaAsset, 'kind' | 'mimeType'>> = {
  '.mp4': { kind: 'video', mimeType: 'video/mp4' },
  '.m4v': { kind: 'video', mimeType: 'video/mp4' },
  '.webm': { kind: 'video', mimeType: 'video/webm' },
  '.ogv': { kind: 'video', mimeType: 'video/ogg' },
  '.avi': { kind: 'video', mimeType: 'video/x-msvideo' },
  '.mp3': { kind: 'audio', mimeType: 'audio/mpeg' },
  '.wav': { kind: 'audio', mimeType: 'audio/wav' },
  '.ogg': { kind: 'audio', mimeType: 'audio/ogg' },
  '.mid': { kind: 'audio', mimeType: 'audio/midi' },
  '.midi': { kind: 'audio', mimeType: 'audio/midi' },
};

/** Build a player asset only for a direct, supported HTTP(S) media URL. */
export function mediaAssetFromUrl97(value: string): MediaAsset | undefined {
  try {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return undefined;

    const pathname = decodeURIComponent(url.pathname).toLowerCase();
    const extension = pathname.slice(pathname.lastIndexOf('.'));
    const type = DIRECT_MEDIA_TYPES[extension];
    if (!type) return undefined;

    const filename = decodeURIComponent(url.pathname.split('/').filter(Boolean).at(-1) ?? '');
    if (!filename) return undefined;

    return {
      id: `external-media:${url.href}`,
      projectId: 0,
      kind: type.kind,
      title: filename,
      source: url.href,
      mimeType: type.mimeType,
    };
  } catch {
    return undefined;
  }
}
