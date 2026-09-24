'use client';

import { useMemo, useState } from 'react';
import Button95 from '../../components/win95/Button95';
import { isAllowedExternalUrl } from '../../features/os/open-target';
import { useVisitorCount } from '../../os/visitors/useVisitorCount';
import AppIcon from '../../components/AppIcon';

const HOME_URL = 'https://weru.dev/';
const LINK_TARGETS = [
  { label: 'Best of the Web', url: 'https://github.com/Royweru', description: 'GitHub profile and source code' },
  { label: 'Channel Guide', url: 'https://www.linkedin.com/in/roy-matheri-59b8a5245', description: 'Professional network' },
  { label: 'Customize Links', url: 'https://github.com/Royweru', description: 'Projects and experiments' },
  { label: 'Internet Explorer News', url: 'https://github.com/Royweru', description: 'Updates from the Weru portfolio' },
];

const normalizeAddress = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return HOME_URL;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export default function RetroBrowser97({ initialAddress = HOME_URL, onOpenApp }: { initialAddress?: string; onOpenApp?: (appId: string) => void }) {
  const visitorCount = useVisitorCount();
  const [address, setAddress] = useState(initialAddress);
  const [draft, setDraft] = useState(initialAddress);
  const [history, setHistory] = useState<string[]>([initialAddress]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [status, setStatus] = useState('Done');
  const [reloadToken, setReloadToken] = useState(0);
  const [previewRunning, setPreviewRunning] = useState(true);

  const isHome = useMemo(() => address === HOME_URL || address === 'weru://home', [address]);
  const displayAddress = isHome ? HOME_URL : address;

  const navigate = (value: string) => {
    const next = normalizeAddress(value);
    if (!isAllowedExternalUrl(next) && next !== HOME_URL) {
      setStatus('Cannot open this address in Weru 97');
      return;
    }
    const nextHistory = [...history.slice(0, historyIndex + 1), next];
    setAddress(next);
    setDraft(next);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setPreviewRunning(true);
    setReloadToken(token => token + 1);
    setStatus(next === HOME_URL ? 'Done' : 'Connecting…');
  };

  const moveHistory = (direction: -1 | 1) => {
    const nextIndex = historyIndex + direction;
    if (nextIndex < 0 || nextIndex >= history.length) return;
    setHistoryIndex(nextIndex);
    setAddress(history[nextIndex]);
    setDraft(history[nextIndex]);
    setPreviewRunning(true);
    setReloadToken(token => token + 1);
    setStatus(history[nextIndex] === HOME_URL ? 'Done' : 'Connecting…');
  };

  const refresh = () => {
    if (isHome) {
      setStatus('Done');
      return;
    }
    setPreviewRunning(true);
    setReloadToken(token => token + 1);
    setStatus('Refreshing…');
  };

  return <div className="win97-app win97-browser win97-ie4">
    <div className="win95-menubar win97-browser-menubar"><button type="button">File</button><button type="button">Edit</button><button type="button">View</button><button type="button">Go</button><button type="button">Favorites</button><button type="button">Help</button></div>
    <div className="win97-browser-toolbar" role="toolbar" aria-label="Internet Explorer toolbar">
      <Button95 size="sm" aria-label="Back" disabled={historyIndex <= 0} onClick={() => moveHistory(-1)}>◀ Back</Button95>
      <Button95 size="sm" aria-label="Forward" disabled={historyIndex >= history.length - 1} onClick={() => moveHistory(1)}>Forward ▶</Button95>
      <Button95 size="sm" aria-label="Up" onClick={() => navigate(HOME_URL)}>⬆ Up</Button95>
      <span className="win97-toolbar-divider" />
      <Button95 size="sm" aria-label="Stop" onClick={() => { setPreviewRunning(false); setStatus('Stopped'); }}>■ Stop</Button95>
      <Button95 size="sm" aria-label="Refresh" onClick={refresh}>↻ Refresh</Button95>
      <Button95 size="sm" aria-label="Home" onClick={() => navigate(HOME_URL)}>⌂ Home</Button95>
      <Button95 size="sm" aria-label="Search" onClick={() => setStatus('Search unavailable')}>⌕ Search</Button95>
      <Button95 size="sm" aria-label="Favorites" onClick={() => setStatus('Favorites')}>★ Favorites</Button95>
      <Button95 size="sm" aria-label="History" aria-expanded={historyOpen} onClick={() => setHistoryOpen(open => !open)}>▣ History</Button95>
      <Button95 size="sm" aria-label="Print" onClick={() => setStatus('Print unavailable')}>▤ Print</Button95>
      <Button95 size="sm" aria-label="Mail" disabled={!onOpenApp} onClick={() => onOpenApp?.('mail')}><AppIcon appId="mail" size={14} /> Mail</Button95>
    </div>
    <div className="win97-browser-address"><label htmlFor="ie4-address">Address</label><input id="ie4-address" value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') navigate(draft); }} /><Button95 size="sm" onClick={() => navigate(draft)}>▶ Go</Button95></div>

    {historyOpen && <aside className="win97-ie-history" aria-label="Browsing history"><b>Browsing history</b>{history.map((item, index) => <button type="button" key={`${item}-${index}`} onClick={() => { setHistoryIndex(index); setAddress(item); setDraft(item); setHistoryOpen(false); }}>{item}</button>)}</aside>}

    <main className="win97-browser-page">
      <div className="win97-ie-banner"><h2>★ My Links ★</h2><span>« Serving interactive web experiments, vintage codecraft &amp; digital art portfolios »</span></div>
      {isHome ? <>
        <p>Thank you for visiting my cyberspace corner! Click any link below to explore my external destinations or view the portfolio projects.</p>
        <div className="win97-ie-construction">⚒ UNDER CONTINUOUS CONSTRUCTION 1997–2024 ⚒</div>
        <div className="win97-browser-links">{LINK_TARGETS.map(link => <a key={link.label} href={link.url} onClick={event => { event.preventDefault(); navigate(link.url); }}><b>{link.label}</b><small>{link.description}</small></a>)}</div>
      </> : <section className="sunken win97-ie-external" aria-label="External website preview">
        <div className="win97-ie-preview-heading"><h3>Web page preview</h3><a href={displayAddress} target="_blank" rel="noopener noreferrer">Open in a new browser tab ↗</a></div>
        <code>{displayAddress}</code>
        <p className="win97-muted">Weru is previewing this site here when it allows embedding. Some sites block in-app previews; use “Open in a new browser tab” if the page is blank.</p>
        {previewRunning ? <iframe
          key={`${displayAddress}:${reloadToken}`}
          className="win97-ie-preview-frame"
          src={displayAddress}
          title={`Preview of ${displayAddress}`}
          sandbox="allow-forms allow-scripts allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer"
          onLoad={() => setStatus('Preview loaded; embedding may be restricted')}
        /> : <div className="win97-ie-preview-stopped" role="status">Preview stopped. <button type="button" onClick={refresh}>Reload preview</button></div>}
      </section>}
      <div className="win97-ie-badges"><span>Best viewed at 800×600</span><span>Enhanced for IE 4.0</span><span>Netscape Navigator Compatible</span></div>
      <p className="win97-ie-visitor">You are visitor number <b>{visitorCount ?? '—'}</b></p>
      <div className="win97-browser-page-footer"><span aria-live="polite">{status}</span><span>public Internet zone</span></div>
    </main>
  </div>;
}
