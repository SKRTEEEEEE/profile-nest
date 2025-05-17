// response.decorators.ts

import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { ResCodes } from "src/domain/flows/res.codes";
import { ResponseInterceptor } from "./response.guard";

export function ApiResponse(type: ResCodes, message?: string) {
  return applyDecorators(
    UseInterceptors(new ResponseInterceptor(type, message))
  );
}