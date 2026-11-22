import type {
  CurrentUserProfileResponse,
  FollowActionResponse,
  PaginationQuery,
  UserFollowersListResponse,
  UserIdParam,
  UserPublicProfileResponse,
} from '@repo/shared';
import type { Request, Response } from 'express';

import { UnprocessableEntityError } from '@/errors/http.error';
import { getAuthUserId } from '@/middlewares/auth.middleware';
import type { UsersService } from '@/services/users.service';

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
    const profile = await this.service.getPublicProfile(req.params.id, getAuthUserId(req));
    res.status(200).json(profile);
  };

  follow = async (req: Request<UserIdParam>, res: Response<FollowActionResponse>) => {
    const result = await this.service.followUser(getAuthUserId(req), req.params.id);
    res.status(201).json(result);
  };

  unfollow = async (req: Request<UserIdParam>, res: Response<void>) => {
    await this.service.unfollowUser(getAuthUserId(req), req.params.id);
    res.status(204).send();
  };

  getFollowing = async (
    req: Request,
    res: Response<UserFollowersListResponse, { query: PaginationQuery }>,
  ) => {
    const page = res.locals.query.page || 1;
    const limit = res.locals.query.limit || 10;
    const result = await this.service.getFollowing(getAuthUserId(req), page, limit);
    res.status(200).json(result);
  };

  getFollowers = async (
    req: Request<UserIdParam>,
    res: Response<UserFollowersListResponse, { query: PaginationQuery }>,
  ) => {
    const page = res.locals.query.page || 1;
    const limit = res.locals.query.limit || 10;
    const result = await this.service.getFollowers(getAuthUserId(req), req.params.id, page, limit);
    res.status(200).json(result);
  };

  updateAvatar = async (req: Request, res: Response<CurrentUserProfileResponse>) => {
    const userId = getAuthUserId(req);

    if (!req.file) {
      throw new UnprocessableEntityError('Validation failed', [
        { path: 'avatar', message: 'Avatar file is required' },
      ]);
    }

    const profile = await this.service.updateAvatar(userId, req.file.buffer);
    res.status(200).json(profile);
  };
}
