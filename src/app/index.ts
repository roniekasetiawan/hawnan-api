import type { Context } from 'hono';

export type AppVariables = {
  userId?: string;
  userRole?: 'admin' | 'member' | 'guest';
  requestId?: string;
};

export type AppEnv = {
  Variables: AppVariables;
};

export type AppContext = Context<AppEnv>;
