import { createApp } from './app/server';
import { env } from './config/env';
import { loggerRAW } from './config/logger';

const log = loggerRAW;
const app = createApp({ log });

export default {
    port: env.app.port,
    fetch: app.fetch,
};
