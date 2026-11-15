import { describe, expect, it } from 'vitest';

import {
  AreaResponseSchema,
  CategoryResponseSchema,
  IngredientResponseSchema,
} from '../../src/schemas/dictionaries.schema';

describe('Dictionaries Zod Schemas', () => {
  it('validates valid Category object', () => {
    const valid = { id: '6462a6cd4c3d0ddd28897f8f', name: 'Dessert' };
    expect(CategoryResponseSchema.parse(valid)).toEqual(valid);
  });

  it('validates valid Area object', () => {
    const valid = { id: '6462a6f04c3d0ddd28897f9b', name: 'Ukrainian' };
    expect(AreaResponseSchema.parse(valid)).toEqual(valid);
  });

  it('validates valid Ingredient object with nullable fields', () => {
    const valid = {
      id: '640c2dd963a319ea671e382c',
      name: 'Pears',
      description: null,
      img: null,
    };
    expect(IngredientResponseSchema.parse(valid)).toEqual(valid);
  });

  it('fails if Ingredient img is not a valid URL', () => {
    const invalid = {
      id: '640c2dd963a319ea671e382c',
      name: 'Pears',
      description: 'Fruit',
      img: 'not-a-url',
    };
    expect(() => IngredientResponseSchema.parse(invalid)).toThrow();
  });
});
