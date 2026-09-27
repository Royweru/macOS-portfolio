'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject, SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import Button95 from '../../components/win95/Button95';
import type { MediaAsset } from '../../features/media/media-types';
import { adjacentMediaAsset, buildPlayableMediaList, formatMediaDuration, mediaAssetFilename, mediaAssetKey } from '../../features/media/media-playlist';
import { useReducedMotion97 } from '../../hooks/useReducedMotion97';
import { useOsStore } from '../../features/os/os-store';
import { hasDismissedCodecNotice97, rememberCodecNoticeDismissal97 } from './codec-notice-preference97';
import { getServerShellDialogLayer97, getShellDialogLayer97, subscribeShellDialogLayer97 } from '../../shell/dialog-layer97';
import MediaUnavailable97 from './MediaUnavailable97';
import { describeMediaFailure97, type MediaFailure97, type MediaFailureLike97 } from './media-failure97';
import { pauseMedia97 } from './media-player-lifecycle97';
import { mediaAssetFromUrl97 } from './media-url97';
import { toggleMediaFavorite97 } from './media-player-favorites97';

const STITCH_PREVIEW_TRACKS = [
  { name: 'demo.avi', duration: '00:45', size: '14.3 MB' },
  { name: 'loop97.avi', duration: '00:18', size: '5.8 MB' },
  { name: 'intro3d.mov', duration: '01:12', size: '22.1 MB' },
];

function WireframeViewport({ playing }: { playing: boolean }) {
  return <div className="win97-media-demo" aria-label="3D engine demo preview">
    <svg className={playing ? 'win97-media-wireframe spinning' : 'win97-media-wireframe'} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <ellipse cx="50" cy="50" rx="42" ry="18" />
      <ellipse cx="50" cy="50" rx="35" ry="35" strokeDasharray="2,2" />
      <ellipse cx="50" cy="50" rx="18" ry="42" />
      <polygon points="50,10 85,75 15,75" stroke="#7BB3E8" strokeWidth=".5" />
      <polygon points="50,90 15,25 85,25" stroke="#F8D878" strokeWidth=".5" />
      <line stroke="#7BB3E8" x1="10" x2="90" y1="50" y2="50" />
      <line stroke="#7BB3E8" x1="50" x2="50" y1="10" y2="90" />
    </svg>
    <span className="win97-media-osd win97-media-osd-play">{playing ? 'PLAY ▶' : 'STOP ■'}</span>
    <span className="win97-media-osd win97-media-osd-engine">3D-ENGINE DEMO v1.0</span>
    <small className="win97-media-meta-left">320x240 Cinepak Codec | 15.0 fps</small>
    <small className="win97-media-meta-right">RECORDED 1997-10-14</small>
  </div>;
}

interface MediaPlayer97Props {
  asset?: MediaAsset;
  availableAssets?: MediaAsset[];
  onClose?: () => void;
}

