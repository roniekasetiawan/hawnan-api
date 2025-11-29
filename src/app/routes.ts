import { Hono } from 'hono';
import { pingRoutes } from '@/modules/core/http/ping.routes';
import { UserRoute } from '@/modules/user/http/user.routes';
import type { AppEnv } from '@/app/index';
import { authMiddleware } from '@/app/middlewares/auth.middleware';
import { UserRepository } from '@/modules/user/user.repository';
import { UserService } from '@/modules/user/user.service';
import { UserController } from '@/modules/user/user.controller';
import { prisma } from '@/config/prisma';

export function registerRoutes(app: Hono<AppEnv>) {
  // REPOSITORY
  const userRepository = new UserRepository(prisma);
  // SERVICE
  const userService = new UserService({ userRepository });
  // CONTROLLER
  const userController = new UserController({ userService });
  
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
