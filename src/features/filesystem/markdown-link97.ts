import type { VfsNode } from './filesystem-types';

const TEXT_DOCUMENT_EXTENSION = /\.(?:md|txt)$/i;
const TEXT_DOCUMENT_MIME_TYPES = new Set(['text/markdown', 'text/plain']);
const LINK_SCHEME = /^[a-z][a-z\d+.-]*:/i;

const isTextDocument = (node: VfsNode) => node.kind === 'file'
  && (TEXT_DOCUMENT_MIME_TYPES.has(node.mimeType) || TEXT_DOCUMENT_EXTENSION.test(node.name));

const safeSegments = (path: string) => {
  try {
    const segments = path.split('/').filter(Boolean).map(segment => decodeURIComponent(segment));
    if (segments.some(segment => segment === '..' || segment.includes('/') || segment.includes('\\'))) return undefined;
    return segments.filter(segment => segment !== '.');
  } catch {
    return undefined;
  }
};

/** Resolve a Markdown link to a text file owned by the same project/filesystem folder. */
export function resolveMarkdownTextLink97(source: VfsNode, href: string, nodes: readonly VfsNode[]) {
  const trimmedHref = href.trim();
  if (!trimmedHref || trimmedHref.startsWith('#') || trimmedHref.startsWith('//') || LINK_SCHEME.test(trimmedHref)) return undefined;

  const rawPath = trimmedHref.split(/[?#]/, 1)[0];
  if (!TEXT_DOCUMENT_EXTENSION.test(rawPath)) return undefined;
  const segments = safeSegments(rawPath);
  if (!segments?.length) return undefined;

  // First resolve same-origin public text assets relative to the source Markdown URL.
  if (source.contentUrl) {
    try {
      const baseUrl = new URL(source.contentUrl, 'https://weru97.invalid/');
      const targetUrl = new URL(trimmedHref, baseUrl);
      if (targetUrl.origin === baseUrl.origin) {
        const byContentUrl = nodes.find(node => {
          if (!isTextDocument(node) || !node.contentUrl) return false;
          try {
            return new URL(node.contentUrl, baseUrl).pathname === targetUrl.pathname;
          } catch {
            return false;
          }
        });
        if (byContentUrl) return byContentUrl;
      }
    } catch {
      // Fall through to the VFS-relative resolver for malformed source URLs.
    }
  }

  // Root-relative paths may identify a public asset, but are never treated as a VFS traversal.
  if (rawPath.startsWith('/') || !source.parentId) return undefined;

  let parentId = source.parentId;
  let current: VfsNode | undefined;
  for (const [index, segment] of segments.entries()) {
    current = nodes.find(node => node.parentId === parentId && node.name.toLocaleLowerCase() === segment.toLocaleLowerCase());
    if (!current || (index < segments.length - 1 && current.kind !== 'folder')) return undefined;
    parentId = current.id;
  }

  return current && isTextDocument(current) ? current : undefined;
}
