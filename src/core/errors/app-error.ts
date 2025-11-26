import type { ContentfulStatusCode } from 'hono/utils/http-status';

export type AppErrorCode =
  | 'USER.NOT_FOUND'
  | 'USER.ALREADY_EXISTS'
  | 'AUTH.INVALID_CREDENTIALS'
  | 'INTERNAL.SERVER_ERROR';

export type AppErrorParams = {
  message: string;
  code: AppErrorCode;
  status?: ContentfulStatusCode;
  meta?: Record<string, unknown>;
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: ContentfulStatusCode;
  readonly meta?: Record<string, unknown>;

  constructor({ message, code, status = 400, meta }: AppErrorParams) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.meta = meta;
  }
}
