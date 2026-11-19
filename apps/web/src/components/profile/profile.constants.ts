export type ProfileTab = 'recipes' | 'favorites' | 'followers' | 'following';
export type ProfileTabOption = { id: ProfileTab; label: string };

export const OWN_PROFILE_TABS: readonly ProfileTabOption[] = [
  { id: 'recipes', label: 'My recipes' },
  { id: 'favorites', label: 'My favorites' },
  { id: 'followers', label: 'Followers' },
  { id: 'following', label: 'Following' },
];

export const OTHER_PROFILE_TABS: readonly ProfileTabOption[] = [
  { id: 'recipes', label: 'Recipes' },
  { id: 'followers', label: 'Followers' },
];

export const OWN_PROFILE_EMPTY_MESSAGES: Record<ProfileTab, string> = {
  recipes:
    'Nothing has been added to your recipes list yet. Please browse our recipes and add your favorites for easy access in the future.',
  favorites:
    'Nothing has been added to your favorite recipes list yet. Please browse our recipes and add your favorites for easy access in the future.',
  followers:
    'There are currently no followers on your account. Please engage our visitors with interesting content and draw their attention to your profile.',
  following:
    'Your account currently has no subscriptions to other users. Learn more about our users and select those whose content interests you.',
};

export const OTHER_PROFILE_EMPTY_MESSAGES = {
  recipes: 'This user has not added any recipes yet.',
  followers: 'This user has no followers yet.',
};

export const PROFILE_PAGE_SIZES = {
  recipes: 9,
  favorites: 9,
  followers: 5,
  following: 5,
} satisfies Record<ProfileTab, number>;

export const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
export const AVATAR_FILE_ERROR = 'Choose a JPEG, PNG or WebP image up to 5 MB.';
