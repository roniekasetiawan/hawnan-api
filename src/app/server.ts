import { Hono } from 'hono'
import { registerRoutes } from './routes'

export function createApp() {
  const app = new Hono()

  app.get('/health', (c) =>
    c.json({ status: 'ok', uptime: process.uptime() }),
  )

  registerRoutes(app)

  return app
}
