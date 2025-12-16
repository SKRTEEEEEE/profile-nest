// response.interceptor.ts
// ESTO ES UN INTERCEPTOR !! ⚠️
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResCodes, ResFlow } from '@skrteeeeee/profile-domain/dist/flows/res.type';
import { Reflector } from '@nestjs/core';
import { API_RESPONSE_META } from './api-success.decorator';
import { NativeLoggerService } from './native-logger.service';

/**
 * Encargado de modificar la respuesta al formato
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResFlow<T>> {
  constructor(
    private readonly reflector: Reflector,
    private readonly logger: NativeLoggerService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResFlow<T>> {
    const meta = this.reflector.get<{ type?: ResCodes; message?: string }>(
      API_RESPONSE_META,
      context.getHandler(),
    );
    return next.handle().pipe(
      // map(data => ({
      //   success: true,
      //   type: meta?.type ?? ResCodes.OPERATION_SUCCESS,
      //   message: meta?.message,
      //   data,
      //   timestamp: Date.now(),
      // })),
      map((data: any) => {
        const message = data?.message || meta?.message;
        // Removido log redundante - el HTTP logger ya maneja esto
        const response = {
          success: true,
          type: meta?.type ?? ResCodes.OPERATION_SUCCESS,
          message,
          data: data?.data ?? data,
          timestamp: Date.now(),
        };

        // Establecer el código HTTP basado en el tipo de respuesta
        const responseObj = context.switchToHttp().getResponse();
        if (meta?.type === ResCodes.ENTITY_CREATED) {
          responseObj.status(201);
        }

        return response;
      }),
    );
  }
}
