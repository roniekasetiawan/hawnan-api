import { ConsoleLogger } from '@/utils/logger/impl/console';

export interface InfoParams {
  tag?: string;
  message?: string;
  err?: Error;
  storage?: { loki: boolean };
}
export interface ErrorParams {
  tag?: string;
  message?: string;
  err?: Error;
  storage?: { loki: boolean };
}
export interface DebugParams {
  tag?: string;
  message?: string;
  err?: Error;
  storage?: { loki: boolean };
}
export interface WarnParams {
  tag?: string;
  message?: string;
  err?: Error;
  storage?: { loki: boolean };
}

export interface Logger {
  info: ({ tag, message, err, storage }: InfoParams) => void;
  error: ({ tag, message, err, storage }: ErrorParams) => void;
  debug: ({ tag, message, err, storage }: DebugParams) => void;
  warn: ({ tag, message, err, storage }: WarnParams) => void;
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
      return new ConsoleLogger({ config });
    default:
      throw new Error(`logger implementation of ${impl} not implementated yet!`);
  }
}
