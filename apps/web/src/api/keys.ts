export const queryKeys = {
  dictionaries: {
    all: ['dictionaries'] as const,
    categories: () => [...queryKeys.dictionaries.all, 'categories'] as const,
    areas: () => [...queryKeys.dictionaries.all, 'areas'] as const,
    ingredients: () => [...queryKeys.dictionaries.all, 'ingredients'] as const,
  },
  recipes: {
    all: ['recipes'] as const,
    lists: () => [...queryKeys.recipes.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.recipes.lists(), filters] as const,
    popular: (limit: number) => [...queryKeys.recipes.all, 'popular', limit] as const,
    details: () => [...queryKeys.recipes.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.recipes.details(), id] as const,
  },
  favorites: {
    all: ['favorites'] as const,
    /** Ids of the current user's favorite recipes (scoped by user so accounts never share a cache). */
    ids: (userId: string) => [...queryKeys.favorites.all, 'ids', userId] as const,
    lists: () => [...queryKeys.favorites.all, 'list'] as const,
  },
  users: {
    all: ['users'] as const,
  },
  testimonials: {
    all: ['testimonials'] as const,
  },
};
