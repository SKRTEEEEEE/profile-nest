import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { NativeLoggerService } from './native-logger.service';

export const CORRELATION_ID_HEADER = 'X-Correlation-Id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(
    @Inject(NativeLoggerService)
    private readonly logger: NativeLoggerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const id = randomUUID();
    req[CORRELATION_ID_HEADER] = id;
    res.set(CORRELATION_ID_HEADER, id);
    
    // Set correlation ID in logger for this request
    this.logger.setCorrelationId(id);
    
    next();
  }
}
