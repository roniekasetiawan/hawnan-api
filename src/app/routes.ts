import type { Hono } from 'hono';
import { pingRoutes } from '@/modules/core/http/ping.routes';
import { userRoutes } from '@/modules/user/http/user.routes';
import type { AppEnv } from '@/app/index';

export function registerRoutes(app: Hono<AppEnv>) {
  app.route('/core', pingRoutes);
  app.route('/users', userRoutes);
}
