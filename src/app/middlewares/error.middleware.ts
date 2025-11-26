import type { ErrorHandler } from 'hono';
import { ResponseBuilder } from '@/core/http/response';

export const globalErrorHandler: ErrorHandler = (err, c) => {
  console.error('Unhandled error:', err);

  return ResponseBuilder.Error({
    c,
    message: 'Internal server error',
    data: {
      requestId: c.get('requestId'),
    },
    status: 500,
  });
};
