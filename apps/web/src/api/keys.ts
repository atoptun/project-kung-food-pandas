export const queryKeys = {
  // recipes: {
  //   all: ['recipes'] as const,
  //   lists: () => [...queryKeys.recipes.all, 'list'] as const,
  //   list: (filters: Record<string, unknown>) => [...queryKeys.recipes.lists(), filters] as const,
  //   details: () => [...queryKeys.recipes.all, 'detail'] as const,
  //   detail: (id: string) => [...queryKeys.recipes.details(), id] as const,
  // },
  categories: {
    all: ['categories'] as const,
  },
  areas: {
    all: ['areas'] as const,
  },
  ingredients: {
    all: ['ingredients'] as const,
  },
  testimonials: {
    all: ['testimonials'] as const,
  },
};
