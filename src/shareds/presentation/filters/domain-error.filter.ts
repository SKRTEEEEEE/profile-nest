import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { DomainError } from "src/domain/flows/domain.error";
import { ErrorCodes } from "src/domain/flows/error.codes";


// Mapeo de ErrorCodes a HttpStatus
const errorCodeToStatus: Record<ErrorCodes, HttpStatus> = {
  [ErrorCodes.DATABASE_ACTION]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCodes.DATABASE_FIND]: HttpStatus.NOT_FOUND,
  [ErrorCodes.INPUT_PARSE]: HttpStatus.BAD_REQUEST,
  [ErrorCodes.SET_ENV]: HttpStatus.INTERNAL_SERVER_ERROR
  // Añade más según tus ErrorCodes
};

@Catch(DomainError)
export class DomainErrorFilter  implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = this.getHttpStatus(exception);
    
    // Construye la respuesta unificada según el formato BaseFlow
    response.status(status).json({
      success: false,
      type: exception.type,
      message: exception.message,
      timestamp: exception.timestamp || Date.now(),
      meta: exception.meta || undefined,
      // Mantenemos statusCode para compatibilidad con tu código actual
      statusCode: status
    });
  }

  private getHttpStatus(error: DomainError): HttpStatus {
    // Usa el código del error para buscar el estado HTTP correspondiente
    return errorCodeToStatus[error.type] || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}