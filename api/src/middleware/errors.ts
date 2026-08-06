import type { NextFunction, Request, Response } from 'express';

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'PLAN_UNAVAILABLE'
  | 'RATE_LIMITED'
  | 'INTERNAL';

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly status: number,
    public readonly retriable = false,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        retriable: err.retriable,
      },
    });
    return;
  }

  console.error('[api] unhandled', err instanceof Error ? err.message : err);
  res.status(500).json({
    error: {
      code: 'INTERNAL',
      message: 'Something went wrong.',
      retriable: true,
    },
  });
}
