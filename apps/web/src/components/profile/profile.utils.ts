import {
  OTHER_PROFILE_EMPTY_MESSAGES,
  OWN_PROFILE_EMPTY_MESSAGES,
  type ProfileTab,
} from './profile.constants';

export function getEmptyMessage(tab: ProfileTab, isOwn: boolean) {
  if (isOwn) return OWN_PROFILE_EMPTY_MESSAGES[tab];
  if (tab === 'recipes') return OTHER_PROFILE_EMPTY_MESSAGES.recipes;
  return OTHER_PROFILE_EMPTY_MESSAGES.followers;
}

export function getNextTabIndex(key: string, index: number, count: number) {
  switch (key) {
    case 'ArrowRight':
      return (index + 1) % count;
    case 'ArrowLeft':
      return (index + count - 1) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return undefined;
  }
}
