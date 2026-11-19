import type {
  CurrentUserProfileResponse,
  FollowActionResponse,
  PaginationQuery,
  UserFollowersListResponse,
  UserIdParam,
  UserPublicProfileResponse,
  UserRecipesListResponse,
} from '@repo/shared';
import type { Request, Response } from 'express';

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from '@/errors/http.error';
import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import type { UsersService } from '@/services/users.service';

const followUserSelect = {
  id: true,
  name: true,
  avatar: true,
  _count: { select: { recipes: true } },
  recipes: {
    select: { id: true, title: true, thumb: true },
    orderBy: { id: 'desc' },
    take: 4,
  },
} as const;

function getAuthUserId(req: Request): string {
  if (!req.user) {
    throw new UnauthorizedError('Not authorized');
  }
  return req.user.id;
}

export class UsersController {
  constructor(private service: UsersService) {}

  getCurrentProfile = async (req: Request, res: Response<CurrentUserProfileResponse>) => {
    const profile = await this.service.getCurrentProfile(getAuthUserId(req));
    res.status(200).json(profile);
  };

  getPublicProfile = async (
    req: Request<UserIdParam>,
    res: Response<UserPublicProfileResponse>,
  ) => {
    const profile = await this.service.getPublicProfile(req.params.id);
    res.status(200).json(profile);
  };

  updateAvatar = async (req: Request, res: Response<CurrentUserProfileResponse>) => {
    const userId = getAuthUserId(req);
    if (!req.file) {
      throw new UnprocessableEntityError('Validation failed', [
        { path: 'avatar', message: 'Avatar file is required' },
      ]);
    }
    const profile = await this.service.updateAvatar(userId, req.file.path);
    res.status(200).json(profile);
  };

  getFollowing = async (
    req: Request,
    res: Response<UserFollowersListResponse, { query: PaginationQuery }>,
  ) => {
    const { page, limit } = res.locals.query;
    const followerId = getAuthUserId(req);
    const [follows, total] = await Promise.all([
      prisma.userFollow.findMany({
        where: { followerId },
        include: { following: { select: followUserSelect } },
        orderBy: [{ createdAt: 'desc' }, { followingId: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.userFollow.count({ where: { followerId } }),
    ]);

    const items = follows.map(({ following }) => ({
      user: { id: following.id, name: following.name, avatar: following.avatar },
      recipesCount: following._count.recipes,
      topRecipes: following.recipes,
    }));
    return this.sendList(res, items, page, limit, total);
  };

  getFollowers = async (
    req: Request<UserIdParam>,
    res: Response<UserFollowersListResponse, { query: PaginationQuery }>,
  ) => {
    const { id: followingId } = req.params;
    const { page, limit } = res.locals.query;
    await this.ensureUserExists(followingId);

    const [follows, total] = await Promise.all([
      prisma.userFollow.findMany({
        where: { followingId },
        include: { follower: { select: followUserSelect } },
        orderBy: [{ createdAt: 'desc' }, { followerId: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.userFollow.count({ where: { followingId } }),
    ]);

    const items = follows.map(({ follower }) => ({
      user: { id: follower.id, name: follower.name, avatar: follower.avatar },
      recipesCount: follower._count.recipes,
      topRecipes: follower.recipes,
    }));
    return this.sendList(res, items, page, limit, total);
  };

  follow = async (req: Request<UserIdParam>, res: Response<FollowActionResponse>) => {
    const followerId = getAuthUserId(req);
    const { id: followingId } = req.params;

    if (followerId === followingId) {
      throw new BadRequestError('You cannot follow yourself');
    }
    await this.ensureUserExists(followingId);

    const result = await prisma.userFollow.createMany({
      data: [{ followerId, followingId }],
      skipDuplicates: true,
    });
    if (result.count === 0) {
      throw new ConflictError('Already following this user');
    }

    return res.status(201).json({ message: 'Successfully followed the user.' });
  };

  unfollow = async (req: Request<UserIdParam>, res: Response) => {
    const followerId = getAuthUserId(req);
    const { id: followingId } = req.params;
    await this.ensureUserExists(followingId);

    const result = await prisma.userFollow.deleteMany({ where: { followerId, followingId } });
    if (result.count === 0) {
      throw new NotFoundError('Follow relationship not found');
    }

    return res.status(204).send();
  };

  getUserRecipes = async (
    req: Request<UserIdParam>,
    res: Response<UserRecipesListResponse, { query: PaginationQuery }>,
  ) => {
    const { id: ownerId } = req.params;
    const { page, limit } = res.locals.query;
    await this.ensureUserExists(ownerId);
    const where = { ownerId };
    const [items, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        select: { id: true, title: true, thumb: true, description: true },
        orderBy: { id: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.recipe.count({ where }),
    ]);
    return res
      .status(200)
      .json({ items, total, page, totalPages: Math.ceil(total / limit), limit });
  };

  private ensureUserExists = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!user) {
      throw new NotFoundError('User not found');
    }
  };

  private sendList = (
    res: Response<UserFollowersListResponse>,
    items: UserFollowersListResponse['items'],
    page: number,
    limit: number,
    total: number,
  ) => {
    res.setHeader('X-Total-Count', total);
    return res
      .status(200)
      .json({ items, total, page, totalPages: Math.ceil(total / limit), limit });
  };
}

export const usersController = new UsersController();
