import { LokiClient } from '@/utils/loki/loki';
import { getCaller, type Caller } from '../caller';
import {
  DebugParams,
  ErrorParams,
  InfoParams,
  LogLevel,
  WarnParams,
  type Config,
  type Logger,
} from '../logger';

export class ConsoleLogger implements Logger {
  private config: Config;
  private loki?: LokiClient;

  constructor({ config, loki }: { config: Config; loki?: LokiClient }) {
    this.config = config;
    this.loki = loki;
  }

  private fmt({
    tag = 'default',
    level,
    message,
    caller,
  }: {
    tag: string | undefined;
    level: LogLevel;
    message: string | undefined;
    caller: Caller;
  }): string {
    return JSON.stringify({
      tag,
      level,
      caller_line: `${caller.filePath}:${caller.line}`,
      message,
    });
  }

  async info({ tag, message, err = new Error(), storage = { loki: true } }: InfoParams) {
    if (this.config.levels.length > 0 && !this.config.levels.includes(String(LogLevel.INFO))) {
      return;
    }

    const msg = this.fmt({ tag, level: LogLevel.INFO, message, caller: await getCaller(err) });
    console.log(msg);
    if (storage?.loki) {
      this.loki?.send(msg, { level: LogLevel.INFO });
    }
  }

  async error({ tag, message, err = new Error(), storage = { loki: true } }: ErrorParams) {
    if (this.config.levels.length > 0 && !this.config.levels.includes(String(LogLevel.ERROR))) {
      return;
    }
    const msg = this.fmt({ tag, level: LogLevel.ERROR, message, caller: await getCaller(err) });
    console.log(msg);
    if (storage?.loki) {
      this.loki?.send(msg, { level: LogLevel.ERROR });
    }
  }
  async debug({ tag, message, err = new Error(), storage = { loki: true } }: DebugParams) {
    if (this.config.levels.length > 0 && !this.config.levels.includes(String(LogLevel.DEBUG))) {
      return;
    }
    const msg = this.fmt({ tag, level: LogLevel.DEBUG, message, caller: await getCaller(err) });
    console.log(msg);
    if (storage?.loki) {
      this.loki?.send(msg, { level: LogLevel.DEBUG });
    }
  }
  async warn({ tag, message, err = new Error(), storage = { loki: true } }: WarnParams) {
    if (this.config.levels.length > 0 && !this.config.levels.includes(String(LogLevel.WARN))) {
      return;
    }
    const msg = this.fmt({ tag, level: LogLevel.WARN, message, caller: await getCaller(err) });
    console.log(msg);
    if (storage?.loki) {
      this.loki?.send(msg, { level: LogLevel.WARN });
    }
  }
}
