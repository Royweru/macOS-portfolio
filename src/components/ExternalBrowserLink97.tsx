import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { isAllowedExternalUrl } from '../features/os/external-url97';

type ExternalBrowserLink97Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> & {
  href: string;
  children: ReactNode;
};

/** A safe outbound link that always leaves the Weru 97 shell. */
export default function ExternalBrowserLink97({ href, children, title, ...anchorProps }: ExternalBrowserLink97Props) {
  if (!isAllowedExternalUrl(href)) return <span className={anchorProps.className}>{children}</span>;

  return <a
    {...anchorProps}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={title ?? 'Opens outside Weru 97 in a new browser tab'}
  >{children}</a>;
}
