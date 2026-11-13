import { unlink } from 'node:fs/promises';

import type { CurrentUserProfileResponse, UserPublicProfileResponse } from '@repo/shared';
import type { v2 as Cloudinary } from 'cloudinary';

import logger from '@/config/logger';
import { NotFoundError } from '@/errors/http.error';
import type { PrismaClient } from '@/generated/prisma/client';

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
    },
  },
} as const;

export class UsersService {
  constructor(
    private db: PrismaClient,
    private storage: typeof Cloudinary,
  ) {}

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
      // TODO(#17): count from the follows relation once subscriptions are added to the schema
      followersCount: 0,
      followingCount: 0,
    };
  };

  getPublicProfile = async (userId: string): Promise<UserPublicProfileResponse> => {
    const user = await this.findProfileOrThrow(userId);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      recipesCount: user._count.recipes,
      // TODO(#17): count from the follows relation once subscriptions are added to the schema
      followersCount: 0,
    };
  };

  updateAvatar = async (userId: string, filePath: string): Promise<CurrentUserProfileResponse> => {
    try {
      const { secure_url } = await this.storage.uploader.upload(filePath, {
        folder: AVATARS_FOLDER,
        resource_type: 'image',
      });

      await this.db.user.update({
        where: { id: userId },
        data: { avatar: secure_url },
      });
    } finally {
      await unlink(filePath).catch((error: unknown) => {
        logger.warn({ err: error, filePath }, 'Failed to remove temporary upload file');
      });
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
