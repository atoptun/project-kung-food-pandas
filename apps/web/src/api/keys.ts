export const queryKeys = {
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
