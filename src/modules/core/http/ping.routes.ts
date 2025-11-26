import { Hono } from 'hono'

export const pingRoutes = new Hono()

pingRoutes.get('/ping', (c) => c.json({ message: 'pong' }))
