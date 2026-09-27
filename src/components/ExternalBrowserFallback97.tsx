import ExternalBrowserLink97 from './ExternalBrowserLink97';

export default function ExternalBrowserFallback97({ href, label, onDismiss }: { href: string; label?: string; onDismiss: () => void }) {
  return <aside className="win97-external-browser-fallback" role="alert" aria-label="External browser link blocked">
    <header><span>Weru 97 — Internet</span><span aria-hidden="true">!</span></header>
    <p>Your browser blocked the new tab. Use this link to open the destination outside Weru 97.</p>
    <footer>
      <ExternalBrowserLink97 href={href}>{label ? `Open ${label} in browser ↗` : 'Open in browser ↗'}</ExternalBrowserLink97>
      <button type="button" onClick={onDismiss}>Close</button>
    </footer>
  </aside>;
}
