import type { MiddlewareHandler } from 'hono';
import { ResponseBuilder } from '@/core/http/response';
import { verify } from 'hono/jwt';
import { HeaderKeys } from '@/utils/headers/keys';
import { CtxKeys } from '@/utils/ctx/keys';

export interface UserContextPayload {
  id: string;
  email: string;
  roles: string[];
}

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header(HeaderKeys.AUTHORIZATION) ?? '';

  if (!authHeader.startsWith('Bearer ')) {
    return ResponseBuilder.Error({ c, message: 'Missing or invalid token', status: 401 });
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set(CtxKeys.USER, {
      id: String(payload.sub),
      email: String(payload.email),
      roles: Array.isArray(payload.roles) ? payload.roles : [],
    } as UserContextPayload);

    await next();
  } catch (err) {
    return ResponseBuilder.Error({ c, message: 'Invalid or expired token', status: 401 });
  }
};
