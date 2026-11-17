import { useMutation, useMutationState, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/keys';
import { useAuth } from '@/hooks/use-auth';
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
  return useMutation({
    mutationFn: usersApi.uploadAvatar,
    onSuccess: async (profile) => {
      if (profile.user.id !== userId || !updateClientAvatar(userId, profile.user.avatar ?? null))
        return;
      client.setQueryData(queryKeys.users.profile(userId, userId), profile);
      await client.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

type FollowVariables = { id: string; follow: boolean };

/** One relationship cache and mutation lifecycle for the profile and every UserCard. */
export function useFollows() {
  const { user } = useAuth();
  const client = useQueryClient();
  const userId = user?.id ?? '';
  const idsKey = queryKeys.users.followingIds(userId);
  const mutationKey = [...queryKeys.users.all, 'follow', userId];
  const ids = useQuery({
    queryKey: idsKey,
    queryFn: usersApi.getFollowingIds,
    enabled: Boolean(userId),
  });
  const pendingIds = useMutationState({
    filters: { mutationKey, status: 'pending' },
    select: (mutation) => (mutation.state.variables as FollowVariables | undefined)?.id,
  });
  const mutation = useMutation({
    mutationKey,
    mutationFn: ({ id, follow }: FollowVariables) => usersApi.setFollowing(id, follow),
    onSuccess: async (_data, { id, follow }) => {
      client.setQueryData<string[]>(idsKey, (current = []) =>
        follow ? [...new Set([...current, id])] : current.filter((value) => value !== id),
      );
      await client.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  return {
    isFollowing: (id: string) => ids.data?.includes(id) ?? false,
    isPending: (id: string) => !ids.isSuccess || pendingIds.includes(id),
    toggle: (id: string) => {
      if (!userId || id === userId || !ids.isSuccess || pendingIds.includes(id)) return;
      mutation.mutate({ id, follow: !ids.data.includes(id) });
    },
    isError: ids.isError,
    isFetching: ids.isFetching,
    retry: () => void ids.refetch(),
  };
}
