import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getRegisteredApp } from '../../features/apps/app-registry';
import ShutDown97 from './ShutDown97';

describe('Shutdown dialog Stitch surface', () => {
  it('renders the extracted computer icon, prompt, radio choices, and classic actions', () => {
    const markup = renderToStaticMarkup(createElement(ShutDown97, { onClose: () => undefined }));

    expect(markup).toContain('class="win97-app win97-shutdown-dialog"');
    expect(markup).toContain('aria-label="Computer power icon"');
    expect(markup).toContain('What do you want the computer to do?');
    expect(markup).toContain('<u>S</u>hut down the computer?');
    expect(markup).toContain('<u>R</u>estart the computer?');
    expect(markup).toContain('Close all programs and log on as a different user?');
    expect(markup).toContain('>Yes</button>');
    expect(markup).toContain('>Cancel</button>');
    expect(markup).toContain('>Help</button>');
    expect(getRegisteredApp('shutdown')?.defaultWindow).toEqual({ width: 320, height: 240 });
  });
});
