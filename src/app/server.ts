import { Hono } from 'hono';
import { pingRoutes } from '../modules/core/http/ping.routes';

export function createApp() {
    const app = new Hono();

    app.get('/health', (c) => c.json({ status: 'ok', uptime: process.uptime() }));
    app.route('/core', pingRoutes());

    return app;
}
