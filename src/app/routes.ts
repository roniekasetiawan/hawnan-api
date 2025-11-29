import { Hono } from 'hono';
import { pingRoutes } from '@/modules/core/http/ping.routes';
import { UserRoute } from '@/modules/user/http/user.routes';
import type { AppEnv } from '@/app/index';
import { authMiddleware } from '@/app/middlewares/auth.middleware';
import { UserRepository } from '@/modules/user/user.repository';
import { UserService } from '@/modules/user/user.service';
import { UserController } from '@/modules/user/user.controller';
import { prisma } from '@/config/prisma';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthRoute } from '@/modules/auth/http/auth.routes';
import { env } from '@/config/env';

export function registerRoutes(app: Hono<AppEnv>) {
  // REPOSITORY
  const userRepository = new UserRepository(prisma);

  // SERVICES
  const userService = new UserService({ userRepository });
  const authService = new AuthService(userRepository, env.jwt.secret, env.jwt.expiresIn);

  // CONTROLLERS
  const userController = new UserController({ userService });
  const authController = new AuthController(authService);

  // ROUTES
  const authRoutes = new AuthRoute(authController);

  const publicRoutes = new Hono<AppEnv>();
  publicRoutes.route('/core', pingRoutes);
  publicRoutes.route('/auth', authRoutes.routes);
  // User registration is public
  publicRoutes.post('/users', c => userController.create(c));

  const privateRoutes = new Hono<AppEnv>();
  privateRoutes.use('*', authMiddleware);
  // Other user routes are private
  privateRoutes.get('/users', c => userController.getAll(c));
  privateRoutes.get('/users/:id', c => userController.getById(c));
  privateRoutes.put('/users/:id', c => userController.update(c));
  privateRoutes.delete('/users/:id', c => userController.delete(c));

  app.route('/api', publicRoutes);
  app.route('/api', privateRoutes);
}
