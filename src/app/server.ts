import { Hono } from 'hono';
import { registerRoutes } from './routes';
import { registerErrorHandler } from '@/app/error-handler';
import { AppEnv } from '@/app/index';

export function createApp() {
  const app = new Hono<AppEnv>();

  app.get('/health', c => c.json({ status: 'ok', uptime: process.uptime() }));

  registerRoutes(app);
  registerErrorHandler(app);

  return app;
}
