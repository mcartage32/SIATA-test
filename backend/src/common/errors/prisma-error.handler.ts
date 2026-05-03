import {
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Duplicate value violation');

      case 'P2003':
        throw new ConflictException(
          'Cannot delete or update because it is referenced by another entity',
        );

      case 'P2000':
        throw new BadRequestException('Value exceeds allowed length');

      case 'P2011':
        throw new BadRequestException('Required field missing');

      case 'P2014':
        throw new BadRequestException('Invalid relation between records');

      case 'P2016':
        throw new BadRequestException('Invalid query structure');

      case 'P2021':
      case 'P2022':
        throw new InternalServerErrorException('Database schema mismatch');

      case 'P2025':
        throw new NotFoundException('Record not found');

      case 'P2034':
        throw new ConflictException('Database transaction conflict');

      default:
        throw new InternalServerErrorException(
          `Unhandled database error (${error.code})`,
        );
    }
  }

  throw error;
}
