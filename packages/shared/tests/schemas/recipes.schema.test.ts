import { describe, expect, it } from 'vitest';

import { CreateRecipeSchema } from '../../src/schemas/recipes.schema';

const input = {
  title: 'Recipe',
  description: 'Description',
  instructions: 'Cook for ten minutes.',
  categoryId: 'category',
  areaId: 'area',
  time: '1',
  ingredients: JSON.stringify([{ id: 'ingredient', measure: '200g' }]),
};

describe('CreateRecipeSchema', () => {
  it('parses multipart values at the specified boundaries', () => {
    expect(
      CreateRecipeSchema.parse({
        ...input,
        description: 'a'.repeat(200),
        instructions: 'a'.repeat(1000),
      }),
    ).toMatchObject({ time: 1, ingredients: [{ id: 'ingredient', measure: '200g' }] });
  });

  it.each([
    { description: undefined },
    { time: undefined },
    { time: '0' },
    { time: '2147483648' },
    { description: 'a'.repeat(201) },
    { instructions: 'a'.repeat(1001) },
    { title: '  ' },
    { categoryId: '' },
    { ingredients: 'broken' },
    { ingredients: '{}' },
    { ingredients: '[]' },
    { ingredients: '[{"id":"i","measure":" "}]' },
    { ingredients: '[{"id":"i","measure":"1g"},{"id":"i","measure":"2g"}]' },
  ])('rejects invalid create input %j', (overrides) => {
    expect(CreateRecipeSchema.safeParse({ ...input, ...overrides }).success).toBe(false);
  });
});
