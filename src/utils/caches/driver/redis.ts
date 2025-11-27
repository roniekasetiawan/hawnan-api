import { Cache, CacheConfig, CacheKey } from '@/utils/caches/cache';
import Redis from 'ioredis';

export default class RedisImpl implements Cache {
  private connections: Redis[] = [];

  constructor({ config }: { config: CacheConfig }) {
    if (config.connections.length == 0) {
      throw new Error('the connections cannot be less than or equal 0');
    }

    for (let c of config.connections) {
      const redis = new Redis({
        host: c.host,
        port: c.port,
        password: c.password,
        username: c.username,
      });
      this.connections.push(redis);
    }
  }

  async del({ keys }: { keys: CacheKey[] }): Promise<{ err?: Error }> {
    try {
      for (let c of this.connections) {
        await c.del(...keys);
      }

      return {};
    } catch (err: Error | any) {
      return { err };
    }
  }

  async set({ key, value }: { key: CacheKey; value: string }): Promise<{ err?: Error }> {
    try {
      for (let c of this.connections) {
        await c.set(key, value);
      }

      return {};
    } catch (err: Error | any) {
      return { err };
    }
  }

  async get({ key }: { key: CacheKey }): Promise<{ data?: string; err?: Error }> {
    try {
      for (let c of this.connections) {
        const value = await c.get(key);
        if (value) {
          return { data: value };
        }
      }
      return {};
    } catch (err: Error | any) {
      return { err };
    }
  }
}
