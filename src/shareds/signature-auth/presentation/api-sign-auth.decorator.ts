import { applyDecorators } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";

export function ApiSignAuthHeader() {
  if (process.env.JWT_STRATEGY === 'mock') {
    return applyDecorators(); // No aplica nada en mock
  }
  return applyDecorators(
    ApiHeader({
      name: 'x-signed-payload',
      description: 'Payload firmado por el usuario (JSON stringified)',
      required: true,
      schema: { type: 'string' }
    })
  );
}