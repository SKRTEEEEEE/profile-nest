import { ValidatorOptions } from "class-validator";
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { InputParseError } from "src/domain/flows/domain.error";

export const validationOptions: ValidationPipeOptions = {
  whitelist: true,  // Eliminar propiedades no definidas en DTOs -> prefiero warning y eliminar + dev msg
  forbidNonWhitelisted: true, // Lanzar error si hay propiedades no permitidas -> prefiero warning + devolver en msg
  forbidUnknownValues: true,
  transform: true, // Habilitar transformación ??
  skipMissingProperties: false,
  enableDebugMessages: true
}


export interface ValidationPipeOptions extends ValidatorOptions {
  enableDebugMessages: true;
  skipMissingProperties: false;
  skipUndefinedProperties?: false;
  skipNullProperties?: false;
  transform: true;
}
//⬆️ No integrado aun




@Injectable()
export class GlobalValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (
      type === 'query' &&
      (value === undefined || value === null || this.isEmptyObject(value))
    ) {
      // Usar tu clase de error de dominio para errores de validación
      throw new InputParseError(GlobalValidationPipe,'Query params are required but were not provided.');
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      const errorMessages = errors
        .map(err => {
          if (err.constraints) {
            return Object.values(err.constraints).join(', ');
          }
          return '';
        })
        .filter(Boolean);

      // Usar tu clase de error de dominio en lugar de BadRequestException
      throw new InputParseError(GlobalValidationPipe,'Validation failed', {
        optionalMessage: errorMessages.join('; ')
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private isEmptyObject(value: any): boolean {
    return typeof value === 'object' && Object.keys(value).length === 0;
  }
}