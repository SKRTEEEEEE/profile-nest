import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { DomainError } from "src/domain/flows/domain.error";
import { ERROR_CODES_METADATA, ErrorCodes, ErrorCodesMetadata } from "src/domain/flows/error.type";


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
  [ErrorCodes.SHARED_ACTION]: HttpStatus.BAD_GATEWAY

};

@Catch(DomainError)
export class DomainErrorFilter  implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = this.getHttpStatus(exception);
    // const emojiStatus = errorCodeEmoji[exception.type]
    const emojiStatus = ERROR_CODES_METADATA[exception.type].emoji

    const functionSuffix = exception.opt?.function ? `.${exception.opt.function}` : '';
    console.error(
      `[${emojiStatus} ${exception.type} -> ${exception.location}${functionSuffix}] ${exception.message}
      `
    )
    const errorCodeMeta: ErrorCodesMetadata  =  ERROR_CODES_METADATA[exception.type]
    console.log("errorCodeMeta: ", errorCodeMeta)
    // Construye la respuesta unificada según el formato BaseFlow
    response.status(status).json({
      success: false,
      type: exception.type,
      message: `${emojiStatus} ${exception.opt?.shortDesc ? exception.opt.shortDesc : errorCodeMeta.desc}.`,
      timestamp: exception.timestamp || Date.now(),
      meta: exception.meta ? {...exception.meta, friendlyDesc: errorCodeMeta.friendlyDesc} : errorCodeMeta.friendlyDesc ? {friendlyTip: errorCodeMeta.friendlyDesc} : undefined,
      // Mantenemos statusCode para compatibilidad con tu código actual
      statusCode: status
    });
  }

  private getHttpStatus(error: DomainError): HttpStatus {
    // Usa el código del error para buscar el estado HTTP correspondiente
    return errorCodeStatus[error.type] || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}