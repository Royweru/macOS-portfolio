import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { OpenTarget } from '../../features/os/os-types';
import { isAllowedExternalUrl } from '../../features/os/open-target';

interface MarkdownPreview97Props {
  source: string;
  onOpenTarget?: (target: OpenTarget) => void;
}

export default function MarkdownPreview97({ source, onOpenTarget }: MarkdownPreview97Props) {
  const components: Components = {
    a: ({ href, children }) => {
      if (href?.startsWith('#')) return <a href={href}>{children}</a>;
      if (!href || !isAllowedExternalUrl(href)) return <span>{children}</span>;
      return <a
        href={href}
        target={onOpenTarget ? undefined : '_blank'}
        rel={onOpenTarget ? undefined : 'noopener noreferrer'}
        onClick={onOpenTarget ? event => {
          event.preventDefault();
          onOpenTarget({ kind: 'external', url: href, label: 'README link' });
        } : undefined}
      >{children}</a>;
    },
    img: ({ src, alt }) => typeof src === 'string' && src.startsWith('/') && !src.startsWith('//')
      ? <img src={src} alt={alt ?? ''} loading="lazy" />
      : null,
  };

  return <article className="win97-markdown-preview" aria-label="Markdown preview">
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{source}</ReactMarkdown>
  </article>;
}
