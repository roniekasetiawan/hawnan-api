import type { Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { AppContext } from '@/app'

function verifyToken(token: string) {
  const [userId, role] = token.split(':')
  if (!userId) throw new Error('invalid token')
  return {
    userId,
    role: (role as 'admin' | 'member' | 'guest') || 'member',
  }
}

export async function authMiddleware(c: AppContext, next: Next) {
  const authHeader = c.req.header('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.slice('Bearer '.length).trim()

  try {
    const payload = verifyToken(token)

    c.set('userId', payload.userId)
    c.set('userRole', payload.role)

    await next()
  } catch (err) {
    throw new HTTPException(401, { message: 'Invalid token' })
  }
}
