// response.interceptor.ts
// ESTO ES UN INTERCEPTOR !! ⚠️
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResCodes, ResFlow } from 'src/domain/flows/res.codes';
import { Reflector } from '@nestjs/core';
import { API_RESPONSE_META } from './api-response.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResFlow<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ResFlow<T>> {
    const meta = this.reflector.get<{ type?: ResCodes; message?: string }>(
      API_RESPONSE_META,
      context.getHandler(),
    );
    return next.handle().pipe(
      map(data => ({
        success: true,
        type: meta?.type ?? ResCodes.OPERATION_SUCCESS,
        message: meta?.message,
        data,
        timestamp: Date.now(),
      })),
    );
  }
}