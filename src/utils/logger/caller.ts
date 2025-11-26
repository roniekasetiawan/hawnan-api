export interface Caller {
  filePath: string;
  line: number;
}

export const getCaller = async (error: Error | undefined | null): Promise<Caller> => {
  const empty = { filePath: "", line: -1 } as Caller
  if (!error) {
    return empty
  }

  // get property string
  const stack = error.stack
  if (!stack) {
    return empty
  }

  // split the lines
  const lines = stack.split('\n')

  // catch the line function outside getCaller()
  const fn = lines[2]

  // extract file path and line number
  const match = fn.match(/\(([^:]+):(\d+):\d+\)/);
  if (!match) {
    return empty
  }

  if (match.length < 2) {
    return empty
  }

  let filePath = match[1] ?? ""
  const srcMarker = '/src/';
  const srcIndex = filePath.indexOf(srcMarker);
  if (srcIndex !== -1) {
    filePath = filePath.substring(srcIndex + srcMarker.length);
  }
  
  const line = match[2] ? (parseInt(match[2], 10) + 1) : -1
  return { filePath, line } as Caller
}