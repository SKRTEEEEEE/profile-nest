import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { errorCodeStatus } from './filters/domain-error.filter';
import { ErrorResponseDto } from './pipes/error-res.dto';
import { applyDecorators } from '@nestjs/common';
import { ErrorCodes, ERROR_CODES_METADATA } from '@skrteeeeee/profile-domain/dist/flows/error.type';

// Función para detectar si un método recibe parámetros
function hasInputParameters(target: any, propertyKey: string): boolean {
  const method = target[propertyKey];
  if (!method) return false;

  // Obtener la función y analizar sus parámetros
  const methodString = method.toString();

  // Extraer la lista de parámetros de la función
  const parameterMatch = methodString.match(/\(([^)]*)\)/);
  if (!parameterMatch) return false;

  const parameters = parameterMatch[1].trim();

  // Si no hay parámetros o solo tiene 'this' (en métodos de clase), no tiene inputs
  if (!parameters || parameters === '') return false;

  // Si tiene parámetros, tiene inputs
  return true;
}

export function ApiErrorResponse(
  ...codes: (ErrorCodes | 'full' | 'get' | '--protected' | 'd')[]
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // CORRECCIÓN: Solo incluir códigos de familia "Endpoint"
    const endpointCodes = Object.values(ErrorCodes).filter(
      (code) => ERROR_CODES_METADATA[code].family === 'Endpoint',
    );

    let usedCodes = codes.includes('full') ? endpointCodes : codes;

    //  NUEVA FUNCIONALIDAD: Si no se usa "full" y recibe parámetros, agregar INPUT_PARSE
    if (!codes.includes('full')) {
      if (hasInputParameters(target, propertyKey)) {
        usedCodes = [...usedCodes, ErrorCodes.INPUT_PARSE];
      }
      // get -> database_find
      // get--protected -> database_find + unauthorized_action
      // (default) -> database_action + unauthorized_action
      if (codes.includes('get'))
        usedCodes = [...usedCodes, ErrorCodes.DATABASE_FIND];
      if (codes.includes('--protected'))
        usedCodes = [...usedCodes, ErrorCodes.UNAUTHORIZED_ACTION];
      if (codes.includes('d')) {
        if (codes.length === 1) {
          usedCodes = [
            ...usedCodes,
            ErrorCodes.UNAUTHORIZED_ACTION,
            ErrorCodes.DATABASE_ACTION,
          ];
        } else {
          console.warn(
            "[WRONG USE]: Don't use 'd' option (default) with other flags/params in @ApiErrorResponse",
          );
        }
      }
      usedCodes = [...usedCodes, ErrorCodes.THROTTLE];
    }

    const formatCode = (code: string) =>
      code
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/(^\w|\s\w)/g, (l) => l.toUpperCase());
    // Crear respuestas individuales para cada código
    const responses = usedCodes
      .filter(
        (code): code is ErrorCodes =>
          code !== 'full' &&
          code !== 'get' &&
          code !== '--protected' &&
          code !== 'd',
      )
      .map((code) => {
        const status = errorCodeStatus[code] || 500;
        const metadata = ERROR_CODES_METADATA[code];

        return ApiResponse({
          status: Number(status),
          description: `${metadata.emoji} ${formatCode(code)}`,
          type: ErrorResponseDto,
          example: {
            success: false,
            type: code,
            message: `${metadata.emoji} ${metadata.desc}.`,
            timestamp: Date.now(),
            meta: {
              friendlyDesc: `${metadata.friendlyDesc || ''}`,
            },
            statusCode: status,
          },
        });
      });

    return applyDecorators(ApiExtraModels(ErrorResponseDto), ...responses)(
      target,
      propertyKey,
      descriptor,
    );
  };
}
