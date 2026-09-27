'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import Button95 from '../../components/win95/Button95';
import ExternalBrowserLink97 from '../../components/ExternalBrowserLink97';
import ExternalHandoff97 from './ExternalHandoff97';
import { isAllowedExternalUrl, openExternalUrlInNewTab } from '../../features/os/open-target';
import { useVisitorCount } from '../../os/visitors/useVisitorCount';
import AppIcon from '../../components/AppIcon';
import { PROFILE, PROJECTS } from '../../data/portfolio-manifest';
import { buildIeSearchUrl97 } from './ie-search97';
import { mountIePrintSurface97 } from './ie-print97';
import { appendIeHistory97, stepIeHistory97 } from './ie-navigation97';
import { resolveIeShortcut97 } from './ie-shortcuts97';

const HOME_URL = 'https://weru.dev/';
const QUICK_LINKS = [
  { label: 'Best of the Web', href: PROFILE.github, external: true },
  { label: 'Channel Guide', href: PROFILE.linkedin, external: true },
  { label: 'Customize Links', href: '#weru-link-directory', external: false },
  { label: 'X / Twitter', href: PROFILE.x, external: true },
];
type IeMenuName = 'File' | 'Edit' | 'View' | 'Go' | 'Favorites' | 'Help';
type IeMenuCommand = 'new-window' | 'open-address' | 'print' | 'close' | 'select-page' | 'copy-address' | 'toggle-quick-links' | 'toggle-status' | 'refresh' | 'back' | 'forward' | 'home' | 'search' | 'favorites' | 'about';
const IE_MENU_NAMES: IeMenuName[] = ['File', 'Edit', 'View', 'Go', 'Favorites', 'Help'];
const IE_MENU_ITEMS: Record<Exclude<IeMenuName, 'Favorites'>, Array<{ label: string; command?: IeMenuCommand; shortcut?: string; separator?: boolean }>> = {
  File: [
    { label: 'New Window', command: 'new-window', shortcut: 'Ctrl+N' },
    { label: 'Open Address…', command: 'open-address', shortcut: 'Ctrl+L' },
    { label: '', separator: true },
    { label: 'Print…', command: 'print', shortcut: 'Ctrl+P' },
    { label: 'Close', command: 'close', shortcut: 'Alt+F4' },
  ],
  Edit: [
    { label: 'Select All Page Text', command: 'select-page', shortcut: 'Ctrl+A' },
    { label: 'Copy Address', command: 'copy-address', shortcut: 'Ctrl+C' },
  ],
  View: [
    { label: 'Quick Links Bar', command: 'toggle-quick-links' },
    { label: 'Status Bar', command: 'toggle-status' },
    { label: '', separator: true },
    { label: 'Refresh', command: 'refresh', shortcut: 'F5' },
  ],
  Go: [
    { label: 'Back', command: 'back', shortcut: 'Alt+←' },
    { label: 'Forward', command: 'forward', shortcut: 'Alt+→' },
    { label: 'Home', command: 'home', shortcut: 'Alt+Home' },
    { label: 'Search the Web…', command: 'search' },
  ],
  Help: [
    { label: 'About Internet Explorer', command: 'about' },
  ],
};
const DIRECTORY_LINKS = [
  { label: 'Email Weru', detail: PROFILE.email, icon: '✉', kind: 'mail' as const },
  { label: 'GitHub Profile', detail: 'github.com/Royweru', icon: '⌘', href: PROFILE.github, kind: 'external' as const },
  { label: 'LinkedIn Network', detail: 'linkedin.com/in/roy-matheri', icon: 'in', href: PROFILE.linkedin, kind: 'external' as const },
  { label: 'X / Twitter', detail: 'x.com/RoyWeru', icon: 'X', href: PROFILE.x, kind: 'external' as const },
  ...PROJECTS.filter(project => project.live).map(project => ({
    label: `${project.title} — Live`,
    detail: project.live!.replace(/^https?:\/\//, ''),
    icon: '▶',
    href: project.live!,
    kind: 'external' as const,
  })),
];

function IeGlobeBadge97() {
  return <span className="win97-ie-globe-badge" role="img" aria-label="Internet Explorer globe">
    <svg className="win97-ie-globe" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="#1556c0" stroke="#001d68" />
      <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="#d8efff" strokeWidth="1" />
      <path d="M3 12h18M5.2 7h13.6M5.2 17h13.6" fill="none" stroke="#d8efff" strokeWidth="1" />
      <path className="win97-ie-globe-orbit" d="M3.5 14.5c4-5.5 10.5-6.5 17-2.8" fill="none" stroke="#72d34b" strokeWidth="2.2" />
    </svg>
  </span>;
}

const normalizeAddress = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return HOME_URL;
  if (trimmed.toLowerCase() === 'weru://home') return 'weru://home';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export default function RetroBrowser97({ initialAddress = HOME_URL, onOpenApp, onClose }: { initialAddress?: string; onOpenApp?: (appId: string) => void; onClose?: () => void }) {
  const visitorCount = useVisitorCount();
  // Weru's IE window is a portfolio launcher, not an embedded web view. Even
  // when callers supply an external URL, keep this surface on its own home page.
  const safeInitialAddress = initialAddress === 'weru://home' ? initialAddress : HOME_URL;
  const [address, setAddress] = useState(safeInitialAddress);
  const [draft, setDraft] = useState(safeInitialAddress);
  const [history, setHistory] = useState<string[]>([safeInitialAddress]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<IeMenuName | null>(null);
  const [showQuickLinks, setShowQuickLinks] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [externalHandoffUrl, setExternalHandoffUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('Done');
  const addressInputRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const printCleanupRef = useRef<(() => void) | null>(null);
  const isHome = address === HOME_URL || address === 'weru://home';
  const requestExternalHandoff = (url: string) => {
    if (!isAllowedExternalUrl(url)) {
      setExternalHandoffUrl(null);
      setStatus('This address could not be opened. Check that it is an HTTP or HTTPS URL.');
      return;
    }
    const requested = openExternalUrlInNewTab(url);
    // Keep the real anchor available even when the browser blocks window.open.
    setExternalHandoffUrl(url);
    setStatus(requested
      ? 'Opened in a new browser tab. Use Open in browser if it did not appear.'
      : 'The browser blocked the new tab. Use Open in browser to continue.');
  };

  const navigate = (value: string) => {
    const next = normalizeAddress(value);
    if (!isAllowedExternalUrl(next) && next !== HOME_URL && next !== 'weru://home') {
      setStatus('Cannot open this address in Weru 97');
      return;
    }
    if (next !== HOME_URL && next !== 'weru://home') {
      // Hand off external navigation to the user's browser. Do not render an
      // imitation "external page" inside the OS or pollute IE's local history.
      requestExternalHandoff(next);
      return;
    }
    setExternalHandoffUrl(null);
    const nextHistory = appendIeHistory97(history, historyIndex, next);
    setHistory(nextHistory.entries);
    setHistoryIndex(nextHistory.index);
    setAddress(next);
    setDraft(next === 'weru://home' ? HOME_URL : next);
    setStatus('Done');
  };

  const openHistoryAddress = (value: string, index: number) => {
    if (value !== HOME_URL && value !== 'weru://home') {
      requestExternalHandoff(value);
      return;
    }
    setExternalHandoffUrl(null);
    setHistoryIndex(index);
    setDraft(value === 'weru://home' ? HOME_URL : value);
    setAddress(value);
    setStatus('Done');
  };

  const moveHistory = (direction: -1 | 1) => {
    const next = stepIeHistory97(history, historyIndex, direction);
    if (!next) return;
    openHistoryAddress(next.address, next.index);
  };

  const refresh = () => {
    if (isHome) {
      setStatus('Done');
      return;
    }
    requestExternalHandoff(address);
  };
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const destination = buildIeSearchUrl97(searchQuery);
    if (!destination) {
      setStatus('Enter a search term.');
      return;
    }
    navigate(destination);
    setSearchOpen(false);
    setFavoritesOpen(false);
  };
  const printCurrentPage = () => {
    const page = pageRef.current;
    if (!page || typeof window === 'undefined') {
      setStatus('Print is unavailable in this browser.');
      return;
    }

    printCleanupRef.current?.();
    const removeSurface = mountIePrintSurface97(page, page.ownerDocument);
    const cleanup = () => {
      window.removeEventListener('afterprint', cleanup);
      removeSurface();
      if (printCleanupRef.current === cleanup) printCleanupRef.current = null;
    };
    printCleanupRef.current = cleanup;
    window.addEventListener('afterprint', cleanup, { once: true });
    setStatus('Print preview contains this page only.');

    try {
      window.print();
    } catch {
      cleanup();
      setStatus('Could not open the browser print dialog.');
    }
  };

  const runMenuCommand = (command: IeMenuCommand) => {
    setActiveMenu(null);
    switch (command) {
      case 'new-window': onOpenApp?.('ie4'); break;
      case 'open-address': addressInputRef.current?.focus(); addressInputRef.current?.select(); break;
      case 'print': printCurrentPage(); break;
      case 'close': onClose?.(); break;
      case 'select-page': {
        if (!pageRef.current) break;
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(pageRef.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
        setStatus('Page text selected');
        break;
      }
      case 'copy-address': {
        if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
          setStatus('Clipboard is unavailable in this browser.');
          break;
        }
        void navigator.clipboard.writeText(draft).then(() => setStatus('Address copied')).catch(() => setStatus('Could not copy the address.'));
        break;
      }
      case 'toggle-quick-links': setShowQuickLinks(value => !value); break;
      case 'toggle-status': setShowStatusBar(value => !value); break;
      case 'refresh': refresh(); break;
      case 'back': moveHistory(-1); break;
      case 'forward': moveHistory(1); break;
      case 'home': navigate(HOME_URL); break;
      case 'search': setFavoritesOpen(false); setSearchOpen(true); break;
      case 'favorites': setSearchOpen(false); setFavoritesOpen(true); break;
      case 'about': setAboutOpen(true); break;
    }
  };

  const handleShortcutKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const command = resolveIeShortcut97(event);
    if (!command) return;
    const target = event.target instanceof HTMLElement ? event.target : null;
    if ((command === 'select-page' || command === 'copy-address')
      && target?.matches('input, textarea, select, [contenteditable="true"]')) return;
    event.preventDefault();
    event.stopPropagation();
    runMenuCommand(command);
  };

  const toggleMenu = (menu: IeMenuName) => {
    setSearchOpen(false);
    setFavoritesOpen(false);
    setActiveMenu(current => current === menu ? null : menu);
  };

  useEffect(() => () => printCleanupRef.current?.(), []);

  return <div className="win97-app win97-browser win97-ie4" onKeyDown={handleShortcutKeyDown}>
    <div className="win95-menubar win97-browser-menubar" role="menubar" aria-label="Internet Explorer menus">
      {IE_MENU_NAMES.map(menu => <div className="win97-ie-menu-slot" key={menu}>
        <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded={activeMenu === menu} onClick={() => toggleMenu(menu)} onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActiveMenu(menu); } if (event.key === 'Escape') setActiveMenu(null); }}>
          {menu === 'Favorites' ? <>Fa<u>v</u>orites</> : <><u>{menu[0]}</u>{menu.slice(1)}</>}
        </button>
        {activeMenu === menu && <div className="win97-ie-menu-popup" role="menu" aria-label={`${menu} menu`} onKeyDown={event => {
          if (event.key === 'Escape') { event.preventDefault(); setActiveMenu(null); return; }
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          const items = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemcheckbox"]')].filter(item => !item.hasAttribute('disabled'));
          if (!items.length) return;
          event.preventDefault();
          const current = items.indexOf(document.activeElement as HTMLElement);
          const step = event.key === 'ArrowDown' ? 1 : -1;
          items[(current + step + items.length) % items.length]?.focus();
        }}>
          {menu === 'Favorites'
            ? DIRECTORY_LINKS.filter(link => link.kind === 'external').map(link => <ExternalBrowserLink97 key={link.label} role="menuitem" href={link.href} onClick={() => setActiveMenu(null)}>{link.label}</ExternalBrowserLink97>)
            : IE_MENU_ITEMS[menu].map((item, index) => {
              if (item.separator) return <hr key={`separator-${index}`} />;
              const command = item.command!;
              const disabled = (command === 'new-window' && !onOpenApp) || (command === 'close' && !onClose) || (command === 'back' && historyIndex <= 0) || (command === 'forward' && historyIndex >= history.length - 1);
              const checked = command === 'toggle-quick-links' ? showQuickLinks : command === 'toggle-status' ? showStatusBar : undefined;
              const checkable = command === 'toggle-quick-links' || command === 'toggle-status';
              return <button key={command} type="button" role={checkable ? 'menuitemcheckbox' : 'menuitem'} aria-checked={checkable ? checked : undefined} disabled={disabled} onClick={() => runMenuCommand(command)}><span>{checkable && checked ? '✓ ' : ''}{item.label}</span>{item.shortcut && <small>{item.shortcut}</small>}</button>;
            })}
        </div>}
      </div>)}
    </div>
    <div className="win97-ie-toolbar-region">
      <div className="win97-browser-toolbar" role="toolbar" aria-label="Internet Explorer toolbar">
        <Button95 size="sm" aria-label="Back" disabled={historyIndex <= 0} onClick={() => moveHistory(-1)}>◀ Back</Button95>
        <Button95 size="sm" aria-label="Forward" disabled={historyIndex >= history.length - 1} onClick={() => moveHistory(1)}>Forward ▶</Button95>
        <Button95 size="sm" aria-label="Up" onClick={() => navigate(HOME_URL)}>⬆ Up</Button95>
        <span className="win97-toolbar-divider" />
        <Button95 size="sm" aria-label="Stop" onClick={() => setStatus('External pages open in a separate browser tab.')}>■ Stop</Button95>
        <Button95 size="sm" aria-label="Refresh" onClick={refresh}>↻ Refresh</Button95>
        <Button95 size="sm" aria-label="Home" onClick={() => navigate(HOME_URL)}>⌂ Home</Button95>
        <Button95 size="sm" aria-label="Search" aria-expanded={searchOpen} aria-controls="win97-ie-search-popover" onClick={() => { setFavoritesOpen(false); setSearchOpen(open => !open); }}>⌕ Search</Button95>
        <Button95 size="sm" aria-label="Favorites" aria-expanded={favoritesOpen} aria-controls="win97-ie-favorites-popover" onClick={() => { setSearchOpen(false); setFavoritesOpen(open => !open); }}>★ Favorites</Button95>
        <Button95 size="sm" aria-label="History" aria-expanded={historyOpen} onClick={() => setHistoryOpen(open => !open)}>▣ History</Button95>
        <Button95 size="sm" aria-label="Print" onClick={printCurrentPage}>▤ Print</Button95>
        <span className="win97-toolbar-divider" />
        <Button95 size="sm" aria-label="Mail" disabled={!onOpenApp} onClick={() => onOpenApp?.('mail')}><AppIcon appId="mail" size={14} /> Mail</Button95>
        <IeGlobeBadge97 />
      </div>
      {searchOpen && <form id="win97-ie-search-popover" className="win97-ie-toolbar-popover win97-ie-search-popover" role="search" onSubmit={submitSearch}>
        <label htmlFor="win97-ie-search-query">Search the Web</label>
        <div><input id="win97-ie-search-query" autoFocus value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Enter search terms" /><Button95 size="sm" type="submit">Search</Button95></div>
      </form>}
      {favoritesOpen && <aside id="win97-ie-favorites-popover" className="win97-ie-toolbar-popover win97-ie-favorites-popover" aria-label="Internet Explorer favorites">
        <b>Favorites</b>
        {DIRECTORY_LINKS.filter(link => link.kind === 'external').map(link => <ExternalBrowserLink97 key={link.label} href={link.href} onClick={() => setFavoritesOpen(false)}>{link.label}</ExternalBrowserLink97>)}
      </aside>}
    </div>
    <div className="win97-browser-address"><label htmlFor="ie4-address">Address</label><input ref={addressInputRef} id="ie4-address" value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') navigate(draft); }} /><Button95 size="sm" onClick={() => navigate(draft)}>▶ Go</Button95></div>
    {showQuickLinks && <nav className="win97-ie-quick-links" aria-label="Quick Links">
      <span className="win97-ie-quick-links-label">Links:</span>
      {QUICK_LINKS.map((link, index) => <span className="win97-ie-quick-link" key={link.label}>
        {index > 0 && <span className="win97-ie-quick-separator" aria-hidden="true">|</span>}
        {link.external
          ? <ExternalBrowserLink97 href={link.href}>{link.label}</ExternalBrowserLink97>
          : <a href={link.href}>{link.label}</a>}
      </span>)}
    </nav>}

    {historyOpen && <aside className="win97-ie-history" aria-label="Browsing history"><b>Browsing history</b>{history.map((item, index) => <button type="button" key={`${item}-${index}`} onClick={() => { openHistoryAddress(item, index); setHistoryOpen(false); }}>{item}</button>)}</aside>}

    <main className="win97-browser-page" ref={pageRef}>
      <div className="win97-ie-page-content">
        <div className="win97-ie-banner"><h2>★ My Links ★</h2><span>« Serving interactive web experiments, vintage codecraft &amp; digital art portfolios »</span></div>
        <hr />
        <p className="win97-ie-page-intro">Thank you for visiting my cyberspace corner! Use the directory below to visit Weru’s work and professional links. External websites open in a separate browser tab.</p>
        <div className="win97-ie-construction"><div className="win97-ie-construction-label"><span aria-hidden="true">⚒</span><b>UNDER CONTINUOUS CONSTRUCTION 1997–2024</b><span aria-hidden="true">⚒</span></div></div>
        <section id="weru-link-directory" className="win97-ie-directory" aria-label="Directory of external hyperlinks">
          <div className="win97-ie-directory-heading"><span>Directory of External Hyperlinks</span><span>Protocol: HTTP/1.0</span></div>
          <div className="win97-browser-links">{DIRECTORY_LINKS.map(link => {
            const content = <><span className="win97-ie-link-icon" aria-hidden="true">{link.icon}</span><span className="win97-ie-link-copy"><b>{link.label}</b><small>{link.detail}</small></span></>;
            return link.kind === 'mail'
              ? <button className="win97-ie-link-card" key={link.label} type="button" disabled={!onOpenApp} onClick={() => onOpenApp?.('mail')} aria-label={`Compose an email to ${link.detail}`}>{content}</button>
              : <ExternalBrowserLink97 className="win97-ie-link-card" key={link.label} href={link.href}>{content}</ExternalBrowserLink97>;
          })}</div>
        </section>
        <div className="win97-ie-badges"><span>Best viewed at <b>800×600</b></span><span>Enhanced for <b>IE 4.0</b></span><span><b>Netscape Navigator</b> Compatible</span><span>Made with <b>Notepad</b></span></div>
        <p className="win97-ie-visitor">You are visitor number <b>{visitorCount == null ? '—' : String(visitorCount).padStart(7, '0')}</b></p>
        <p className="win97-ie-copyright">© 2026 Weru 97 · External links open in your browser.</p>
      </div>
    </main>
    {showStatusBar && <div className="win97-ie-statusbar" role="status" aria-label="Internet Explorer status bar">
      <div className="win97-ie-status-pane win97-ie-status-ready"><AppIcon appId="notepad" size={12} /><ExternalHandoff97 status={status} href={externalHandoffUrl} /></div>
      <div className="win97-ie-status-pane win97-ie-status-zone"><AppIcon appId="ie4" size={12} /><span>Internet zone</span></div>
      <div className="win97-ie-status-pane win97-ie-status-ssl" title="Protected Connection">
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" shapeRendering="crispEdges">
          <path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="#404040" strokeWidth="2" />
          <rect x="3" y="7" width="10" height="8" fill="#808080" stroke="#404040" />
          <rect x="7" y="10" width="2" height="2" fill="#000" />
        </svg>
        <b>SSL</b>
      </div>
    </div>}
    {aboutOpen && <div className="win97-ie-about" role="dialog" aria-modal="true" aria-label="About Internet Explorer"><header><span>About Internet Explorer</span><button type="button" aria-label="Close About dialog" onClick={() => setAboutOpen(false)}>×</button></header><div><IeGlobeBadge97 /><p><b>Weru Internet Explorer 4.0</b><br />Portfolio Edition · build 4.10.1997</p><small>External websites open in a separate browser tab.</small></div><footer><Button95 size="sm" onClick={() => setAboutOpen(false)}>OK</Button95></footer></div>}
  </div>;
}
