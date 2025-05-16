import { ValidatorOptions } from "class-validator";
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export const validationOptions: ValidationPipeOptions = {
  whitelist: true,  // Eliminar propiedades no definidas en DTOs -> prefiero warning y eliminar + dev msg
  forbidNonWhitelisted: true, // Lanzar error si hay propiedades no permitidas -> prefiero warning + devolver en msg
  forbidUnknownValues: true,
  transform: true, // Habilitar transformación ??
  skipMissingProperties: false,
  enableDebugMessages: true
}


export interface ValidationPipeOptions extends ValidatorOptions {
//   transform?: boolean;
//   disableErrorMessages?: boolean;
//   exceptionFactory?: (errors: ValidationError[]) => any;
  //start
  enableDebugMessages: true;
  skipMissingProperties: false;
  skipUndefinedProperties?: false;
  skipNullProperties?: false;
  transform: true;
}





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
      throw new BadRequestException('Query params are required but were not provided.');
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

      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
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
