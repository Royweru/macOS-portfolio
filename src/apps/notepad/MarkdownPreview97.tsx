import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { isAllowedExternalUrl } from '../../features/os/external-url97';
import ExternalBrowserLink97 from '../../components/ExternalBrowserLink97';

interface MarkdownPreview97Props {
  source: string;
  onOpenDocument?: (href: string) => void;
}

const isLocalTextDocumentHref = (href: string) => {
  if (!href || href.startsWith('#') || href.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(href)) return false;
  return /\.(?:md|txt)(?:[?#].*)?$/i.test(href);
};

export default function MarkdownPreview97({ source, onOpenDocument }: MarkdownPreview97Props) {
  const components: Components = {
    a: ({ href, children }) => {
      if (href?.startsWith('#')) return <a href={href}>{children}</a>;
      if (href && isLocalTextDocumentHref(href) && onOpenDocument) return <a
        href={href}
        onClick={event => { event.preventDefault(); onOpenDocument(href); }}
      >{children}</a>;
      if (!href || !isAllowedExternalUrl(href)) return <span>{children}</span>;
      return <ExternalBrowserLink97 href={href}>{children}</ExternalBrowserLink97>;
    },
    img: ({ src, alt }) => typeof src === 'string' && src.startsWith('/') && !src.startsWith('//')
      ? <img src={src} alt={alt ?? ''} loading="lazy" />
      : null,
  };

  return <article className="win97-markdown-preview" aria-label="Markdown preview">
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{source}</ReactMarkdown>
  </article>;
}
