import { LokiConfig } from '@/config/loki';
import { ConsoleLogger } from '@/utils/logger/impl/console';
import { LogFormat } from '@/utils/logger/logger';
import { LokiClient } from '@/utils/loki/loki';
import { vi, describe, test, expect, beforeEach } from 'bun:test';

// Mock LokiClient
const lokiClientMock: LokiClient = {
  send: vi.fn(),
  config: {
    url: 'http://localhost:3100',
    labels: {
      app: 'hawnan-api',
      environment: 'development',
    },
  } as LokiConfig,
  buildPushRequest: vi.fn(),
};

describe('console logger', async () => {
  let log: ConsoleLogger;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('without loki', () => {
    beforeEach(() => {
      log = new ConsoleLogger({
        config: {
          format: LogFormat.JSON,
          levels: [],
        },
        loki: lokiClientMock,
      });
    });

    test('info: should print log with info level', async () => {
      log.info({ message: 'Hello World', err: new Error() });
    });

    test('warn: should print log with warn level', async () => {
      log.warn({ message: 'Hello World', err: new Error() });
    });

    test('debug: should print log with debug level', async () => {
      log.debug({ message: 'Hello World', err: new Error() });
    });

    test('error: should print log with error level', async () => {
      log.error({ message: 'Hello World', err: new Error() });
    });
  });

  describe('with loki', () => {
    beforeEach(() => {
      log = new ConsoleLogger({
        config: {
          format: LogFormat.JSON,
          levels: [],
        },
        loki: lokiClientMock,
      });
    });

    test('info: should send log to loki if enabled', async () => {
      await log.info({ message: 'Hello World', err: new Error(), storage: { loki: true } });
      expect(lokiClientMock.send).toHaveBeenCalled();
    });

    test('info: should not send log to loki if disabled', async () => {
      await log.info({ message: 'Hello World', err: new Error(), storage: { loki: false } });
      expect(lokiClientMock.send).not.toHaveBeenCalled();
    });

    test('info: should send log to loki by default', async () => {
      await log.info({ message: 'Hello World', err: new Error() });
      expect(lokiClientMock.send).toHaveBeenCalled();
    });

    test('warn: should send log to loki if enabled', async () => {
      await log.warn({ message: 'Hello World', err: new Error(), storage: { loki: true } });
      expect(lokiClientMock.send).toHaveBeenCalled();
    });

    test('warn: should not send log to loki if disabled', async () => {
      await log.warn({ message: 'Hello World', err: new Error(), storage: { loki: false } });
      expect(lokiClientMock.send).not.toHaveBeenCalled();
    });

    test('warn: should send log to loki by default', async () => {
      await log.warn({ message: 'Hello World', err: new Error() });
      expect(lokiClientMock.send).toHaveBeenCalled();
    });

    test('debug: should send log to loki if enabled', async () => {
      await log.debug({ message: 'Hello World', err: new Error(), storage: { loki: true } });
      expect(lokiClientMock.send).toHaveBeenCalled();
    });

    test('debug: should not send log to loki if disabled', async () => {
      await log.debug({ message: 'Hello World', err: new Error(), storage: { loki: false } });
      expect(lokiClientMock.send).not.toHaveBeenCalled();
    });

    test('debug: should send log to loki by default', async () => {
      await log.debug({ message: 'Hello World', err: new Error() });
      expect(lokiClientMock.send).toHaveBeenCalled();
    });

    test('error: should send log to loki if enabled', async () => {
      await log.error({ message: 'Hello World', err: new Error(), storage: { loki: true } });
      expect(lokiClientMock.send).toHaveBeenCalled();
    });

    test('error: should not send log to loki if disabled', async () => {
      await log.error({ message: 'Hello World', err: new Error(), storage: { loki: false } });
      expect(lokiClientMock.send).not.toHaveBeenCalled();
    });

    test('error: should send log to loki by default', async () => {
      await log.error({ message: 'Hello World', err: new Error(), });
      expect(lokiClientMock.send).toHaveBeenCalled();
    });
  });
});