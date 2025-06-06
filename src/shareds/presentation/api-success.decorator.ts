import { applyDecorators, SetMetadata, Type } from "@nestjs/common";
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { ResCodes } from "src/domain/flows/res.type";
import { SuccessResponseDto } from "./pipes/success-res.dto";

export const API_RESPONSE_META = 'API_RESPONSE_META';

export function ApiSuccessResponse<TModel extends Type<any>>(
  model: TModel,
  type: ResCodes,
  isArray = false,
  message?: string
) {
  if(type === ResCodes.ENTITY_CREATED) {
    return applyDecorators(
      ApiExtraModels(SuccessResponseDto, model),
      ApiCreatedResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(SuccessResponseDto) },
            {
              properties: {
                data: { $ref: getSchemaPath(model) }
              }
            }
          ]
        }
      }),
      ...([SetMetadata(API_RESPONSE_META, { type, message })])
    );
  }
  else {
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

}