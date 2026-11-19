import {
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
  return useQuery({
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

/** One relationship cache and mutation lifecycle for the profile and every UserCard. */
export function useFollows(viewerId: string, needsLookup: boolean) {
  const client = useQueryClient();
  const mutationKey = [...queryKeys.users.all, 'follow', viewerId];
  const filters = { mutationKey, exact: true };
  const followingIdsKey = queryKeys.users.followingIds(viewerId);
  const ids = useQuery({
    queryKey: followingIdsKey,
    queryFn: ({ signal }) => usersApi.loadAllFollowingIds(signal),
    enabled: needsLookup && Boolean(viewerId),
  });
  const pendingIds = useMutationState({
    filters: { ...filters, status: 'pending' },
    select: (mutation) => (mutation.state.variables as FollowVariables | undefined)?.id,
  });
  const mutation = useMutation({
    mutationKey,
    mutationFn: ({ id, follow }: FollowVariables) => usersApi.setFollowing(id, follow),
    onSuccess: async (_, { id, follow }) => {
      await client.cancelQueries({ queryKey: followingIdsKey, exact: true });
      client.setQueryData<string[]>(followingIdsKey, (previous) => {
        if (!previous) return previous;
        if (!follow) return previous.filter((followingId) => followingId !== id);
        return previous.includes(id) ? previous : [...previous, id];
      });
      await client.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  return {
    getStatus: (id: string) => (ids.isSuccess ? ids.data.includes(id) : undefined),
    isPending: (id: string) => pendingIds.includes(id),
    toggle(id: string, isFollowing: boolean | undefined) {
      if (!viewerId || id === viewerId || isFollowing === undefined) return;
      const isPending = client.isMutating({
        ...filters,
        predicate: (entry) => (entry.state.variables as FollowVariables | undefined)?.id === id,
      });
      if (isPending) return;
      mutation.mutate({ id, follow: !isFollowing });
    },
    isError: needsLookup && ids.isError,
    isFetching: ids.isFetching,
    retry: () => void ids.refetch(),
  };
}
