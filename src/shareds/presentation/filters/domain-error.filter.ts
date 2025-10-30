import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NativeLoggerService } from '../native-logger.service';
import { DomainError } from 'src/domain/flows/domain.error';
import {
  ERROR_CODES_METADATA,
  ErrorCodes,
  ErrorCodesMetadata,
} from 'src/domain/flows/error.type';
import { CORRELATION_ID_HEADER } from '../correlation-id.middleware';

// Mapeo de ErrorCodes a HttpStatus
export const errorCodeStatus: Record<ErrorCodes, HttpStatus> = {
  [ErrorCodes.DATABASE_ACTION]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCodes.DATABASE_FIND]: HttpStatus.NOT_FOUND,
  [ErrorCodes.INPUT_PARSE]: HttpStatus.BAD_REQUEST,
  [ErrorCodes.SET_ENV]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCodes.UNAUTHORIZED_ACTION]: HttpStatus.UNAUTHORIZED,
  [ErrorCodes.THROTTLE]: HttpStatus.TOO_MANY_REQUESTS,
  // Añade más según tus ErrorCodes
  [ErrorCodes.NOT_IMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
  [ErrorCodes.SHARED_ACTION]: HttpStatus.BAD_GATEWAY,
};
function friendlyErrorType(type: ErrorCodes): string {
  return type
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  constructor(@Inject(NativeLoggerService) private readonly logger: NativeLoggerService) {}
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getHttpStatus(exception);
    const emojiStatus = ERROR_CODES_METADATA[exception.type].emoji ?? '!';
    const safeEmoji =
      process.platform === 'win32'
        ? emojiStatus.replace(/[\u{1F300}-\u{1FAFF}]/gu, '!')
        : emojiStatus;

    const errorCodeMeta: ErrorCodesMetadata =
      ERROR_CODES_METADATA[exception.type];
    const friendlyDesc = exception?.friendlyDesc
      ? exception.friendlyDesc.en
      : errorCodeMeta.friendlyDesc;

    // Log error with proper context and stack trace
    const errorMessage = `${errorCodeMeta.desc}: ${friendlyDesc}`;
    const errorDetails = {
      correlationId: request[CORRELATION_ID_HEADER],
      errorType: exception.type,
      family: errorCodeMeta.family,
      code: errorCodeMeta.code,
      meta: exception.meta,
    };
    
    this.logger.error(
      { message: errorMessage, ...errorDetails },
      exception.stack,
      'DomainErrorFilter'
    );
    
    response.status(status).json({
      success: false,
      type: exception.type,
      // message: `${emojiStatus} ${friendlyErrorType(exception.type as ErrorCodes)}: ${exception.meta?.desc ?exception.meta.desc :errorCodeMeta.desc}. ${exception?.friendlyDesc ? exception.friendlyDesc.en : errorCodeMeta.friendlyDesc}`,
      message: `${emojiStatus} ${exception.meta?.desc ? exception.meta.desc.en : errorCodeMeta.desc}. ${exception?.friendlyDesc ? exception.friendlyDesc.en : errorCodeMeta.friendlyDesc}`,
      timestamp: exception.timestamp || Date.now(),
      meta: exception.friendlyDesc
        ? { ...exception.meta, friendlyDesc: exception.friendlyDesc }
        : exception.meta,
      statusCode: status,
    });
  }

  private getHttpStatus(error: DomainError): HttpStatus {
    return errorCodeStatus[error.type] || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
