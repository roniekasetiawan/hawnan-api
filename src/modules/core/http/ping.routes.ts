import { Hono } from 'hono';

export function pingRoutes() {
    const app = new Hono();

    app.get('/ping', (c) => c.json({ message: 'pong' }));

    return app;
}
