import type {
  FollowActionResponse,
  FollowListResponse,
  PaginationQuery,
  UserIdParams,
} from '@repo/shared';
import type { Request, Response } from 'express';

import { BadRequestError, ConflictError, NotFoundError } from '@/errors/http.error';
import prisma from '@/lib/prisma';

export class UsersController {
  getFollowing = async (
    req: Request,
    res: Response<FollowListResponse, { query: PaginationQuery }>,
  ) => {
    const { page, limit } = res.locals.query;
    const followerId = req.user!.id;
    const [follows, totalCount] = await Promise.all([
      prisma.userFollow.findMany({
        where: { followerId },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              avatar: true,
              recipes: {
                select: { id: true, title: true, thumb: true, preview: true, time: true },
                orderBy: { id: 'asc' },
              },
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }, { followingId: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.userFollow.count({ where: { followerId } }),
    ]);

    return this.sendList(res, follows.map(({ following }) => following), page, limit, totalCount);
  };

  getFollowers = async (
    req: Request<UserIdParams>,
    res: Response<FollowListResponse, { query: PaginationQuery }>,
  ) => {
    const { id: followingId } = req.params;
    const { page, limit } = res.locals.query;
    await this.ensureUserExists(followingId);

    const [follows, totalCount] = await Promise.all([
      prisma.userFollow.findMany({
        where: { followingId },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              avatar: true,
              recipes: {
                select: { id: true, title: true, thumb: true, preview: true, time: true },
                orderBy: { id: 'asc' },
              },
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }, { followerId: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.userFollow.count({ where: { followingId } }),
    ]);

    return this.sendList(res, follows.map(({ follower }) => follower), page, limit, totalCount);
  };

  follow = async (
    req: Request<UserIdParams>,
    res: Response<FollowActionResponse>,
  ) => {
    const followerId = req.user!.id;
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

    return res.status(201).json({ message: 'Successfully followed user' });
  };

  unfollow = async (req: Request<UserIdParams>, res: Response) => {
    const followerId = req.user!.id;
    const { id: followingId } = req.params;
    await this.ensureUserExists(followingId);

    const result = await prisma.userFollow.deleteMany({ where: { followerId, followingId } });
    if (result.count === 0) {
      throw new NotFoundError('Follow relationship not found');
    }

    return res.status(204).send();
  };

  private ensureUserExists = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!user) {
      throw new NotFoundError('User not found');
    }
  };

  private sendList = (
    res: Response<FollowListResponse>,
    users: FollowListResponse['users'],
    page: number,
    limit: number,
    totalCount: number,
  ) => {
    res.setHeader('X-Total-Count', totalCount);
    return res.status(200).json({
      users,
      pagination: { page, limit, totalCount, totalPages: Math.ceil(totalCount / limit) },
    });
  };
}

export const usersController = new UsersController();