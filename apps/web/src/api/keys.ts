export const queryKeys = {
  dictionaries: {
    all: ['dictionaries'] as const,
    categories: () => [...queryKeys.dictionaries.all, 'categories'] as const,
    areas: () => [...queryKeys.dictionaries.all, 'areas'] as const,
    ingredients: () => [...queryKeys.dictionaries.all, 'ingredients'] as const,
  },
  // recipes: {
  //   all: ['recipes'] as const,
  //   lists: () => [...queryKeys.recipes.all, 'list'] as const,
  //   list: (filters: Record<string, unknown>) => [...queryKeys.recipes.lists(), filters] as const,
  //   details: () => [...queryKeys.recipes.all, 'detail'] as const,
  //   detail: (id: string) => [...queryKeys.recipes.details(), id] as const,
  // },
  testimonials: {
    all: ['testimonials'] as const,
  },
};
