import { Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export class DtoValidate {
  static async transform(value: any, metatype: Type) {
    const instance = plainToClass(metatype, value, {
      excludeExtraneousValues: false,
      enableImplicitConversion: true,
    });
    const validationErrors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    });

    if (validationErrors?.length) {
      const errors = DtoValidate.parseErrors(validationErrors);

      throw { value, errors };
    }

    return instance;
  }

  static parseErrors(validationErrors: ValidationError[], parent?: string) {
    const initialValue: string[] = [];

    return validationErrors.reduce((accConstraints, validationError) => {
      const propConnector = parent ? `${parent}.` : '';
      const propertyName = `${propConnector}${validationError.property}`;
      const constraints = validationError.children?.length
        ? this.parseErrors(validationError.children, propertyName)
        : Object.values(validationError.constraints).map(constraint =>
            constraint.replace(validationError.property, propertyName),
          );

      return [...accConstraints, ...constraints];
    }, initialValue);
  }
}
