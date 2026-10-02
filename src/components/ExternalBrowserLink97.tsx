import { useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { isAllowedExternalUrl } from '../features/os/external-url97';
import { handleExternalBrowserLinkClick97 } from './external-browser-navigation97';

type ExternalBrowserLink97Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> & {
  href: string;
  children: ReactNode;
};

/** A safe outbound link that always leaves the Weru 97 shell. */
export default function ExternalBrowserLink97({ href, children, title, ...anchorProps }: ExternalBrowserLink97Props) {
  const [popupBlocked, setPopupBlocked] = useState(false);
  if (!isAllowedExternalUrl(href)) return <span className={anchorProps.className}>{children}</span>;

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    anchorProps.onClick?.(event);
    if (handleExternalBrowserLinkClick97(event, href, () => setPopupBlocked(true))) setPopupBlocked(false);
  };

  return <>
    <a
      {...anchorProps}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title ?? 'Opens outside Weru 97 in a new browser tab'}
      onClick={onClick}
    >{children}</a>
    {popupBlocked && <span className="win97-external-link-blocked" role="alert">
      <span>Browser blocked the new tab.</span>
      <a href={href} target="_blank" rel="noopener noreferrer">Retry in browser ↗</a>
      <button type="button" onClick={() => setPopupBlocked(false)}>Close</button>
    </span>}
  </>;
}
