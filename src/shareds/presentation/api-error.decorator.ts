import { ApiExtraModels, ApiResponse } from "@nestjs/swagger";
import { errorCodeToStatus } from "./filters/domain-error.filter";
import { ErrorResponseDto } from "./pipes/error-res.dto";
import { applyDecorators } from "@nestjs/common";
import { ErrorCodes } from "src/domain/flows/error.codes";

export function ApiErrorResponse(...codes: (ErrorCodes | "auto")[]) {
    const allCodes = Object.values(ErrorCodes);
  const usedCodes = codes.includes("auto") ? allCodes : codes;
  const responses = usedCodes.map(code =>
    ApiResponse({
      status: errorCodeToStatus[code] || 500,
      description: code,
      type: ErrorResponseDto,
    }),
  );
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ...responses,
  );
}