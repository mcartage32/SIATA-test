import { registerDecorator, ValidationOptions } from 'class-validator';

export function NoHtml(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'noHtml',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return !/<[^>]*>/g.test(value);
        },
      },
    });
  };
}
