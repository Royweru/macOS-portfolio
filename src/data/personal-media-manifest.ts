import type { MediaAsset, MediaKind } from '../features/media/media-types';
import { isBundledMediaSource, isSupportedMediaMimeType } from '../features/media/media-types';

export interface PersonalVideo {
  filename: string;
  title: string;
  src: string;
  durationSeconds?: number;
  poster?: string;
}

export interface PersonalPicture {
  filename: string;
  title: string;
  src: string;
}

export interface PersonalMusicTrack {
  filename: string;
  title: string;
  artist: string;
  src: string;
  durationSeconds?: number;
}

export interface PersonalMediaEntry {
  id: string;
  kind: MediaKind;
  filename: string;
  mimeType: string;
  asset: MediaAsset;
  artist?: string;
}

// Add user-owned assets here after placing them in the matching public/media directory.
// Keep these separate from PROJECT_MEDIA_MANIFEST so personal media never becomes
// part of a project's folder or demo playlist by accident.
export const PERSONAL_VIDEOS: PersonalVideo[] = [];
export const PERSONAL_PICTURES: PersonalPicture[] = [];
export const PERSONAL_MUSIC: PersonalMusicTrack[] = [];

const MIME_BY_EXTENSION: Record<MediaKind, Record<string, string>> = {
  video: {
    mp4: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg', ogg: 'video/ogg', avi: 'video/x-msvideo',
  },
  image: {
    avif: 'image/avif', bmp: 'image/bmp', gif: 'image/gif', jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
  },
  audio: {
    mid: 'audio/midi', midi: 'audio/midi', mp3: 'audio/mpeg', oga: 'audio/ogg', ogg: 'audio/ogg', wav: 'audio/wav', webm: 'audio/webm',
  },
};

export const inferPersonalMediaMimeType = (kind: MediaKind, filename: string) => {
  const extension = filename.split('.').at(-1)?.toLowerCase() ?? '';
  return MIME_BY_EXTENSION[kind][extension] ?? '';
};

const slug = (filename: string) => filename.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'asset';

const makeEntry = <T extends { filename: string; title: string; src: string; durationSeconds?: number; poster?: string }>(
  kind: MediaKind,
  value: T,
  artist?: string,
): PersonalMediaEntry => {
  const id = `personal-${kind}-${slug(value.filename)}`;
  const mimeType = inferPersonalMediaMimeType(kind, value.filename);
  return {
    id,
    kind,
    filename: value.filename,
    mimeType,
    artist,
    asset: {
      id,
      projectId: 0,
      kind,
      title: value.title,
      source: value.src,
      mimeType,
      ...(value.durationSeconds === undefined ? {} : { durationSeconds: value.durationSeconds }),
      ...(value.poster ? { poster: value.poster } : {}),
      ...(artist ? { description: artist } : {}),
    },
  };
};

export const createPersonalMediaEntries = (
  videos: PersonalVideo[] = PERSONAL_VIDEOS,
  pictures: PersonalPicture[] = PERSONAL_PICTURES,
  music: PersonalMusicTrack[] = PERSONAL_MUSIC,
): PersonalMediaEntry[] => [
  ...videos.map(item => makeEntry('video', item)),
  ...pictures.map(item => makeEntry('image', item)),
  ...music.map(item => makeEntry('audio', item, item.artist)),
];

export const PERSONAL_MEDIA_ENTRIES = createPersonalMediaEntries();

export const getPlayablePersonalMediaEntries = (entries = PERSONAL_MEDIA_ENTRIES) => entries
  .filter(entry => isBundledMediaSource(entry.asset) && isSupportedMediaMimeType(entry.kind, entry.mimeType));

export const getPersonalMediaAssets = (kind?: MediaKind) => getPlayablePersonalMediaEntries()
  .filter(entry => !kind || entry.kind === kind)
  .map(entry => entry.asset);
