import { createApp } from './app/server';
import { env } from './config/env';

const app = createApp();

export default {
    port: env.PORT,
    fetch: app.fetch,
};
