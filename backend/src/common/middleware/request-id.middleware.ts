import { randomUUID } from 'node:crypto';
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

const REQUEST_ID_HEADER = 'x-request-id';
const MAX_REQUEST_ID_LENGTH = 128;

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const incoming = request.header(REQUEST_ID_HEADER)?.trim();
    const generated = (request as Request & { id?: string }).id;
    const candidate = incoming || generated;
    const requestId =
      candidate && candidate.length <= MAX_REQUEST_ID_LENGTH
        ? candidate
        : randomUUID();

    request.headers[REQUEST_ID_HEADER] = requestId;
    response.setHeader(REQUEST_ID_HEADER, requestId);
    next();
  }
}
