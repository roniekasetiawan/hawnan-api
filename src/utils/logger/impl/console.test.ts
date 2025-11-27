import { LogFormat, type Config } from "../logger"
import { ConsoleLogger } from "./console"

describe("console logger", async () => {
  let log: ConsoleLogger;

  beforeEach(() => {
    log = new ConsoleLogger({
      format: LogFormat.JSON,
      levels: [],
    } as Config);
  })

  test("info: should print log with info level", async () => {
    log.info({ message: "Hello World", err: new Error() })
  })

  test("warn: should print log with warn level", async () => {
    log.warn({ message: "Hello World", err: new Error() })
  })

  test("debug: should print log with debug level", async () => {
    log.debug({ message: "Hello World", err: new Error() })
  })

  test("error: should print log with error level", async () => {
    log.error({ message: "Hello World", err: new Error() })
  })

})
