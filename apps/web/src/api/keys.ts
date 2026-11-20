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
    /** Pages of the current user's favorites (profile "My favorites" tab). */
    list: (params: Record<string, unknown>) =>
      [...queryKeys.favorites.all, 'list', params] as const,
  },
  users: {
    all: ['users'] as const,
    profile: (viewerId: string, id: string) => ['users', 'profile', viewerId, id] as const,
    list: (viewerId: string, id: string, tab: string, page: number) =>
      ['users', 'list', viewerId, id, tab, page] as const,
  },
  testimonials: {
    all: ['testimonials'] as const,
  },
};
