const WEB_SEARCH_ORIGIN = 'https://www.google.com/search';

export function buildIeSearchUrl97(query: string): string | undefined {
  const normalized = query.trim();
  if (!normalized) return undefined;
  const url = new URL(WEB_SEARCH_ORIGIN);
  url.searchParams.set('q', normalized);
  return url.toString();
}
