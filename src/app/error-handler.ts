import type { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { AppEnv } from '@/app';
import { AppError } from '@/core/errors/app-error';
import { ResponseBuilder } from '@/core/http/response';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export function registerErrorHandler(app: Hono<AppEnv>) {
  app.onError((err, c) => {
    if (err instanceof AppError) {
      console.error('[AppError]', {
        code: err.code,
        status: err.status,
        message: err.message,
        meta: err.meta,
      });

      return ResponseBuilder.Error({
        c,
        message: err.message,
        status: err.status,
      });
    }

    if (err instanceof HTTPException) {
      return ResponseBuilder.Error({
        c,
        message: err.message,
        status: err.status as ContentfulStatusCode,
      });
    }

    console.error('[UnhandledError]', err);

    return ResponseBuilder.Error({
      c,
      message: 'Internal server error',
      status: 500 as 500,
    });
  });
}
