import { InitLogger, LogImpls, LogLevel, LogFormat, type Logger, Config } from '@/utils/logger/logger';
import { lokiConfig } from './loki';

export const loggerJSON: Logger = InitLogger({
  impl: LogImpls.CONSOLE,
  config: {
    levels: [LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.DEBUG],
    format: LogFormat.JSON,
    storage: {
      loki: lokiConfig,
    },
  } as Config,
});

export const loggerRAW: Logger = InitLogger({
  impl: LogImpls.CONSOLE,
  config: {
    levels: [LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.DEBUG],
    format: LogFormat.RAW,
    storage: {
      loki: lokiConfig,
    },
  } as Config,
});
