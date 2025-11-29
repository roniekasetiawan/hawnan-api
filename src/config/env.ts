function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing env: ${name}`);
    }
    return value;
}

export const env = {
  app: {
    port: Number(process.env.APP_PORT ?? 3000),
    env: process.env.APP_ENV ?? 'local',
  },
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'hawnan',
    password: process.env.DB_PASSWORD ?? 'hawnan_password',
    name: process.env.DB_NAME ?? 'hawnan_db',
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT ?? 'http://localhost:9000',
    accessKey: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin123',
    bucket: process.env.MINIO_BUCKET ?? 'uploads',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'a-very-secure-secret-you-should-change',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '3600', // 1 hour in seconds
  },
}
