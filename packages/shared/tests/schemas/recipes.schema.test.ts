import { describe, expect, it } from 'vitest';

import { RecipeCardSchema, RecipeDetailsSchema } from '../../src/index';

const card = {
  id: '6462a8f74c3d0ddd28897fcd',
  title: 'Battenberg Cake',
  thumb: null,
  description: 'A classic British cake',
  time: 60,
  favoritesCount: 3,
};

describe('RecipeCardSchema', () => {
  it('accepts isFavorite for an authenticated request', () => {
    const parsed = RecipeCardSchema.safeParse({ ...card, isFavorite: true });

    expect(parsed.success).toBe(true);
    expect(parsed.data?.isFavorite).toBe(true);
  });

  it('keeps isFavorite optional for a guest', () => {
    const parsed = RecipeCardSchema.safeParse(card);

    expect(parsed.success).toBe(true);
    expect(parsed.data?.isFavorite).toBeUndefined();
  });

  it('rejects a non-boolean isFavorite', () => {
    expect(RecipeCardSchema.safeParse({ ...card, isFavorite: 'yes' }).success).toBe(false);
  });
});

describe('RecipeDetailsSchema', () => {
  it('inherits isFavorite from the card', () => {
    const parsed = RecipeDetailsSchema.safeParse({ ...card, isFavorite: false, ingredients: [] });

    expect(parsed.success).toBe(true);
    expect(parsed.data?.isFavorite).toBe(false);
  });
});
