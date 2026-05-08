/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { registerDecorator, ValidationOptions } from 'class-validator';

export function NoEmptyOrSpaces(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'NoEmptyOrSpaces',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && value.trim().length > 0;
        },
        defaultMessage(): string {
          return `${propertyName} should not be empty or only spaces`;
        },
      },
    });
  };
}
