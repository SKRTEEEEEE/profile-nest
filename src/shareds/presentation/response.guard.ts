// response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {  ResCodes, ResFlow } from 'src/domain/flows/res.codes';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResFlow<T>> {
  constructor(private readonly type: ResCodes, private readonly message?: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ResFlow<T>> {
    return next.handle().pipe(
      map(data => {
        // Obtiene el nombre del constructor del tipo dinámico (por ejemplo, 'PreTechBase', 'UserBase', etc.)
        const entityKey = data?.constructor?.name;
        return {
          success: true,
          type: this.type,
          message: this.message,
          data,
          timestamp: Date.now(),
          // module: this.module 
        };
      })
    );
  }
}