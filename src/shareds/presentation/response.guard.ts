// response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResCodes, ResFlow } from 'src/domain/flows/res.codes';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResFlow<T>> {
  public type?: ResCodes;
  public message?: string;

  intercept(context: ExecutionContext, next: CallHandler): Observable<ResFlow<T>> {
    return next.handle().pipe(
      map(data => {
        return {
          success: true,
          type: this.type ?? ResCodes.OPERATION_SUCCESS,
          message: this.message,
          data,
          timestamp: Date.now(),
        };
      })
    );
  }
}