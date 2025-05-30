import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { DomainError } from "src/domain/flows/domain.error";
import { errorCodeEmoji, ErrorCodes } from "src/domain/flows/error.codes";


// Mapeo de ErrorCodes a HttpStatus
export const errorCodeStatus: Record<ErrorCodes, HttpStatus> = {
  [ErrorCodes.DATABASE_ACTION]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCodes.DATABASE_FIND]: HttpStatus.NOT_FOUND,
  [ErrorCodes.INPUT_PARSE]: HttpStatus.BAD_REQUEST,
  [ErrorCodes.SET_ENV]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCodes.UNAUTHORIZED_ACTION]: HttpStatus.UNAUTHORIZED,
  // Añade más según tus ErrorCodes
  [ErrorCodes.NOT_IMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
  [ErrorCodes.SHARED_ACTION]: HttpStatus.BAD_GATEWAY
};
export const errorCodeDescs: Record<ErrorCodes, {shortDes: string,friendlyTip:string}> = {
  [ErrorCodes.DATABASE_ACTION]:{
    shortDes: "Something went wrong while saving the data",
    friendlyTip: "Please try again after"
  },         // 500 - Acción de base de datos fallida
  [ErrorCodes.DATABASE_FIND]: {
    shortDes: "Sorry, we couldn't locate that content",
    friendlyTip: ""
  },             // 404 - No encontrado
  [ErrorCodes.INPUT_PARSE]: {
    shortDes: "Your request is in an incorrect format",
    friendlyTip: "Please verify the information and try again"
  },            // 400 - Error de entrada del usuario
  [ErrorCodes.SET_ENV]: {
    shortDes: "Something went wrong while saving the data",
    friendlyTip: "Please try again after"
  },                // 500 - Error de configuración del entorno
  [ErrorCodes.UNAUTHORIZED_ACTION]: {
    shortDes: "You do not have permission to perform this action",
    friendlyTip: ""
  },    // 401 - No autorizado

  [ErrorCodes.NOT_IMPLEMENTED]: {
    shortDes: "This service is not available now",
    friendlyTip: "Contact us for more info"
  }, //501
  [ErrorCodes.SHARED_ACTION]: {
    shortDes: "Sorry, something went wrong",
    friendlyTip: "Contact us if persist"
  } //502
}

@Catch(DomainError)
export class DomainErrorFilter  implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = this.getHttpStatus(exception);
    const emojiStatus = errorCodeEmoji[exception.type]
    const functionSuffix = exception.opt?.function ? `.${exception.opt.function}` : '';
    console.error(
      `[${emojiStatus} ${exception.type} -> ${exception.location}${functionSuffix}] ${exception.message}
      `
    )
    const errorCodeDesc =  errorCodeDescs[exception.type]
    // Construye la respuesta unificada según el formato BaseFlow
    response.status(status).json({
      success: false,
      type: exception.type,
      message: `${emojiStatus} ${exception.opt?.shortDesc ? exception.opt.shortDesc : errorCodeDesc.shortDes}. ${exception.opt?.friendlyDesc ? exception.opt.friendlyDesc:errorCodeDesc.friendlyTip}`,
      timestamp: exception.timestamp || Date.now(),
      meta: exception.meta || undefined,
      // Mantenemos statusCode para compatibilidad con tu código actual
      statusCode: status
    });
  }

  private getHttpStatus(error: DomainError): HttpStatus {
    // Usa el código del error para buscar el estado HTTP correspondiente
    return errorCodeStatus[error.type] || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}