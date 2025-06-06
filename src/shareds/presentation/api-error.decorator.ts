import { ApiExtraModels, ApiResponse } from "@nestjs/swagger";
import { errorCodeStatus } from "./filters/domain-error.filter";
import { ErrorResponseDto } from "./pipes/error-res.dto";
import { applyDecorators } from "@nestjs/common";
import { ErrorCodes } from "src/domain/flows/error.type";

export function ApiErrorResponse(...codes: (ErrorCodes | "auto")[]) {
  const allCodes = Object.values(ErrorCodes);
  const usedCodes = codes.includes("auto") ? allCodes : codes;

  // Agrupa los códigos por status
  const grouped: Record<number, ErrorCodes[]> = {};
  usedCodes
    .filter((code): code is ErrorCodes => code !== "auto")
    .forEach(code => {
      const status = errorCodeStatus[code] || 500;
      if (!grouped[status]) grouped[status] = [];
      grouped[status].push(code);
    });

  const formatCode = (code: string) =>
  code
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/(^\w|\s\w)/g, l => l.toUpperCase());

  const responses = Object.entries(grouped).map(([status, codes]) =>
    ApiResponse({
      status: Number(status),
      description: codes.map(formatCode).join(', '),
      type: ErrorResponseDto,
    })
  );

  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ...responses,
  );
}