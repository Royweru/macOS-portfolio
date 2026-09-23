import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SystemWarning97 from './SystemWarning97';

describe('System Warning Stitch extraction', () => {
  it('renders the source warning prompt and yes/cancel actions', () => {
    const markup = renderToStaticMarkup(createElement(SystemWarning97, {
      onOpenTarget: () => undefined,
      onClose: () => undefined,
    }));

    expect(markup).toContain('aria-label="Warning"');
    expect(markup).toContain('Are you sure sure you want to explore amazing work?');
    expect(markup).toContain('>yes</button>');
    expect(markup).toContain('>cancel</button>');
  });
});
