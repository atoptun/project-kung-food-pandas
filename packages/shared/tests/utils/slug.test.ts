import { describe, expect, it } from 'vitest';

import { toSlug } from '../../src/utils/slug';

describe('toSlug', () => {
  it('converts basic english text into lowercase kebab-case slug', () => {
    expect(toSlug('Spaghetti Bolognese')).toBe('spaghetti-bolognese');
  });

  it('removes special characters and symbols', () => {
    expect(toSlug('Apple Pie & Custard (100% Homemade!)')).toBe(
      'apple-pie-and-custard-100percent-homemade',
    );
  });

  it('transliterates ukrainian and cyrillic text', () => {
    expect(toSlug('Український Борщ')).toBe('ukrayinskij-borsh');
  });

  it('handles multiple consecutive spaces and dashes', () => {
    expect(toSlug('  Hot --- Spicy    Soup  ')).toBe('hot-spicy-soup');
  });

  it('returns empty string for falsy/empty input', () => {
    expect(toSlug('')).toBe('');
  });
});
