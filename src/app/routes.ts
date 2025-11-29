import { Hono } from 'hono';
import { pingRoutes } from '@/modules/core/http/ping.routes';
import { UserRoute } from '@/modules/user/http/user.routes';
import type { AppEnv } from '@/app/index';
import { authMiddleware } from '@/app/middlewares/auth.middleware';
import { UserRepository } from '@/modules/user/user.repository';
import { UserService } from '@/modules/user/user.service';
import { UserController } from '@/modules/user/user.controller';
import { prisma } from '@/config/prisma';
import { Logger } from '@/utils/logger/logger';

export function registerRoutes({ app, log }: { app: Hono<AppEnv>; log: Logger }) {
  // REPOSITORY
  const userRepository = new UserRepository({db: prisma});
  // SERVICE
  const userService = new UserService({ userRepository,log });
  // CONTROLLER
  const userController = new UserController({ userService, log });

  // ROUTES
  const userRoutes = new UserRoute({ userController });

  const publicRoutes = new Hono<AppEnv>();
  publicRoutes.route('/core', pingRoutes);

  const privateRoutes = new Hono<AppEnv>();
  privateRoutes.use('*', authMiddleware);
  privateRoutes.route('/users', userRoutes.routes());

  app.route('/api', publicRoutes);
  app.route('/api', privateRoutes);
}
