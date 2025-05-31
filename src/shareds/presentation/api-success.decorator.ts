// response.decorators.ts - ⚠️ INTEGRAR CON SWAGGER

import { applyDecorators, SetMetadata, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { ResCodes } from "src/domain/flows/res.codes";
import { SuccessResponseDto } from "./pipes/success-res.dto";

export const API_RESPONSE_META = 'API_RESPONSE_META';

//Esto hay que terminarlo bien

// export function ApiOkResponse(type: ResCodes, message?: string) {
//   return applyDecorators(
//     SetMetadata(API_RESPONSE_META, { type, message })
//   );
// }
export function ApiSuccessResponse<TModel extends Type<any>>(
  model: TModel,
  type: ResCodes,
  isArray = false,
  message?: string
) {
  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: isArray
                ? { type: 'array', items: { $ref: getSchemaPath(model) } }
                : { $ref: getSchemaPath(model) }
            }
          }
        ]
      }
    }),
    ...([SetMetadata(API_RESPONSE_META, { type, message })])
  );
}