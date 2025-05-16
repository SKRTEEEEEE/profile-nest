import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { DomainError } from "src/domain/errors/domain.error";
import { ErrorCodes } from "src/domain/errors/error.codes";

const errorCodeToStatus: Record<ErrorCodes, HttpStatus> = {
    [ErrorCodes.DATABASE_ACTION]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorCodes.DATABASE_FIND]: HttpStatus.NOT_FOUND,
    [ErrorCodes.INPUT_PARSE]: HttpStatus.BAD_REQUEST,
    [ErrorCodes.SET_ENV]: HttpStatus.INTERNAL_SERVER_ERROR
};

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.getHttpStatus(exception);
    
    response.status(status).json({
      statusCode: status,
      errorCode: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }

  private getHttpStatus(error: DomainError): HttpStatus {
    // Usa el código del error para buscar el estado HTTP correspondiente
    return errorCodeToStatus[error.code] || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}