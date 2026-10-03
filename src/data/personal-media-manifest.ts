import type { MediaAsset, MediaKind } from '../features/media/media-types';
import { isBundledMediaSource, isSupportedMediaMimeType, normalizeMediaSource } from '../features/media/media-types';

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
export const PERSONAL_VIDEOS: PersonalVideo[] = [
  {
    filename: "MoniePal video.mp4",
    title: "Showing moniepal process from login to sale register",
    src: "/media/videos/moniepal_update_1.mp4"
  }
];

export const PERSONAL_PICTURES: PersonalPicture[] = [
  {
    filename: "profile_pic.png",
    title: "Weru profile picture",
    src: "/media/pictures/profile_pic.png"
  }
];

export const PERSONAL_MUSIC: PersonalMusicTrack[] = [
  {
    filename: "crystal_skies.mp3",
    title: "crystal skies",
    artist: "vxllain",
    src: "/media/music/crystal_skies.mp3"
  },
];

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

const extractExtension = (pathOrName: string): string => {
  const clean = pathOrName.split(/[?#]/, 1)[0];
  const lastPart = clean.split('/').filter(Boolean).at(-1) ?? clean;
  if (!lastPart.includes('.')) return '';
  return lastPart.split('.').at(-1)?.toLowerCase() ?? '';
};

export const inferPersonalMediaMimeType = (kind: MediaKind, filename: string, fallbackSrc?: string) => {
  let extension = extractExtension(filename);
  if (!extension || !MIME_BY_EXTENSION[kind][extension]) {
    if (fallbackSrc) {
      const srcExtension = extractExtension(fallbackSrc);
      if (srcExtension && MIME_BY_EXTENSION[kind][srcExtension]) {
        extension = srcExtension;
      }
    }
  }
  return MIME_BY_EXTENSION[kind][extension] ?? '';
};

const ensurePersonalFilenameExtension = (filename: string, src: string, kind: MediaKind): string => {
  if (filename.includes('.')) return filename;
  const srcExt = extractExtension(src);
  if (srcExt) return `${filename}.${srcExt}`;
  const defaultExt: Record<MediaKind, string> = { video: 'mp4', image: 'png', audio: 'mp3' };
  return `${filename}.${defaultExt[kind]}`;
};

const slug = (filename: string) => filename.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'asset';

const makeEntry = <T extends { filename: string; title: string; src: string; durationSeconds?: number; poster?: string }>(
  kind: MediaKind,
  value: T,
  artist?: string,
): PersonalMediaEntry => {
  const normalizedSrc = normalizeMediaSource(kind, value.src);
  const mimeType = inferPersonalMediaMimeType(kind, value.filename, normalizedSrc);
  const resolvedFilename = ensurePersonalFilenameExtension(value.filename, normalizedSrc, kind);
  const id = `personal-${kind}-${slug(resolvedFilename)}`;
  return {
    id,
    kind,
    filename: resolvedFilename,
    mimeType,
    artist,
    asset: {
      id,
      projectId: 0,
      kind,
      title: value.title,
      source: normalizedSrc,
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
