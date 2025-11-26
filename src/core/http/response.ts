import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { AppContext } from '@/app';

export type ApiResponse<T> = {
  responseCode: string;
  responseMessage: string;
  responseData: T | null;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type BinaryBody = string | ArrayBuffer | ReadableStream;

export class ResponseBuilder {
  private static makeResponseCode(status: ContentfulStatusCode): string {
    return `0${status}`;
  }

  static Success<T>(params: {
    c: AppContext;
    data: T;
    message?: string;
    status?: ContentfulStatusCode;
  }) {
    const { c, data, message = 'Success', status = 200 } = params;

    const body: ApiResponse<T> = {
      responseCode: this.makeResponseCode(status),
      responseMessage: message,
      responseData: data,
    };

    return c.json(body, status);
  }

  static Error<T = null>(params: {
    c: AppContext;
    message: string;
    status: ContentfulStatusCode;
    data?: T | null;
  }) {
    const { c, message, status, data = null } = params;

    const body: ApiResponse<T | null> = {
      responseCode: this.makeResponseCode(status),
      responseMessage: message,
      responseData: data,
    };

    return c.json(body, status);
  }

  static Paginate<T>(params: {
    c: AppContext;
    items: T[];
    pagination: PaginationMeta;
    message?: string;
    status?: ContentfulStatusCode;
  }) {
    const { c, items, pagination, message = 'Success', status = 200 } = params;

    const body: ApiResponse<{ items: T[]; pagination: PaginationMeta }> = {
      responseCode: this.makeResponseCode(status),
      responseMessage: message,
      responseData: { items, pagination },
    };

    return c.json(body, status);
  }

  static File(params: {
    c: AppContext;
    body: BinaryBody;
    filename: string;
    contentType?: string;
    status?: ContentfulStatusCode;
  }) {
    const { c, body, filename, contentType = 'application/octet-stream', status = 200 } = params;

    return c.newResponse(body, {
      status,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  }

  static Download(params: {
    c: AppContext;
    body: BinaryBody;
    filename: string;
    contentType?: string;
    status?: ContentfulStatusCode;
  }) {
    const { c, body, filename, contentType = 'application/octet-stream', status = 200 } = params;

    return c.newResponse(body, {
      status,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }

  static Stream(params: {
    c: AppContext;
    stream: BinaryBody;
    contentType?: string;
    status?: ContentfulStatusCode;
    headers?: Record<string, string>;
  }) {
    const {
      c,
      stream,
      contentType = 'application/octet-stream',
      status = 200,
      headers = {},
    } = params;

    return c.newResponse(stream, {
      status,
      headers: {
        'Content-Type': contentType,
        ...headers,
      },
    });
  }
}
