import { Hono } from 'hono';
import { pingRoutes } from '@/modules/core/http/ping.routes';
import { userRoutes } from '@/modules/user/http/user.routes';
import type { AppEnv } from '@/app/index';
import { authMiddleware } from '@/app/middlewares/auth.middleware';

export function registerRoutes(app: Hono<AppEnv>) {
  const publicRoutes = new Hono<AppEnv>();
  publicRoutes.route('/core', pingRoutes);

  const privateRoutes = new Hono<AppEnv>();
  privateRoutes.use('*', authMiddleware);
  privateRoutes.route('/users', userRoutes);

  app.route('/api', publicRoutes);
  app.route('/api', privateRoutes);
}
