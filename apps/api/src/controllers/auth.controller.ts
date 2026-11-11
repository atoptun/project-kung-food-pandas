import type { AuthResponse, LoginInput, RegisterInput } from '@repo/shared';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request, Response } from 'express';

import { auth } from '@/lib/auth';

export class AuthController {
  register = async (
    req: Request<Record<string, string>, AuthResponse, RegisterInput>,
    res: Response<AuthResponse>,
  ) => {
    const result = await auth.api.signUpEmail({
      body: req.body,
    });

    res.status(201).json({
      token: result.token ?? '',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        avatar: result.user.image ?? null,
      },
    });
  };

  login = async (
    req: Request<Record<string, string>, AuthResponse, LoginInput>,
    res: Response<AuthResponse>,
  ) => {
    const result = await auth.api.signInEmail({
      body: req.body,
    });

    res.status(200).json({
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        avatar: result.user.image ?? null,
      },
    });
  };

  logout = async (req: Request, res: Response) => {
    await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
    });

    res.status(204).send();
  };
}
