import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  BIOS_LINES,
  BIOS_LINE_DELAYS,
  BIOS_MEMORY_STEP,
  BIOS_MEMORY_TARGET,
  BOOT_BIOS_STAGE_MS,
  BOOT_DESKTOP_REVEAL_DELAY_MS,
  BOOT_PROGRESS_INTERVAL_MS,
  BOOT_PROGRESS_SEGMENT_COUNT,
  BOOT_SPLASH_FADE_MS,
  BOOT_STARTING_STAGE_MS,
} from './boot-contract97';
import { SegmentedProgress97, WeruFlag97 } from './BootSequence97';

const stitchBootSource = readFileSync(join(process.cwd(), 'Stitch Designs', 'html', 'windows_97_boot_screen.html'), 'utf8');
const bootStyles = readFileSync(join(process.cwd(), 'src', 'styles', 'boot.css'), 'utf8');
const bootComponentSource = readFileSync(join(process.cwd(), 'src', 'boot', 'BootSequence97.tsx'), 'utf8');
const sourceStyles = stitchBootSource.match(/<style>([\s\S]*?)<\/style>/i)?.[1] ?? '';

const cssRule = (styles: string, selector: string) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return styles.match(new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
};

const cssRuleCount = (styles: string, selector: string) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...styles.matchAll(new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{`, 'g'))].length;
};

const cssValue = (rule: string, property: string) => {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return rule.match(new RegExp(`(?:^|;)\\s*${escaped}\\s*:\\s*([^;]+)`))?.[1]?.trim() ?? '';
};

const normalizeCssValue = (value: string) => value.replace(/\s/g, '').toLowerCase()
  .replace(/["']/g, '')
  .replace(/^bold$/, '700')
  .replace(/^normal$/, '400')
  .replace(/(?<![\d.])0+(?=\.\d)/g, '')
  .replace(/(?<![\d.])0(?:px|rem|em|%)/g, '0')
  .replace(/#([\da-f])\1([\da-f])\2([\da-f])\3\b/g, '#$1$2$3');

const sourceBiosLines = () => [...stitchBootSource.matchAll(/<div class="bios-line" id="b(\d+)"[^>]*>([\s\S]*?)<\/div>/g)]
  .map(([, id, markup]) => [Number(id), markup.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()] as const);

const svgElements = (markup: string) => [...markup.matchAll(/<(path|rect)\b([^>]*)\/?\s*>/g)].map(([, tag, rawAttributes]) => {
  const attributes = Object.fromEntries([...rawAttributes.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, name, value]) => {
    const normalized = value.startsWith('#') ? value.toLowerCase() : Number.isFinite(Number(value)) ? String(Number(value)) : value;
    return [name.toLowerCase(), normalized];
  }));
  return { tag, attributes };
});

describe('BootSequence97 Stitch source contract', () => {
  it('keeps retired rounded lock-screen and legacy boot selectors out of the active stylesheet', () => {
    const retiredSelectors = [
      '.boot97-cursor', '.boot97-start-logo', '.boot97-progress', '.boot97-logo-screen',
      '.boot97-windows-mark', '.boot97-welcome', '.boot97-welcome-title', '.boot97-welcome-body',
      '.boot-screen', '.boot-loading', '.boot-lock-content', '.boot-progress-track',
      '.boot-progress-fill', '.boot-lock-card', '.boot-avatar', '.boot-welcome-content', '.boot-spinner',
    ];

    for (const selector of retiredSelectors) {
      expect(cssRule(bootStyles, selector), `${selector} should not remain in the active boot stylesheet`).toBe('');
    }
    expect(bootStyles).not.toContain('backdrop-filter');
    expect(bootStyles).not.toContain('border-radius: 16px');
    expect(bootStyles).not.toContain('.boot97-cursor');
    expect(cssRule(bootStyles, '.boot97-welcome-icon')).not.toBe('');
  });

  it('keeps the full-screen, skip, BIOS, and BIOS-line rules single and authoritative', () => {
    const baseStyles = bootStyles.split('@media')[0];
    for (const selector of ['.boot97', '.boot97-skip', '.boot97-skip:hover', '.boot97-bios', '.boot97-bios-lines']) {
      expect(cssRuleCount(baseStyles, selector), `${selector} should have one base rule before responsive overrides`).toBe(1);
    }
    expect(cssValue(cssRule(bootStyles, '.boot97'), 'font')).toBe("14px 'Courier New', monospace");
    expect(cssValue(cssRule(bootStyles, '.boot97'), 'z-index')).toBe('2000');
    expect(cssValue(cssRule(bootStyles, '.boot97-bios'), 'z-index')).toBe('1');
    expect(cssValue(cssRule(bootStyles, '.boot97-bios-line-10.boot97-bios-boot-line'), 'margin-top')).toBe('12px');
  });

  it('preserves the source BIOS header flow and CRT-over-skip layer order', () => {
    const sourceHeader = cssRule(sourceStyles, '.bios-header');
    const appHeader = cssRule(bootStyles, '.boot97-bios-header');
    expect(stitchBootSource).toMatch(/<div class="bios-logo">AWARD MODULAR BIOS v4\.51PG, An Energy Star Ally<\/div>\s*<div>Copyright \(C\) 1984-97, Award Software, Inc\.<\/div>/);
    expect(bootComponentSource).toMatch(/<div className="boot97-bios-logo">AWARD MODULAR BIOS v4\.51PG, An Energy Star Ally<\/div>\s*<div className="boot97-bios-copyright">Copyright \(C\) 1984-97, Award Software, Inc\.<\/div>/);
    expect(cssValue(sourceHeader, 'align-items')).toBe('');
    // The flex default stretches the source Energy Star badge to the header height.
    expect(cssValue(appHeader, 'align-items')).toBe('stretch');
    expect(cssValue(cssRule(bootStyles, '.boot97-bios-header > div:first-child'), 'display')).toBe('block');

    // Stitch puts the CRT raster above the skip hint; preserve that order inside the boot stacking context.
    expect(cssValue(cssRule(bootStyles, '.boot97-crt-overlay'), 'z-index')).toBe('3');
    expect(cssValue(cssRule(bootStyles, '.boot97-skip'), 'z-index')).toBe('2');
  });

  it('preserves the source BIOS lines and reveal/memory timing', () => {
    const sourceLines = sourceBiosLines();
    expect(sourceLines.map(([id]) => id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(BIOS_LINES).toHaveLength(sourceLines.length);
    sourceLines.forEach(([id, text]) => {
      const index = id - 1;
      const expected = index === 1
        ? 'Memory Test : 0K OK'
        : index === 8
          ? `${BIOS_LINES[index]} Update Successful`
          : BIOS_LINES[index];
      expect(text, `Stitch BIOS line b${id}`).toBe(expected.replace(/\s+/g, ' '));
    });

    const script = stitchBootSource.slice(stitchBootSource.indexOf('function runBios()'), stitchBootSource.indexOf('// Scene 2:'));
    const initialDelay = Number(script.match(/let delay = (\d+);/)?.[1]);
    const incrementMatch = script.match(/delay \+= \(index === (\d+) \? (\d+) : (\d+)\);/);
    expect(incrementMatch).not.toBeNull();
    const [, specialIndexRaw, specialIncrementRaw, normalIncrementRaw] = incrementMatch!;
    const specialIndex = Number(specialIndexRaw);
    const specialIncrement = Number(specialIncrementRaw);
    const normalIncrement = Number(normalIncrementRaw);
    const sourceDelays = BIOS_LINES.map((_, index) => {
      const delay = initialDelay + BIOS_LINES.slice(0, index).reduce((sum, _line, priorIndex) => sum + (priorIndex === specialIndex ? specialIncrement : normalIncrement), 0);
      return delay;
    });
    expect(BIOS_LINE_DELAYS).toEqual(sourceDelays);
    expect(Number(script.match(/const target = (\d+);/)?.[1])).toBe(BIOS_MEMORY_TARGET);
    expect(Number(script.match(/const step = (\d+);/)?.[1])).toBe(BIOS_MEMORY_STEP);
    expect(script).toMatch(/\},\s*60\);/);

    expect(Number(script.match(/biosTimeout = setTimeout\([\s\S]*?\},\s*(\d+)\);/)?.[1])).toBe(BOOT_BIOS_STAGE_MS);
    const startingStage = stitchBootSource.slice(stitchBootSource.indexOf('function transitionToScene2()'), stitchBootSource.indexOf('// Scene 3:'));
    expect(Number(startingStage.match(/\},\s*(\d+)\);/)?.[1])).toBe(BOOT_STARTING_STAGE_MS);
  });

  it('keeps source progress timing and lets the authored splash fade finish', () => {
    const progressScript = stitchBootSource.slice(stitchBootSource.indexOf('function transitionToScene3()'), stitchBootSource.indexOf('// Scene 4:'));
    const sourceSegmentCount = (stitchBootSource.match(/class="progress-segment"/g) ?? []).length;
    const intervalDelays = [...progressScript.matchAll(/\},\s*(\d+)\);/g)].map(([, delay]) => Number(delay));
    const interval = intervalDelays.at(-1);
    const revealDelay = Number(progressScript.match(/transitionToDesktop\(\);[\s\S]*?\},\s*(\d+)\);/)?.[1]);
    const desktopTransition = stitchBootSource.slice(stitchBootSource.indexOf('function transitionToDesktop()'), stitchBootSource.indexOf('// Manual Skip handler'));
    const splashFade = Number(desktopTransition.match(/splash\.style\.display = 'none';[\s\S]*?\},\s*(\d+)\);/)?.[1]);

    const sourceCssFadeMs = Number(cssValue(cssRule(sourceStyles, '#scene-splash'), 'transition').match(/opacity\s+([\d.]+)s/i)?.[1]) * 1000;
    expect(sourceSegmentCount).toBe(BOOT_PROGRESS_SEGMENT_COUNT);
    expect(interval).toBe(BOOT_PROGRESS_INTERVAL_MS);
    expect(revealDelay).toBe(BOOT_DESKTOP_REVEAL_DELAY_MS);
    // Stitch's script removes the splash after 700ms, although its CSS needs 800ms.
    expect(splashFade).toBe(700);
    expect(sourceCssFadeMs).toBe(800);
    expect(BOOT_SPLASH_FADE_MS).toBe(sourceCssFadeMs);
    const progress = renderToStaticMarkup(createElement(SegmentedProgress97, { active: 0 }));
    expect((progress.match(/<span class="(?:active)?"><\/span>/g) ?? [])).toHaveLength(sourceSegmentCount);
  });

  it("renders the source flag's exact SVG primitives, including its unfilled highlight strokes", () => {
    const sourceSvg = stitchBootSource.match(/<svg viewBox="0 0 100 90" fill="none"[^>]*>([\s\S]*?)<\/svg>/)?.[0] ?? '';
    const appSvg = renderToStaticMarkup(createElement(WeruFlag97));
    expect(sourceSvg).not.toBe('');
    expect(appSvg).toContain('fill="none"');
    expect(svgElements(appSvg)).toEqual(svgElements(sourceSvg));
  });

  it('retains source viewport, splash, cloud, flag, progress, and starting-text geometry', () => {
    const sourceViewport = cssRule(sourceStyles, '.os-viewport');
    const appViewport = cssRule(bootStyles, '.boot97');
    expect(cssValue(sourceViewport, 'width')).toBe('100vw');
    expect(cssValue(sourceViewport, 'height')).toBe('100vh');
    // The BIOS/logo layer must cover the browser itself, not inherit a centered
    // 1024×768 portfolio canvas or the shell's internal stage dimensions.
    expect(cssValue(appViewport, 'position')).toBe('fixed');
    expect(cssValue(appViewport, 'inset')).toBe('0');
    expect(cssValue(appViewport, 'z-index')).toBe('2000');
    expect(cssValue(appViewport, 'overflow')).toBe('hidden');
    expect(cssValue(appViewport, 'width')).toBe('100vw');
    expect(appViewport).toContain('height: 100vh');
    expect(appViewport).toContain('height: 100dvh');
    expect(appViewport).not.toMatch(/(?:width|height):\s*(?:1024|768)px/);

    expect(normalizeCssValue(cssValue(cssRule(sourceStyles, '#scene-splash'), 'background')))
      .toBe(normalizeCssValue(cssValue(cssRule(bootStyles, '.boot97-splash'), 'background')));

    const geometry = [
      ['.cloud-1', '.boot97-splash-cloud-one', ['width', 'height', 'top', 'left', 'opacity']],
      ['.cloud-2', '.boot97-splash-cloud-two', ['width', 'height', 'bottom', 'right', 'opacity']],
      ['.win-flag-wrap', '.boot97-flag-wrap', ['width', 'height', 'margin-bottom', 'position', 'filter']],
      ['.progress-outer', '.boot97-progress-outer', ['width', 'height', 'padding', 'border', 'background']],
    ] as const;
    for (const [sourceSelector, appSelector, properties] of geometry) {
      const sourceRule = cssRule(sourceStyles, sourceSelector);
      const appRule = cssRule(bootStyles, appSelector);
      for (const property of properties) {
        expect(normalizeCssValue(cssValue(appRule, property)), `${appSelector} ${property}`)
          .toBe(normalizeCssValue(cssValue(sourceRule, property)));
      }
    }

    const sourceStarting = cssRule(sourceStyles, '.starting-text');
    const appStarting = cssRule(bootStyles, '.boot97-starting');
    expect(cssValue(sourceStarting, 'bottom')).toBe('45px');
    expect(cssValue(sourceStarting, 'left')).toBe('45px');
    expect(cssValue(appStarting, 'padding')).toBe('0 45px 45px');
    expect(cssValue(appStarting, 'align-items')).toBe('flex-end');
    expect(cssValue(appStarting, 'justify-content')).toBe('flex-start');

    const sourceCrt = cssRule(sourceStyles, '.crt-overlay');
    const appCrt = cssRule(bootStyles, '.boot97-crt-overlay');
    for (const property of ['background-size', 'opacity', 'pointer-events']) {
      expect(normalizeCssValue(cssValue(appCrt, property))).toBe(normalizeCssValue(cssValue(sourceCrt, property)));
    }
  });

  it('retains the Stitch splash layout, logo layering, and progress motion rules', () => {
    const layoutContracts = [
      ['#scene-splash', '.boot97-splash', ['position', 'flex-direction', 'align-items', 'justify-content', 'transition']],
      ['.splash-content', '.boot97-splash-content', ['position', 'z-index', 'display', 'flex-direction', 'align-items', 'text-align']],
      ['.progress-outer', '.boot97-progress-outer', ['position', 'display', 'align-items']],
      ['.progress-track', '.boot97-progress-track', ['display', 'gap', 'width', 'height']],
      ['.progress-segment', '.boot97-progress-track span', ['flex', 'height', 'background', 'transition']],
      ['.splash-footer', '.boot97-splash footer', ['position', 'bottom', 'font-family', 'font-size']],
    ] as const;

    for (const [sourceSelector, appSelector, properties] of layoutContracts) {
      const sourceRule = cssRule(sourceStyles, sourceSelector);
      const appRule = cssRule(bootStyles, appSelector);
      for (const property of properties) {
        expect(normalizeCssValue(cssValue(appRule, property)), `${appSelector} ${property}`)
          .toBe(normalizeCssValue(cssValue(sourceRule, property)));
      }
    }

    const transitionToSplash = stitchBootSource.slice(stitchBootSource.indexOf('function transitionToScene3()'), stitchBootSource.indexOf('// Scene 4:'));
    expect(transitionToSplash).toMatch(/scene3\.style\.display\s*=\s*'flex'/);
  });

  it('matches source logo typography while replacing only the visible brand text', () => {
    const typeContracts = [
      ['.brand-title', '.boot97-brand-title', ['font-family', 'font-size', 'font-weight', 'color', 'letter-spacing', 'text-shadow', 'display', 'align-items', 'gap']],
      ['.brand-title span.ver', '.boot97-brand-title b', ['font-family', 'font-size', 'font-weight', 'font-style', 'color', 'letter-spacing', 'text-shadow']],
      ['.brand-subtext', '.boot97-brand-subtext', ['font-family', 'font-size', 'font-weight', 'color', 'margin-top', 'margin-bottom', 'letter-spacing', 'text-transform', 'text-shadow']],
    ] as const;

    for (const [sourceSelector, appSelector, properties] of typeContracts) {
      const sourceRule = cssRule(sourceStyles, sourceSelector);
      const appRule = cssRule(bootStyles, appSelector);
      for (const property of properties) {
        expect(normalizeCssValue(cssValue(appRule, property)), `${appSelector} ${property}`)
          .toBe(normalizeCssValue(cssValue(sourceRule, property)));
      }
    }

    expect(bootComponentSource).toMatch(/className="boot97-flag-wrap">\s*<WeruFlag97\s*\/>/);
    expect(bootComponentSource).toMatch(/<div className="boot97-brand-title"><span>Weru<\/span>\s*<b>97<\/b><\/div>/);
    expect(bootComponentSource).not.toContain('Windows');
  });
});
