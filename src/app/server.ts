import { Hono } from 'hono';
import { registerRoutes } from './routes';
import { registerErrorHandler } from '@/app/error-handler';
import { AppEnv } from '@/app/index';
import { requestLogger } from '@/app/middlewares/logger.middleware';

export function createApp() {
  const app = new Hono<AppEnv>();

  app.use('*', requestLogger());

  app.get('/health', c => c.json({ status: 'okS', uptime: process.uptime() }));

  registerRoutes(app);
  registerErrorHandler(app);

  return app;
}
