import type { MiddlewareHandler } from 'hono';
import { nanoid } from 'nanoid';
import { loggerRAW } from '@/config/logger';
import { HeaderKeys } from '@/utils/headers/keys';
import { HeaderValues } from '@/utils/headers/values';
import { CtxKeys } from '@/utils/ctx/keys';

const TAG = 'logger-middleware';

const getBody = async (r: Request | Response) => {
  if (!r.body) {
    return undefined;
  }

  const contentType = r.headers.get(HeaderKeys.CONTENT_TYPE);
  try {
    const clone = r.clone();
    if (contentType?.includes(HeaderValues.JSON)) {
      return await clone.json();
    }
    if (contentType?.includes(HeaderValues.TEXT)) {
      return await clone.text();
    }

    return `Body not parsed for content-type: ${contentType}`;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return `Error parsing body: ${message}`;
  }
};

export const requestLogger = (): MiddlewareHandler => {
  return async (c, next) => {
    const id = nanoid(10);
    c.set(CtxKeys.REQUEST_ID, id);
    const start = Date.now();

    const reqLog = {
      type: '<== REQUEST',
      id: id,
      method: c.req.method,
      path: c.req.path,
      query: c.req.query(),
      headers: c.req.header(),
      body: await getBody(c.req.raw),
    };
    loggerRAW.info({ tag: TAG, message: JSON.stringify(reqLog) });

    await next();

    const ms = Date.now() - start;
    const resHeaders: Record<string, string> = {};
    c.res.headers.forEach((value, key) => {
      resHeaders[key] = value;
    });

    const resLog = {
      type: 'RESPONSE ==>',
      id: id,
      status: c.res.status,
      responseTimeMs: ms,
      headers: resHeaders,
      body: await getBody(c.res),
    };
    loggerRAW.info({ tag: TAG, message: JSON.stringify(resLog) });
  };
};
