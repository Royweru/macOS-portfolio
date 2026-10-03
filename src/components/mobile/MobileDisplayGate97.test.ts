import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import MobileDisplayGate97, { RESUME_TEXT_CONTENT } from './MobileDisplayGate97';

describe('MobileDisplayGate97', () => {
  it('renders the complete authentic Windows 95 hardware notice dialog with accessible ARIA landmarks', () => {
    const html = renderToStaticMarkup(createElement(MobileDisplayGate97));

    // Outer CRT overlay and viewport aside
    expect(html).toContain('class="mobile-gate-crt"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('class="weru-mobile-gate"');
    expect(html).toContain('role="complementary"');
    expect(html).toContain('aria-label="Hardware Requirements Gate"');
    expect(html).toContain('class="mobile-gate-window"');
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-labelledby="mobile-gate-title"');

    // Titlebar
    expect(html).toContain('class="mobile-gate-titlebar"');
    expect(html).toContain('Weru 97 — Hardware Requirements Notice');
    expect(html).toContain('class="mobile-gate-close-btn"');
    expect(html).toContain('aria-label="Close Notice"');
    expect(html).toContain('title="Close"');

    // Dialog Header
    expect(html).toContain('id="mobile-gate-title"');
    expect(html).toContain('Workstation Display Required');
    expect(html).toContain('simulating Windows 95 OSR 2.5');
    expect(html).toContain('resolution of at least 800×600 SVGA');

    // Sunken Diagnostic Report Panel
    expect(html).toContain('aria-label="System Diagnostic Report"');
    expect(html).toContain('class="mobile-gate-diagnostic"');
    expect(html).toContain('[ SYSTEM DIAGNOSTIC REPORT ]');
    expect(html).toContain('Architecture:    x86 Workstation');
    expect(html).toContain('Target OS:       Microsoft Windows 97 OSR 2.5');
    expect(html).toContain('Required Screen: 800 x 600 SVGA or larger');
    expect(html).toContain('Input Device:    Touch Screen (No Mouse)');
    expect(html).toContain('HALTED: Incompatible Display');

    // Action button
    expect(html).toContain('class="mobile-gate-btn "');
    expect(html).toContain('Copy Portfolio Link');

    // Executive Summary & Contact fieldset
    expect(html).toContain('Executive Summary &amp; Contact');
    expect(html).toContain('Roy Weru');
    expect(html).toContain('Full-Stack Software Engineer &amp; Creative Developer');
    expect(html).toContain('Location: Nairobi, Kenya');
    expect(html).toContain('href="https://github.com/Royweru"');
    expect(html).toContain('href="https://linkedin.com/in/royweru"');
    expect(html).toContain('href="mailto:royezi17@gmail.com"');
    expect(html).toContain('Download Resume.txt');

    // Status Bar
    expect(html).toContain('Error 0x7E: Screen resolution below minimum threshold');
    expect(html).toContain('Weru 97');
  });

  it('exports comprehensive plain-text resume content for client-side download', () => {
    expect(RESUME_TEXT_CONTENT).toContain('Roy Weru - Full-Stack Software Engineer & Creative Developer');
    expect(RESUME_TEXT_CONTENT).toContain('Location: Nairobi, Kenya');
    expect(RESUME_TEXT_CONTENT).toContain('Contact: royezi17@gmail.com');
    expect(RESUME_TEXT_CONTENT).toContain('https://github.com/Royweru');
    expect(RESUME_TEXT_CONTENT).toContain('https://linkedin.com/in/royweru');
    expect(RESUME_TEXT_CONTENT).toContain('Weru 97 (https://weru97.live)');
  });
});
