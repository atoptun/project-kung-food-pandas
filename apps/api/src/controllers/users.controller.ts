import type {
  CurrentUserProfileResponse,
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
}
