export type CacheKey = string
export enum CacheDrivers {
  REDIS
  // others...
}

export interface Connection {
  username?: string
  password?: string
  host: string
  port: number
}

export interface CacheConfig {
  driver: CacheDrivers
  connections: Connection[]
}


export interface Cache {
  set({ key, value }: { key: CacheKey, value: string }): { err?: Error } | Promise<{ err?: Error }>
  get({ key }: { key: CacheKey }): { err?: Error } | Promise<{ data?: string, err?: Error }>
  del({ keys }: { keys: CacheKey[] }): { err?: Error } | Promise<{ err?: Error }>
}

export function InitCache({ config }: { config: CacheConfig }): { data?: Cache, error?: Error } {
  switch (config.driver) {
    case CacheDrivers.REDIS:
      return { data: undefined }
    default:
      return { error: new Error(`cache driver ${config.driver} not implemented!`) }
  }
}
