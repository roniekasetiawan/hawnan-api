import { getCaller, type Caller } from '../caller';
import { DebugParams, ErrorParams, InfoParams, LogLevel, WarnParams, type Config, type Logger } from '../logger';
import type { ILokiClient } from '@/utils/loki/loki';

export class LokiLogger implements Logger {
  private config: Config;
  private lokiClient: ILokiClient;

  constructor(config: Config, lokiClient: ILokiClient) {
    this.config = config;
    this.lokiClient = lokiClient;
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

  private async log(level: LogLevel, params: InfoParams | ErrorParams | DebugParams | WarnParams) {
    const { tag, message, err = new Error(), storage } = params;

    // Only send to Loki if explicitly requested in the log call
    if (!storage?.loki) {
      return;
    }
    
    if (this.config.levels.length > 0 && !this.config.levels.includes(String(level))) {
      return;
    }

    const caller = await getCaller(err);
    const formattedMessage = this.fmt({ tag, level, message, caller });
    
    await this.lokiClient.send(formattedMessage, { level: level.toString() });
  }

  async info(params: InfoParams) {
    await this.log(LogLevel.INFO, params);
  }

  async error(params: ErrorParams) {
    await this.log(LogLevel.ERROR, params);
  }

  async debug(params: DebugParams) {
    await this.log(LogLevel.DEBUG, params);
  }

  async warn(params: WarnParams) {
    await this.log(LogLevel.WARN, params);
  }
}
