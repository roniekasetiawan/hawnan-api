import { getCaller, type Caller } from "../caller.ts";
import { LogLevel, type Config, type Logger } from "../logger.ts";

export class ConsoleLogger implements Logger {
  private config: Config;

  constructor(config: Config) {
    this.config = config
  }

  private fmt({ tag = "default", level, message, caller }: { tag: string | undefined, level: LogLevel, message: string | undefined, caller: Caller, }): string {
    return JSON.stringify({
      tag,
      level,
      caller_line: `${caller.filePath}:${caller.line}`,
      message,
    })
  }

  async info({ tag, message, error = new Error() }: { tag?: string; message?: string; error?: Error }) {
    if (this.config.levels.length > 0 && !this.config.levels.includes(String(LogLevel.INFO))) {
      return
    }
    console.log(this.fmt({ tag, level: LogLevel.INFO, message, caller: await getCaller(error) }))
  };

  async error({ tag, message, error = new Error() }: { tag?: string; message?: string; error?: Error }) {
    if (this.config.levels.length > 0 && !this.config.levels.includes(String(LogLevel.ERROR))) {
      return
    }
    console.log(this.fmt({ tag, level: LogLevel.ERROR, message, caller: await getCaller(error) }))
  };
  async debug({ tag, message, error = new Error() }: { tag?: string; message?: string; error?: Error }) {
    if (this.config.levels.length > 0 && !this.config.levels.includes(String(LogLevel.DEBUG))) {
      return
    }
    console.log(this.fmt({ tag, level: LogLevel.DEBUG, message, caller: await getCaller(error) }))
  };
  async warn({ tag, message, error = new Error() }: { tag?: string; message?: string; error?: Error }) {
    if (this.config.levels.length > 0 && !this.config.levels.includes(String(LogLevel.WARN))) {
      return
    }
    console.log(this.fmt({ tag, level: LogLevel.WARN, message, caller: await getCaller(error) }))
  };
}