// response.decorators.ts

import { applyDecorators, SetMetadata } from "@nestjs/common";
import { ResCodes } from "src/domain/flows/res.codes";

export const API_RESPONSE_META = 'API_RESPONSE_META';

export function ApiResponse(type: ResCodes, message?: string) {
  return applyDecorators(
    SetMetadata(API_RESPONSE_META, { type, message })
  );
}