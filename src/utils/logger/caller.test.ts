import { getCaller } from "./caller.ts"

describe("caller", async () => {
  test("error exist", async () => {
    const caller = await getCaller(new Error("this is error"))
    expect(caller.line).toBe(5)
    expect(caller.filePath).not.toBe("")
  })

  test("error not exist", async () => {
    const caller = await getCaller(undefined)
    expect(caller.line).toBe(-1)
    expect(caller.filePath).toBe("")
  })
})