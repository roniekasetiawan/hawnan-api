import { ConsoleLogger } from '@/utils/logger/impl/console';

export interface Logger {
  info: ({ tag, message, err }: { tag?: string; message?: string; err?: Error }) => void;
  error: ({ tag, message, err }: { tag?: string; message?: string; err?: Error }) => void;
  debug: ({ tag, message, err }: { tag?: string; message?: string; err?: Error }) => void;
  warn: ({ tag, message, err }: { tag?: string; message?: string; err?: Error }) => void;
}

export interface Config {
  levels: string[];
  format: LogFormat;
}

export enum LogFormat {
  JSON,
  RAW,
}

export enum LogLevel {
  INFO = 'info',
  ERROR = 'error',
  DEBUG = 'debug',
  WARN = 'warn',
}

export enum LogImpls {
  CONSOLE = 'console',
}

export function InitLogger({ impl, config }: { impl: LogImpls; config: Config }): Logger {
  switch (impl) {
    case LogImpls.CONSOLE:
      return new ConsoleLogger(config);
    default:
      throw new Error(`logger implementation of ${impl} not implementated yet!`);
  }
}
