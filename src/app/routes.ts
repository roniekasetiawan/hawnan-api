import type { Hono } from 'hono'
import { pingRoutes } from '../modules/core/http/ping.routes'
import { userRoutes } from '../modules/user/http/user.routes'

export function registerRoutes(app: Hono) {
  app.route('/core', pingRoutes)
  app.route('/users', userRoutes)
}
