import { describe, expect, it } from 'vitest';
import { STITCH_SCREEN_MANIFEST } from './stitch-screen-manifest';

const requestedIds = [
  '9e70e97521b041b0b2575fd0322ace42', '0f3046a574c8480da785b5f8f49b8b31',
  '0de14a31211048eca172e442e500ec10', '4a970d6cdecc4810a3b1eea9446779f9',
  '47dfc46a772046c183e86027164941c5', 'e05eddbf62974f6484f6b284b8b879ae',
  'c018f85035a4472f911c7a809fab2cc6', '85ab0677c7404c0d93c0d97b45252680',
  'e85aa0ce9dff439bba14c7e1ffbe0a68', 'ac63fe5b9e0a43e29ebf1bc4e9ebfba7',
  '799ddaad07824567a8cd7dc487e75048', '62940bee0245407896b9283e0ef41f1b',
];

describe('Stitch source contract', () => {
  it('keeps all requested IDs represented exactly once', () => {
    const ids = STITCH_SCREEN_MANIFEST.map(screen => screen.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(requestedIds.every(id => ids.includes(id))).toBe(true);
  });

  it('records only genuinely missing independent artifacts as pending', () => {
    const missing = STITCH_SCREEN_MANIFEST.filter(screen => screen.status === 'derived-missing-source');
    expect(missing.map(screen => screen.id)).toEqual([
      '799ddaad07824567a8cd7dc487e75048',
    ]);
    expect(missing.every(screen => screen.visualStatus === 'pending-source')).toBe(true);
  });

  it('records the recovered dual-explorer variant without overstating pixel parity', () => {
    const dualVariant = STITCH_SCREEN_MANIFEST.find(screen => screen.id === '4a970d6cdecc4810a3b1eea9446779f9');
    expect(dualVariant?.status).toBe('available');
    expect(dualVariant?.source).toBe('Stitch Designs/html/windows_97_dual_explorer_variant.html');
    expect(dualVariant?.visualStatus).toBe('partial');
    expect(dualVariant?.functionalityStatus).toBe('verified');
  });

  it('records the fetched System Dialogs source without overstating visual parity', () => {
    const systemDialogs = STITCH_SCREEN_MANIFEST.find(screen => screen.id === 'ac63fe5b9e0a43e29ebf1bc4e9ebfba7');
    expect(systemDialogs?.status).toBe('available');
    expect(systemDialogs?.source).toBe('Stitch Designs/html/windows_97_system_dialogs_properties.html');
    expect(systemDialogs?.visualStatus).toBe('partial');
  });
});
