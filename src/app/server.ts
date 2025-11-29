import { Hono } from 'hono';
import { registerRoutes } from './routes';
import { registerErrorHandler } from '@/app/error-handler';
import { AppEnv } from '@/app/index';
import { requestLogger } from '@/app/middlewares/logger.middleware';
import { Logger } from '@/utils/logger/logger';

export function createApp({ log }: { log: Logger }) {
  const app = new Hono<AppEnv>();

  app.use('*', requestLogger({ log }));

  app.get('/health', c => c.json({ status: 'okS', uptime: process.uptime() }));

  registerRoutes({ app, log });
  registerErrorHandler({app,log});

  return app;
}
