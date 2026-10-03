import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AppIcon from './AppIcon';
import { APP_REGISTRY } from '../features/apps/app-registry';

describe('AppIcon classic asset coverage', () => {
  it('uses local pixel assets for every registered application icon', () => {
    for (const app of APP_REGISTRY) {
      const markup = renderToStaticMarkup(createElement(AppIcon, { appId: app.id }));
      expect(markup, `${app.id} should use a local pixel icon`).toContain('<img');
      expect(markup, `${app.id} should resolve to the local icon directory`).toContain('/assets/win97/icons/');
    }
  });

  it.each(['internet-explorer', 'about', 'experience', 'skills', 'contact', 'desktop'])(
    'keeps the %s compatibility alias on the pixel-art icon path',
    (appId) => {
      const markup = renderToStaticMarkup(createElement(AppIcon, { appId }));
      expect(markup).toContain('<img');
      expect(markup).toContain('/assets/win97/icons/');
      expect(markup).not.toContain('<svg');
    },
  );
});
