import { BadRequestException } from '@nestjs/common';

export function getTodayInColombia(): Date {
  return new Date(
    new Date().toLocaleDateString('en-CA', {
      timeZone: 'America/Bogota',
    }),
  );
}

export function toDateOnly(date: string | Date): string {
  return new Date(date).toISOString().split('T')[0];
}

export function validateFutureDate(date: string | Date): Date {
  const input = toDateOnly(date);
  const today = toDateOnly(getTodayInColombia());

  if (input <= today) {
    throw new BadRequestException('Delivery date must be greater than today');
  }

  return new Date(input);
}
