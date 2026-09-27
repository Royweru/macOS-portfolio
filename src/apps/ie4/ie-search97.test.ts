import { describe, expect, it } from 'vitest';
import { isAllowedExternalUrl } from '../../features/os/open-target';
import { buildIeSearchUrl97 } from './ie-search97';

describe('Internet Explorer web search', () => {
  it('builds an encoded HTTP(S) search destination from a non-empty query', () => {
    const destination = buildIeSearchUrl97('Weru 97 + portfolio');
    expect(destination).toBe('https://www.google.com/search?q=Weru+97+%2B+portfolio');
    expect(isAllowedExternalUrl(destination ?? '')).toBe(true);
  });

  it('does not build a destination for an empty query', () => {
    expect(buildIeSearchUrl97('  \n ')).toBeUndefined();
  });
});
