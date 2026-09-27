import ExternalBrowserLink97 from '../../components/ExternalBrowserLink97';

export default function ExternalHandoff97({ status, href }: { status: string; href: string | null }) {
  return <>
    <span className="win97-ie-status-message" aria-live="polite">{status}</span>
    {href && <ExternalBrowserLink97 className="win97-ie-handoff-link" href={href}>Open in browser ↗</ExternalBrowserLink97>}
  </>;
}
