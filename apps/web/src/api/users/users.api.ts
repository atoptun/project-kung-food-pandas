import type {
  CurrentUserProfileResponse,
  PaginationQuery,
  UserFollowersListResponse,
  UserPublicProfileResponse,
  UserRecipesListResponse,
} from '@repo/shared';
import { isAxiosError } from 'axios';

import { apiClient } from '@/api/client';

export const usersApi = {
  getCurrent: async () => (await apiClient.get<CurrentUserProfileResponse>('/users/me')).data,
  getProfile: async (id: string) =>
    (await apiClient.get<UserPublicProfileResponse>(`/users/${encodeURIComponent(id)}`)).data,
  getRecipes: async (id: string, params: PaginationQuery) =>
    (
      await apiClient.get<UserRecipesListResponse>(`/users/${encodeURIComponent(id)}/recipes`, {
        params,
      })
    ).data,
  getFollowing: async (params: PaginationQuery) =>
    (await apiClient.get<UserFollowersListResponse>('/users/me/following', { params })).data,
  getFollowers: async (id: string, params: PaginationQuery) =>
    (
      await apiClient.get<UserFollowersListResponse>(`/users/${encodeURIComponent(id)}/followers`, {
        params,
      })
    ).data,
  setFollowing: async (id: string, follow: boolean) => {
    const url = `/users/me/following/${encodeURIComponent(id)}`;
    try {
      if (follow) await apiClient.post(url);
      else await apiClient.delete(url);
    } catch (error) {
      if (follow && isAxiosError(error) && error.response?.status === 409) return;
      throw error;
    }
  },
  uploadAvatar: async (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return (
      await apiClient.patch<CurrentUserProfileResponse>('/users/me/avatar', form, {
        headers: { 'Content-Type': undefined },
      })
    ).data;
  },
};
