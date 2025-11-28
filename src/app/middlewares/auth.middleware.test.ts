import { describe, it, expect } from 'bun:test';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { HeaderKeys } from '@/utils/headers/keys';
import { authMiddleware } from '@/app/middlewares/auth.middleware';

describe('authMiddleware', () => {
  const JWT_SECRET = 'test-secret-key';
  const app = new Hono();
  app.use('*', (c, next) => {
    c.env = { JWT_SECRET };
    return next();
  });

  // example of protected endpoint
  app.use('/protected/*', authMiddleware);
  app.get('/protected/user', c => {
    const user = c.get('user' as never) ?? {};
    return c.json(user);
  });

  // example of unprotected endpoint
  app.get('/unprotected', c => c.text('unprotected'));

  it('should return 401 if Authorization header is missing', async () => {
    const req = new Request('http://localhost/protected/user');
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.responseMessage).toBe('Missing or invalid token');
  });

  it('should return 401 if Authorization header does not start with "Bearer "', async () => {
    const req = new Request('http://localhost/protected/user', {
      headers: {
        [HeaderKeys.AUTHORIZATION]: 'Basic some-token',
      },
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.responseMessage).toBe('Missing or invalid token');
  });

  it('should return 401 if token is invalid', async () => {
    const req = new Request('http://localhost/protected/user', {
      headers: {
        [HeaderKeys.AUTHORIZATION]: 'Bearer invalid-token',
      },
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.responseMessage).toBe('Invalid or expired token');
  });

  it('should return 401 if token is expired', async () => {
    const payload = {
      sub: 'user123',
      email: 'test@example.com',
      roles: ['user'],
      exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
    };
    const token = await sign(payload, JWT_SECRET);

    const req = new Request('http://localhost/protected/user', {
      headers: {
        [HeaderKeys.AUTHORIZATION]: `Bearer ${token}`,
      },
    });
    
    const res = await app.fetch(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.responseMessage).toBe('Invalid or expired token');
  });

  it('should set user context and call next middleware if token is valid', async () => {
    const payload = {
      sub: 'user123',
      email: 'test@example.com',
      roles: ['user'],
      exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
    };
    const token = await sign(payload, JWT_SECRET);

    const req = new Request('http://localhost/protected/user', {
      headers: {
        [HeaderKeys.AUTHORIZATION]: `Bearer ${token}`,
      },
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    const user = await res.json();
    expect(user).toEqual({
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    });
  });
});
