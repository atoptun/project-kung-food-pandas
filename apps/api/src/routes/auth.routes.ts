import { LoginSchema, RegisterSchema } from '@repo/shared';
import { Router } from 'express';

import { AuthController } from '@/controllers/auth.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { validateBody } from '@/middlewares/validate.middleware';

export const authRouter: Router = Router();

const controller = new AuthController();

authRouter.post('/register', validateBody(RegisterSchema), controller.register);
authRouter.post('/login', validateBody(LoginSchema), controller.login);
authRouter.post('/logout', authenticate, controller.logout);
