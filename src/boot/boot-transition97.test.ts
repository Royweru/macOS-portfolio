import { describe, expect, it } from 'vitest';
import {
  BOOT_TASKBAR_REVEAL_DELAY_MS,
  BOOT_WELCOME_DIALOG_DELAY_MS,
  getBootIconRevealDelay97,
  getBootWelcomeDelay97,
} from './boot-transition97';

describe('Stitch boot-to-desktop transition timing', () => {
  it('slides the taskbar after 300ms and staggers icons from 600ms by 90ms', () => {
    expect(BOOT_TASKBAR_REVEAL_DELAY_MS).toBe(300);
    expect(getBootIconRevealDelay97(0)).toBe(600);
    expect(getBootIconRevealDelay97(1)).toBe(690);
    expect(getBootIconRevealDelay97(9)).toBe(1410);
  });

  it('shows the first-visit welcome after the source delay, or immediately for reduced motion', () => {
    expect(BOOT_WELCOME_DIALOG_DELAY_MS).toBe(1600);
    expect(getBootWelcomeDelay97(false)).toBe(1600);
    expect(getBootWelcomeDelay97(true)).toBe(0);
  });
});
