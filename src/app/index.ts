import type { Context } from 'hono';
import type { Env } from 'hono';

export type AppVariables = {
  userId?: string;
  userRole?: 'admin' | 'member' | 'guest';
  requestId?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  roles: string[];
};

export type AppEnv = Env & {
  Variables: {
    user?: AuthUser;
    requestId?: string;
    AppVariables?: AppVariables;
  };
  Bindings: {
    JWT_SECRET: string;
  };
};

export type AppContext = Context<AppEnv>;
