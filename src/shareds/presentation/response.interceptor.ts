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
import { ResCodes, ResFlow } from 'src/domain/flows/res.type';
import { Reflector } from '@nestjs/core';
import { API_RESPONSE_META } from './api-success.decorator';
import { PinoLogger } from 'nestjs-pino';

/**
 * Encargado de modificar la respuesta al formato
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResFlow<T>> {
  constructor(
    private readonly reflector: Reflector,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ResponseInterceptor.name);
  }

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
        this.logger.debug({ responseType: meta?.type }, 'Response type logged');
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
