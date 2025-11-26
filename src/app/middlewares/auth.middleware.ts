import type { MiddlewareHandler } from 'hono';
import { ResponseBuilder } from '@/core/http/response';
import { verify } from 'hono/jwt';

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('authorization') ?? '';

  if (!authHeader.startsWith('Bearer ')) {
    return ResponseBuilder.Error({ c, message: 'Missing or invalid token', status: 401 });
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verify(token, c.env.JWT_SECRET);

    c.set('user', {
      id: String(payload.sub),
      email: String(payload.email),
      roles: Array.isArray(payload.roles) ? payload.roles : [],
    });

    await next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return ResponseBuilder.Error({ c, message: 'Invalid or expired token', status: 401 });
  }
};
