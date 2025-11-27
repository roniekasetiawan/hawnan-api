import { describe, test, expect, beforeEach, mock } from "bun:test"
import RedisImpl from "@/utils/caches/driver/redis"
import { CacheDrivers } from "@/utils/caches/cache"

// Mock ioredis using bun:test
const mockDel = mock(async () => 1)
const mockSet = mock(async () => "OK")
const mockGet = mock(async (key: string): Promise<null | string> => null)

const mockRedisInstance = {
  del: mockDel,
  set: mockSet,
  get: mockGet,
}

const mockRedisConstructor = mock(() => mockRedisInstance)

mock.module("ioredis", () => ({
  __esModule: true,
  default: mockRedisConstructor,
}))

describe("RedisImpl", () => {
  let redisImpl: RedisImpl
  const connection1 = { host: "127.0.0.1", port: 6969 }
  const connection2 = { host: "127.0.0.1", port: 6970 }

  beforeEach(() => {
    mockRedisConstructor.mockClear()
    mockDel.mockClear()
    mockSet.mockClear()
    mockGet.mockClear()

    redisImpl = new RedisImpl({
      config: {
        driver: CacheDrivers.REDIS,
        connections: [connection1, connection2],
      },
    })
  })

  describe("constructor", () => {
    test("should throw an error if no connections are provided", () => {
      expect(() => {
        new RedisImpl({
          config: {
            driver: CacheDrivers.REDIS,
            connections: [],
          },
        })
      }).toThrow("the connections cannot be less than or equal 0")
    })

    test("should create a new Redis instance for each connection", () => {
      expect(mockRedisConstructor).toHaveBeenCalledTimes(2)
      expect(mockRedisConstructor).toHaveBeenCalledWith({
        host: connection1.host,
        port: connection1.port,
        password: undefined,
        username: undefined,
      })
      expect(mockRedisConstructor).toHaveBeenCalledWith({
        host: connection2.host,
        port: connection2.port,
        password: undefined,
        username: undefined,
      })
    })
  })

  describe("set", () => {
    test("should call set on all connections and return no error on success", async () => {
      mockSet.mockResolvedValue("OK")
      const result = await redisImpl.set({ key: "test_key", value: "test_value" })

      expect(result).toEqual({})
      expect(mockSet).toHaveBeenCalledTimes(2)
      expect(mockSet).toHaveBeenCalledWith("test_key", "test_value")
    })

    test("should return an error if any connection fails to set", async () => {
      const testError = new Error("Set failed")
      mockSet.mockRejectedValueOnce(testError)

      const result = await redisImpl.set({ key: "test_key", value: "test_value" })

      expect(result.err).toBe(testError)
      expect(mockSet).toHaveBeenCalledTimes(1)
    })
  })

  describe("get", () => {
    test("should return data if key is found in the first connection", async () => {
      mockGet.mockResolvedValueOnce("test_value")

      const result = await redisImpl.get({ key: "test_key" })

      expect(result.data).toBe("test_value")
      expect(result.err).toBeUndefined()
      expect(mockGet).toHaveBeenCalledTimes(1)
      expect(mockGet).toHaveBeenCalledWith("test_key")
    })

    test("should check the next connection if key is not found in the first", async () => {
      mockGet.mockResolvedValueOnce(null) // Not found in first
      mockGet.mockResolvedValueOnce("test_value") // Found in second

      const result = await redisImpl.get({ key: "test_key" })

      expect(result.data).toBe("test_value")
      expect(result.err).toBeUndefined()
      expect(mockGet).toHaveBeenCalledTimes(2)
    })

    test("should return empty object if key is not found in any connection", async () => {
      mockGet.mockResolvedValue(null)

      const result = await redisImpl.get({ key: "test_key" })

      expect(result).toEqual({})
      expect(mockGet).toHaveBeenCalledTimes(2)
    })

    test("should return an error if any connection fails to get", async () => {
      const testError = new Error("Get failed")
      mockGet.mockRejectedValueOnce(testError)

      const result = await redisImpl.get({ key: "test_key" })

      expect(result.err).toBe(testError)
      expect(mockGet).toHaveBeenCalledTimes(1)
    })
  })

  describe("del", () => {
    test("should call del on all connections and return no error on success", async () => {
      mockDel.mockResolvedValue(1)
      const keys = ["key1", "key2"]
      const result = await redisImpl.del({ keys })

      expect(result).toEqual({})
      expect(mockDel).toHaveBeenCalledTimes(2)
      expect(mockDel).toHaveBeenCalledWith(...keys)
    })

    test("should return an error if any connection fails to del", async () => {
      const testError = new Error("Del failed")
      mockDel.mockRejectedValueOnce(testError)
      const keys = ["key1", "key2"]

      const result = await redisImpl.del({ keys })

      expect(result.err).toBe(testError)
      expect(mockDel).toHaveBeenCalledTimes(1)
    })
  })
})
