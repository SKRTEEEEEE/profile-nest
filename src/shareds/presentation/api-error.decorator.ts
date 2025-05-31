import { ApiExtraModels, ApiOkResponse, ApiResponse } from "@nestjs/swagger";
import { errorCodeStatus } from "./filters/domain-error.filter";
import { ErrorResponseDto } from "./pipes/error-res.dto";
import { applyDecorators } from "@nestjs/common";
import { ErrorCodes } from "src/domain/flows/error.codes";


//Esto hay que terminar-lo ⚠️ - better ApiOkResponse
export function ApiErrorResponse(...codes: (ErrorCodes | "auto")[]) {
    const allCodes = Object.values(ErrorCodes);
  const usedCodes = codes.includes("auto") ? allCodes : codes;
  const responses = usedCodes.map(code =>
    ApiResponse({
      status: errorCodeStatus[code] || 500,
      description: code,
      type: ErrorResponseDto,
    }),
  );
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ...responses,
  );
}