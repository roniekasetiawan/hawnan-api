export type LokiConfig = {
  url: string;
  labels: Record<string, string>;
};

export const lokiConfig: LokiConfig = {
  url: process.env.LOKI_URL || 'http://localhost:3100',
  labels: {
    app: process.env.APP_NAME || 'hawnan-api',
    environment: process.env.NODE_ENV || 'development',
  },
};
