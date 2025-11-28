import type { MiddlewareHandler } from 'hono';
import { ResponseBuilder } from '@/core/http/response';
import { CtxKeys } from '@/utils/ctx/keys';
import { UserContextPayload } from './auth.middleware';

export const requireRole = (roles: string[]): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.get(CtxKeys.USER) as UserContextPayload;
    if (!user) {
      return ResponseBuilder.Error({ c, message: 'Unauthenticated', status: 401 });
    }

    const hasRole = user.roles.some((r: any) => roles.includes(r));
    if (!hasRole) {
      return ResponseBuilder.Error({ c, message: 'Forbidden', status: 401 });
    }

    await next();
  };
};
