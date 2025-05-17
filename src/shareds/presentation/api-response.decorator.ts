// response.decorators.ts

import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { ResCodes } from "src/domain/flows/res.codes";
import { ResponseInterceptor } from "./response.guard";

export function ApiResponse(type: ResCodes, message?: string) {
  // Crea una instancia personalizada y asigna los valores
  const interceptor = new ResponseInterceptor();
  interceptor.type = type;
  interceptor.message = message;
  return applyDecorators(
    UseInterceptors(interceptor)
  );
}