function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing env: ${name}`);
    }
    return value;
}

export const env = {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    PORT: Number(process.env.PORT ?? '8080'),
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    XENDIT_API_KEY: process.env.XENDIT_API_KEY ?? '',
};
