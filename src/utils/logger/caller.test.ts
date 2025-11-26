import { getCaller } from './caller';

describe('caller', async () => {
  test('error exist', async () => {
    const caller = await getCaller(new Error('this is error'));
    expect(caller.line).toBe(5);
    expect(caller.filePath).toBe('utils/logger/caller.test.ts');
  });

  test('error not exist', async () => {
    const caller = await getCaller(undefined);
    expect(caller.line).toBe(-1);
    expect(caller.filePath).toBe('');
  });
});
