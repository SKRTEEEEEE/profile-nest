import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { DtoRegister } from './dto.register';

export function ApiDtoMetadata({
  description = '',
  title = '',
  group = 'Default',
}: {
  description?: string;
  title?: string;
  group?: string;
} = {}) {
  return applyDecorators(
    ApiExtraModels(),
    DtoRegister, // Register the DTO automatically
    (target: any) => {
      Reflect.defineMetadata('swagger/apiDtoDescription', description, target);
      Reflect.defineMetadata('swagger/apiDtoTitle', title || target.name, target);
      Reflect.defineMetadata('swagger/apiDtoGroup', group, target);
    },
  );
}