export default function MediaPlayer97({ asset, availableAssets = [], onClose }: MediaPlayer97Props) {
  const mediaRef = useRef<HTMLMediaElement>(null);
  const compactWindowRef = useRef<HTMLElement>(null);
  const compactDragRef = useRef<{ pointerId: number; startX: number; startY: number; offsetX: number; offsetY: number; left: number; right: number; top: number; bottom: number; host: DOMRect } | null>(null);
  const library = useMemo(() => buildPlayableMediaList(availableAssets), [availableAssets]);
  const [playlist, setPlaylist] = useState<MediaAsset[]>(() => buildPlayableMediaList([], asset));
  const [selectedKey, setSelectedKey] = useState<string | null>(() => {
    const openedAsset = buildPlayableMediaList([], asset)[0];
    return openedAsset ? mediaAssetKey(openedAsset) : null;
  });
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(() => playlist[0]?.durationSeconds ?? 0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [mediaFailure, setMediaFailure] = useState<MediaFailure97 | null>(null);
  const [bars, setBars] = useState([18, 42, 26, 58, 34, 48, 22, 48, 35, 24, 42]);
  const [showCodec, setShowCodec] = useState(() => !hasDismissedCodecNotice97());
  const [rememberCodecDismissal, setRememberCodecDismissal] = useState(false);
  const [showCompact, setShowCompact] = useState(true);
  const [compactOffset, setCompactOffset] = useState({ x: 0, y: 0 });
  const overlayHost = useSyncExternalStore(subscribeShellDialogLayer97, getShellDialogLayer97, getServerShellDialogLayer97);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [openMenu, setOpenMenu] = useState<'File' | 'Favorites' | null>(null);
  const [favoriteAssets, setFavoriteAssets] = useState<MediaAsset[]>([]);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  const [status, setStatus] = useState(() => playlist[0] ? 'Ready' : 'No media loaded');
  const appReducedMotion = useOsStore(state => state.settings.reducedMotion);
  const reducedMotion = useReducedMotion97(appReducedMotion);

  const activeAsset = playlist.find(item => mediaAssetKey(item) === selectedKey);
  const activeIsFavorite = Boolean(activeAsset && favoriteAssets.some(item => mediaAssetKey(item) === mediaAssetKey(activeAsset)));
  const unqueuedAssets = library.filter(item => !playlist.some(queued => mediaAssetKey(queued) === mediaAssetKey(item)));
  const selectedIndex = playlist.findIndex(item => mediaAssetKey(item) === selectedKey);
  const displayName = activeAsset ? mediaAssetFilename(activeAsset) : 'No media loaded';
  const displayDuration = duration || activeAsset?.durationSeconds || 0;

  useEffect(() => {
    const media = mediaRef.current;
    return () => pauseMedia97(media);
  }, [activeAsset?.source]);

  useEffect(() => {
    if (!mediaRef.current) return;
    mediaRef.current.volume = volume;
    mediaRef.current.muted = muted;
  }, [volume, muted, selectedKey]);

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }
    const timer = window.setInterval(() => setBars((currentBars) => currentBars.map(() => playing ? 12 + Math.floor(Math.random() * 55) : 8)), 140);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const stop = () => {
    const media = mediaRef.current;
    if (media) {
      media.pause();
      try { media.currentTime = 0; } catch { /* The resource may not have loaded metadata yet. */ }
    }
    setCurrent(0);
    setPlaying(false);
    setStatus(activeAsset ? 'Stopped' : 'No media loaded');
  };

  const selectAsset = (nextAsset: MediaAsset | null) => {
    const media = mediaRef.current;
    if (media) {
      media.pause();
      try { media.currentTime = 0; } catch { /* The next source will begin at its start. */ }
    }
    setSelectedKey(nextAsset ? mediaAssetKey(nextAsset) : null);
    setCurrent(0);
    setDuration(nextAsset?.durationSeconds ?? 0);
    setMediaFailure(null);
    setPlaying(false);
    setStatus(nextAsset ? `Ready: ${nextAsset.title}` : 'No media loaded');
  };

  const toggle = () => {
    const media = mediaRef.current;
    if (!activeAsset || !media) { setStatus('No media loaded'); return; }
    if (media.paused) {
      void media.play().then(() => {
        setMediaFailure(null);
        setPlaying(true);
        setStatus(`Playing: ${activeAsset.title}`);
      }).catch((error: unknown) => {
        setPlaying(false);
        const failure = describeMediaFailure97(error && typeof error === 'object' ? error as MediaFailureLike97 : null);
        setMediaFailure(failure);
        setStatus(failure.status);
      });
    } else {
      media.pause();
      setPlaying(false);
      setStatus('Paused');
    }
  };

  const seek = (value: number) => {
    if (!mediaRef.current || !activeAsset || !Number.isFinite(value)) return;
    const maximum = mediaRef.current.duration || activeAsset.durationSeconds || value;
    const nextTime = Math.max(0, Math.min(value, maximum));
    try {
      mediaRef.current.currentTime = nextTime;
      setCurrent(nextTime);
    } catch {
      setStatus('Waiting for media metadata');
    }
  };

  const seekBy = (offset: number) => seek((mediaRef.current?.currentTime ?? current) + offset);
  const changeTrack = (direction: -1 | 1) => {
    const next = adjacentMediaAsset(playlist, selectedKey, direction);
    if (next) selectAsset(next);
    else setStatus(playlist.length ? 'Only one item in playlist' : 'No media loaded');
  };
  const addTrack = (item: MediaAsset) => {
    setPlaylist(currentPlaylist => buildPlayableMediaList([...currentPlaylist, item], item));
    selectAsset(item);
    setShowLibrary(false);
    setShowUrlDialog(false);
    setUrlError(null);
  };
  const removeTrack = () => {
    if (!activeAsset) return;
    const nextPlaylist = playlist.filter(item => mediaAssetKey(item) !== selectedKey);
    const nextAsset = nextPlaylist[Math.min(Math.max(selectedIndex, 0), nextPlaylist.length - 1)] ?? null;
    setPlaylist(nextPlaylist);
    selectAsset(nextAsset);
  };

  const onTimeUpdate = (event: SyntheticEvent<HTMLMediaElement>) => setCurrent(event.currentTarget.currentTime);
  const onMetadata = (event: SyntheticEvent<HTMLMediaElement>) => {
    setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0);
    setMediaFailure(null);
    setStatus(`Ready: ${activeAsset?.title ?? 'Media'}`);
  };
  const onEnded = () => { setPlaying(false); setStatus('Playback complete'); };
  const onMediaError = (event: SyntheticEvent<HTMLMediaElement>) => {
    const failure = describeMediaFailure97(event.currentTarget.error);
    setPlaying(false);
    setMediaFailure(failure);
    setStatus(failure.status);
  };
  const dismissCodecNotice = () => {
    if (rememberCodecDismissal) rememberCodecNoticeDismissal97();
    setRememberCodecDismissal(false);
    setShowCodec(false);
  };
  const openLibrary = () => { setOpenMenu(null); setShowLibrary(true); };
  const openUrlPrompt = () => { setOpenMenu(null); setUrlDraft(''); setUrlError(null); setShowUrlDialog(true); };
  const openMediaUrl = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const remoteAsset = mediaAssetFromUrl97(urlDraft);
    if (!remoteAsset) {
      setUrlError('Enter a direct HTTP(S) link to a supported audio or video file.');
      return;
    }
    addTrack(remoteAsset);
  };
  const onPlayerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setOpenMenu(null);
      if (showLibrary) setShowLibrary(false);
      if (showUrlDialog) setShowUrlDialog(false);
      if (showProperties) setShowProperties(false);
      return;
    }
    if (!event.ctrlKey && !event.metaKey) return;
    const target = event.target as HTMLElement;
    if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    const key = event.key.toLowerCase();
    if (key === 'o') { event.preventDefault(); openLibrary(); }
    else if (key === 'u') { event.preventDefault(); openUrlPrompt(); }
    else if (key === 'p') { event.preventDefault(); toggle(); }
    else if (key === 's') { event.preventDefault(); stop(); }
    else if (key === 'a' && activeAsset) { event.preventDefault(); mediaRef.current?.pause(); setPlaying(false); setStatus('Paused'); }
  };
  const startCompactDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('button') || !overlayHost || !compactWindowRef.current) return;
    const rect = compactWindowRef.current.getBoundingClientRect();
    compactDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: compactOffset.x,
      offsetY: compactOffset.y,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      host: overlayHost.getBoundingClientRect(),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveCompact = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = compactDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = Math.max(drag.host.left - drag.left, Math.min(drag.host.right - drag.right, event.clientX - drag.startX));
    const dy = Math.max(drag.host.top - drag.top, Math.min(drag.host.bottom - drag.bottom, event.clientY - drag.startY));
    setCompactOffset({ x: drag.offsetX + dx, y: drag.offsetY + dy });
  };
  const stopCompactDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (compactDragRef.current?.pointerId !== event.pointerId) return;
    compactDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const compactWindow = showCompact ? <aside ref={compactWindowRef} className="win97-media-compact" style={{ transform: `translate(${compactOffset.x}px, ${compactOffset.y}px)` }} aria-label="WMP Compact Mode">
    <header onPointerDown={startCompactDrag} onPointerMove={moveCompact} onPointerUp={stopCompactDrag} onPointerCancel={stopCompactDrag}><span>▥ WMP COMPACT MODE</span><div>
      <button type="button" aria-label="Minimize compact player" onClick={() => setShowCompact(false)}>_</button>
      <button type="button" aria-label="Close compact player" onClick={() => setShowCompact(false)}>×</button>
    </div></header>
    <div className="win97-media-compact-body">
      <div className="win97-media-compact-screen"><span>KBPS: 128</span><span>KHZ: 44.1</span><b>{activeAsset?.kind === 'video' ? 'VIDEO' : 'AUDIO'}</b><strong>*** {displayName.toUpperCase()} ***</strong><div>{bars.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div>
      <div className="win97-media-compact-controls"><Button95 size="sm" aria-label="Compact rewind" disabled={!activeAsset} onClick={() => seekBy(-10)}>◀◀</Button95><Button95 size="sm" aria-label="Compact play" disabled={!activeAsset} pressed={playing} onClick={toggle}>▶</Button95><Button95 size="sm" aria-label="Compact pause" disabled={!activeAsset} onClick={() => { mediaRef.current?.pause(); setPlaying(false); setStatus('Paused'); }}>❚❚</Button95><Button95 size="sm" aria-label="Compact stop" disabled={!activeAsset} onClick={stop}>■</Button95><Button95 size="sm" aria-label="Compact fast forward" disabled={!activeAsset} onClick={() => seekBy(10)}>▶▶</Button95></div>
    </div>
  </aside> : null;

  const codecDialog = showCodec ? <div className="win97-media-codec" role="dialog" aria-label="Codec Notice">
    <header><span>● Codec Notice</span><button type="button" aria-label="Close codec notice" onClick={dismissCodecNotice}>×</button></header>
    <div className="win97-media-codec-body"><strong>⚠</strong><p>Rendering hardware video acceleration is active. Weru Media Player 6.4 is operating in 16-bit True Color mode.<label><input type="checkbox" checked={rememberCodecDismissal} onChange={event => setRememberCodecDismissal(event.target.checked)} /> Don't show this again</label></p></div>
    <footer><Button95 size="sm" onClick={dismissCodecNotice}>OK</Button95></footer>
  </div> : null;

  return <>
  <div className="win97-app win97-media-player win97-media-surface" onKeyDown={onPlayerKeyDown}>
    <div className="win95-menubar win97-media-menubar">
      <div className="win97-media-file-menu-wrap">
        <button type="button" aria-haspopup="menu" aria-expanded={openMenu === 'File'} onClick={() => setOpenMenu(current => current === 'File' ? null : 'File')}><u>F</u>ile</button>
        {openMenu === 'File' && <div className="win97-media-file-menu" role="menu" aria-label="Media Player File menu">
          <button type="button" role="menuitem" onClick={openLibrary}><span><u>O</u>pen...</span><kbd>Ctrl+O</kbd></button>
          <button type="button" role="menuitem" onClick={openUrlPrompt}><span>Open <u>U</u>RL...</span><kbd>Ctrl+U</kbd></button>
          <hr />
          <button type="button" role="menuitem" disabled={!activeAsset} onClick={() => { setOpenMenu(null); toggle(); }}><span>▶ <u>P</u>lay</span><kbd>Ctrl+P</kbd></button>
          <button type="button" role="menuitem" disabled={!activeAsset} onClick={() => { setOpenMenu(null); stop(); }}><span><u>S</u>top</span><kbd>Ctrl+S</kbd></button>
          <button type="button" role="menuitem" disabled={!activeAsset || !playing} onClick={() => { setOpenMenu(null); mediaRef.current?.pause(); setPlaying(false); setStatus('Paused'); }}><span>Pause</span><kbd>Ctrl+A</kbd></button>
          <hr />
          <button type="button" role="menuitem" disabled={!activeAsset} onClick={() => { setOpenMenu(null); setShowProperties(true); }}><span>P<u>r</u>operties</span></button>
          <hr />
          <button type="button" role="menuitem" onClick={() => { setOpenMenu(null); onClose?.(); }}><span>E<u>x</u>it</span></button>
        </div>}
      </div>
      <button type="button" onClick={() => { setOpenMenu(null); setShowPlaylist(value => !value); }}><u>E</u>dit</button>
      <button type="button" onClick={() => { setOpenMenu(null); setShowCompact(value => !value); }}><u>V</u>iew</button>
      <button type="button" onClick={() => { setOpenMenu(null); toggle(); }}><u>P</u>lay</button>
      <div className="win97-media-file-menu-wrap">
        <button type="button" aria-haspopup="menu" aria-expanded={openMenu === 'Favorites'} onClick={() => setOpenMenu(current => current === 'Favorites' ? null : 'Favorites')}><u>F</u>avorites</button>
        {openMenu === 'Favorites' && <div className="win97-media-file-menu" role="menu" aria-label="Media Player Favorites menu">
          <button type="button" role="menuitem" disabled={!activeAsset} onClick={() => { if (activeAsset) setFavoriteAssets(current => toggleMediaFavorite97(current, activeAsset)); setOpenMenu(null); }}>
            <span>{activeIsFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
          </button>
          <hr />
          {favoriteAssets.length
            ? favoriteAssets.map(item => <button key={mediaAssetKey(item)} type="button" role="menuitem" onClick={() => { addTrack(item); setOpenMenu(null); }}><span>{mediaAssetFilename(item)}</span></button>)
            : <button type="button" role="menuitem" disabled><span>No favorites this session</span></button>}
        </div>}
      </div>
      <button type="button" onClick={() => { setOpenMenu(null); setRememberCodecDismissal(false); setShowCodec(true); }}><u>H</u>elp</button>
    </div>

    <div className="win97-media-main win97-media-main-stitch">
      <div className="win97-media-primary">
        <div className="win97-media-screen win97-media-screen-stitch">
          {activeAsset?.kind === 'video'
            ? <>
              <video ref={mediaRef as RefObject<HTMLVideoElement>} className="win97-media-video" src={activeAsset.source} poster={activeAsset.poster} aria-label={activeAsset.title} preload="metadata" playsInline onTimeUpdate={onTimeUpdate} onLoadedMetadata={onMetadata} onEnded={onEnded} onError={onMediaError}>{activeAsset.captionSource && <track kind="captions" src={activeAsset.captionSource} />}</video>
              {mediaFailure && <MediaUnavailable97 asset={activeAsset} failure={mediaFailure} />}
            </>
            : <WireframeViewport playing={playing && !reducedMotion} />}
          {activeAsset?.kind === 'audio' && <audio ref={mediaRef as RefObject<HTMLAudioElement>} src={activeAsset.source} preload="metadata" onTimeUpdate={onTimeUpdate} onLoadedMetadata={onMetadata} onEnded={onEnded} onError={onMediaError} />}
        </div>
        <div className="win97-media-seek-row">
          <input aria-label="Seek" type="range" min="0" max={displayDuration} step="0.1" value={Math.min(current, displayDuration || 0)} disabled={!activeAsset || !displayDuration} onChange={event => seek(Number(event.target.value))} />
          <b>{displayDuration ? `${Math.round(current / displayDuration * 100)}%` : '0%'}</b>
        </div>
      </div>

      {showPlaylist && <aside className="win97-media-playlist win97-media-playlist-stitch" aria-label="Playlist">
        <header><span>Playlist</span><small>({playlist.length || STITCH_PREVIEW_TRACKS.length} items)</small></header>
        <div className="win97-media-playlist-items">
          {playlist.length > 0
            ? playlist.map((item, index) => <button type="button" key={mediaAssetKey(item)} className={mediaAssetKey(item) === selectedKey ? 'selected' : ''} onClick={() => selectAsset(item)}>
              <b>{index + 1}. {mediaAssetFilename(item)}</b><span><small>{formatMediaDuration(item.durationSeconds)}</small><small>{item.kind.toUpperCase()}</small></span>
            </button>)
            : STITCH_PREVIEW_TRACKS.map((item, index) => <button type="button" key={item.name} disabled title="Open an audio or video file to play it.">
              <b>{index + 1}. {item.name}</b><span><small>{item.duration}</small><small>{item.size}</small></span>
            </button>)}
        </div>
        <footer><Button95 size="sm" onClick={() => setShowLibrary(true)}>Add</Button95><Button95 size="sm" disabled={!activeAsset} onClick={removeTrack}>Rem</Button95><Button95 size="sm" pressed={showPlaylist} onClick={() => setShowPlaylist(value => !value)}>List</Button95></footer>
      </aside>}
    </div>

    <div className="win97-media-transport">
      <div className="win97-media-transport-buttons">
        <Button95 size="sm" aria-label="Play" disabled={!activeAsset} pressed={playing} onClick={toggle}>▶</Button95>
        <Button95 size="sm" aria-label="Pause" disabled={!activeAsset} onClick={() => { mediaRef.current?.pause(); setPlaying(false); setStatus('Paused'); }}>❚❚</Button95>
        <Button95 size="sm" aria-label="Stop" disabled={!activeAsset} onClick={stop}>■</Button95>
        <i />
        <Button95 size="sm" aria-label="Previous" disabled={playlist.length < 2} onClick={() => changeTrack(-1)}>|◀</Button95>
        <Button95 size="sm" aria-label="Next" disabled={playlist.length < 2} onClick={() => changeTrack(1)}>▶|</Button95>
        <Button95 size="sm" aria-label="Eject" disabled={!activeAsset} onClick={() => selectAsset(null)}>⏏</Button95>
      </div>
      <output className="win97-media-time-readout">{formatMediaDuration(current)} / {formatMediaDuration(displayDuration)}</output>
      <div className="win97-media-volume"><button type="button" className="win97-media-mute" aria-label={muted ? 'Unmute' : 'Mute'} aria-pressed={muted} onClick={() => setMuted(value => !value)}>{muted ? '🔇' : '🔊'}</button><input aria-label="Volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={event => setVolume(Number(event.target.value))} /><Button95 size="sm" onClick={() => setShowCompact(value => !value)}>100%</Button95></div>
    </div>

    <div className="win97-media-status-stitch"><span aria-live="polite"><i />{status}</span><b>{formatMediaDuration(current)}</b><b>{activeAsset?.mimeType ?? 'No media'}</b><b>{activeAsset ? 'Ready' : 'Stereo 22kHz'}</b></div>

    {!overlayHost && compactWindow}
    {!overlayHost && codecDialog}

    {showLibrary && <div className="win97-media-library-dialog" role="dialog" aria-modal="true" aria-label="Media Library">
      <header><span>Open Media</span><button type="button" aria-label="Close media library" onClick={() => setShowLibrary(false)}>×</button></header>
      <div className="win97-media-library-list">
        {unqueuedAssets.length > 0
          ? unqueuedAssets.map(item => <button key={mediaAssetKey(item)} type="button" onClick={() => addTrack(item)}><b>{mediaAssetFilename(item)}</b><small>{item.kind.toUpperCase()} · {item.mimeType}</small></button>)
          : <p>No personal media is available. Add files under public/media/videos and register them in PERSONAL_VIDEOS, or open a media file from Explorer.</p>}
      </div>
      <footer><Button95 size="sm" onClick={() => setShowLibrary(false)}>Cancel</Button95></footer>
    </div>}
    {showUrlDialog && <form className="win97-media-library-dialog win97-media-url-dialog" role="dialog" aria-modal="true" aria-label="Open Media URL" onSubmit={openMediaUrl}>
      <header><span>Open URL</span><button type="button" aria-label="Close URL dialog" onClick={() => setShowUrlDialog(false)}>×</button></header>
      <label>Media URL<input autoFocus value={urlDraft} onChange={event => { setUrlDraft(event.target.value); setUrlError(null); }} aria-invalid={Boolean(urlError)} aria-describedby={urlError ? 'win97-media-url-error' : 'win97-media-url-help'} /></label>
      <small id={urlError ? 'win97-media-url-error' : 'win97-media-url-help'} role={urlError ? 'alert' : undefined}>{urlError ?? 'Enter a direct HTTP(S) link to an MP4, WebM, Ogg, AVI, MP3, WAV, or MIDI file.'}</small>
      <footer><Button95 size="sm" type="button" onClick={() => setShowUrlDialog(false)}>Cancel</Button95><Button95 size="sm" type="submit">Open</Button95></footer>
    </form>}
    {showProperties && activeAsset && <div className="win97-media-library-dialog win97-media-properties-dialog" role="dialog" aria-modal="true" aria-label="Media Properties">
      <header><span>Properties</span><button type="button" aria-label="Close properties" onClick={() => setShowProperties(false)}>×</button></header>
      <dl><dt>Name</dt><dd>{mediaAssetFilename(activeAsset)}</dd><dt>Type</dt><dd>{activeAsset.mimeType}</dd><dt>Location</dt><dd title={activeAsset.source}>{activeAsset.source}</dd><dt>Duration</dt><dd>{formatMediaDuration(displayDuration)}</dd></dl>
      <footer><Button95 size="sm" onClick={() => setShowProperties(false)}>OK</Button95></footer>
    </div>}
  </div>
  {overlayHost && compactWindow ? createPortal(compactWindow, overlayHost) : null}
  {overlayHost && codecDialog ? createPortal(codecDialog, overlayHost) : null}
  </>;
}
