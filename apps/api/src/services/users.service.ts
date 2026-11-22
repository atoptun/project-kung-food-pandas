import type {
  CurrentUserProfileResponse,
  FollowActionResponse,
  UserFollowerItem,
  UserFollowersListResponse,
  UserPublicProfileResponse,
} from '@repo/shared';

import env from '@/config/env';
import { BadRequestError, ConflictError, NotFoundError } from '@/errors/http.error';
import type { PrismaClient } from '@/generated/prisma/client';
import { deleteFromCloudinary, uploadFromBuffer } from '@/lib/cloudinary';
import { isPrismaError, PrismaErrorCode } from '@/lib/prisma-errors';

const AVATARS_FOLDER = 'avatars';

const profileSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  _count: {
    select: {
      recipes: true,
      favoriteRecipes: true,
      followers: true,
      following: true,
    },
  },
} as const;

export class UsersService {
  constructor(private db: PrismaClient) {}

  getCurrentProfile = async (userId: string): Promise<CurrentUserProfileResponse> => {
    const user = await this.findProfileOrThrow(userId);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      recipesCount: user._count.recipes,
      favoritesCount: user._count.favoriteRecipes,
      followersCount: user._count.followers,
      followingCount: user._count.following,
    };
  };

  getPublicProfile = async (
    targetUserId: string,
    currentUserId: string,
  ): Promise<UserPublicProfileResponse> => {
    const user = await this.findProfileOrThrow(targetUserId);

    let isFollowing = false;
    if (currentUserId !== targetUserId) {
      const followCount = await this.db.follow.count({
        where: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      });
      isFollowing = followCount > 0;
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      recipesCount: user._count.recipes,
      followersCount: user._count.followers,
      isFollowing,
    };
  };

  followUser = async (
    currentUserId: string,
    targetUserId: string,
  ): Promise<FollowActionResponse> => {
    if (currentUserId === targetUserId) {
      throw new BadRequestError('Cannot follow yourself');
    }

    try {
      await this.db.follow.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.UniqueConstraint)) {
        throw new ConflictError('Already following this user');
      }
      if (isPrismaError(error, PrismaErrorCode.ForeignKeyConstraint)) {
        throw new NotFoundError('User not found');
      }
      throw error;
    }

    return { message: 'Successfully followed the user.' };
  };

  unfollowUser = async (
    currentUserId: string,
    targetUserId: string,
  ): Promise<FollowActionResponse> => {
    if (currentUserId === targetUserId) {
      throw new NotFoundError('Cannot unfollow yourself');
    }

    const { count } = await this.db.follow.deleteMany({
      where: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    if (count === 0) {
      throw new NotFoundError('User not found or not currently followed');
    }

    return { message: 'Successfully unfollowed the user.' };
  };

  getFollowing = async (
    currentUserId: string,
    page: number,
    limit: number,
  ): Promise<UserFollowersListResponse> => {
    const offset = (page - 1) * limit;

    const [follows, total] = await Promise.all([
      this.db.follow.findMany({
        where: { followerId: currentUserId },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          following: {
            select: {
              id: true,
              name: true,
              avatar: true,
              _count: {
                select: { recipes: true },
              },
              recipes: {
                select: {
                  id: true,
                  title: true,
                  thumb: true,
                },
                orderBy: { updatedAt: 'desc' },
                take: 4,
              },
            },
          },
        },
      }),
      this.db.follow.count({
        where: { followerId: currentUserId },
      }),
    ]);

    const items: UserFollowerItem[] = follows.map(({ following }) => ({
      user: {
        id: following.id,
        name: following.name,
        avatar: following.avatar,
      },
      recipesCount: following._count.recipes,
      topRecipes: following.recipes,
      isFollowing: true,
    }));

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      items,
    };
  };

  getFollowers = async (
    currentUserId: string,
    targetUserId: string,
    page: number,
    limit: number,
  ): Promise<UserFollowersListResponse> => {
    await this.findProfileOrThrow(targetUserId);

    const offset = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      this.db.follow.findMany({
        where: { followingId: targetUserId },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              avatar: true,
              _count: {
                select: { recipes: true },
              },
              recipes: {
                select: {
                  id: true,
                  title: true,
                  thumb: true,
                },
                orderBy: { updatedAt: 'desc' },
                take: 4,
              },
            },
          },
        },
      }),
      this.db.follow.count({
        where: { followingId: targetUserId },
      }),
    ]);

    const followerIds = followers.map((f) => f.follower.id);

    let followedIdsSet = new Set<string>();
    if (followerIds.length > 0) {
      const currentFollows = await this.db.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: followerIds },
        },
        select: { followingId: true },
      });
      followedIdsSet = new Set(currentFollows.map((f) => f.followingId));
    }

    const items: UserFollowerItem[] = followers.map(({ follower }) => ({
      user: {
        id: follower.id,
        name: follower.name,
        avatar: follower.avatar,
      },
      recipesCount: follower._count.recipes,
      topRecipes: follower.recipes,
      isFollowing: follower.id !== currentUserId && followedIdsSet.has(follower.id),
    }));

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      items,
    };
  };

  updateAvatar = async (userId: string, buffer: Buffer): Promise<CurrentUserProfileResponse> => {
    if (!buffer || buffer.length === 0) {
      throw new BadRequestError('Avatar file is required');
    }

    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: { id: true, avatar: true, avatarId: true },
    });

    const { secure_url, public_id } = await uploadFromBuffer(buffer, {
      folder: `${env.CLOUDINARY_FOLDER_BASE}/${AVATARS_FOLDER}`,
    });

    try {
      await this.db.user.update({
        where: { id: userId },
        data: { avatar: secure_url, avatarId: public_id },
      });
    } catch (dbError) {
      await deleteFromCloudinary(public_id);
      throw dbError;
    }

    if (user?.avatarId) {
      await deleteFromCloudinary(user.avatarId);
    }

    return this.getCurrentProfile(userId);
  };

  private findProfileOrThrow = async (userId: string) => {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: profileSelect,
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  };
}
