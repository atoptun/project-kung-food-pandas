import type { CurrentUserProfileResponse, UserPublicProfileResponse } from '@repo/shared';
import {
  type QueryFilters,
  useIsMutating,
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@/api/keys';
import { updateClientAvatar } from '@/lib/auth-client';

import { usersApi } from './users.api';

export function useProfileQuery(viewerId: string, id: string) {
  return useQuery<CurrentUserProfileResponse | UserPublicProfileResponse>({
    queryKey: queryKeys.users.profile(viewerId, id),
    queryFn: () => (viewerId === id ? usersApi.getCurrent() : usersApi.getProfile(id)),
    enabled: Boolean(viewerId && id),
  });
}

export function useAvatarUpload(userId: string) {
  const client = useQueryClient();
  const mutationKey = [...queryKeys.users.all, 'avatar', userId];
  const filters = { mutationKey, exact: true };
  const isPending = useIsMutating(filters) > 0;
  const mutation = useMutation({
    mutationKey,
    mutationFn: usersApi.uploadAvatar,
    onSuccess: async (profile) => {
      if (profile.user.id !== userId || !updateClientAvatar(userId, profile.user.avatar ?? null))
        return;
      client.setQueryData(queryKeys.users.profile(userId, userId), profile);
      await client.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  return {
    isPending,
    upload(file: File) {
      if (!client.isMutating(filters)) mutation.mutate(file);
    },
  };
}

type FollowVariables = { id: string; follow: boolean };

/** Share pending follow actions between the profile and every UserCard. */
export function useFollows(viewerId: string) {
  const client = useQueryClient();
  const mutationKey = [...queryKeys.users.all, 'follow', viewerId];
  const filters = { mutationKey, exact: true };
  const pendingIds = useMutationState({
    filters: { ...filters, status: 'pending' },
    select: (mutation) => (mutation.state.variables as FollowVariables | undefined)?.id,
  });
  const mutation = useMutation({
    mutationKey,
    mutationFn: ({ id, follow }: FollowVariables) => usersApi.setFollowing(id, follow),
    onSuccess: async () => {
      const viewerQueries: QueryFilters = {
        queryKey: queryKeys.users.all,
        predicate: ({ queryKey: [, kind, viewer] }) =>
          viewer === viewerId && (kind === 'profile' || kind === 'list'),
      };
      client.removeQueries({ ...viewerQueries, type: 'inactive' });

      // Replace in-flight reads immediately so their callers wait for the new response.
      await Promise.all([
        client.cancelQueries(viewerQueries, { silent: true, revert: false }),
        client.invalidateQueries(viewerQueries),
      ]);
    },
  });

  return {
    isPending: (id: string) => pendingIds.includes(id),
    toggle(id: string, isFollowing: boolean) {
      if (!viewerId || id === viewerId) return;
      const isPending = client.isMutating({
        ...filters,
        predicate: (entry) => (entry.state.variables as FollowVariables | undefined)?.id === id,
      });
      if (isPending) return;
      mutation.mutate({ id, follow: !isFollowing });
    },
  };
}
