import { InitLogger, LogImpls, LogLevel, LogFormat, type Logger } from '@/utils/logger/logger';

export const loggerJSON: Logger = InitLogger({
  impl: LogImpls.CONSOLE,
  config: {
    levels: [LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.DEBUG],
    format: LogFormat.JSON,
  },
});

export const loggerRAW: Logger = InitLogger({
  impl: LogImpls.CONSOLE,
  config: {
    levels: [LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.DEBUG],
    format: LogFormat.RAW,
  },
});
