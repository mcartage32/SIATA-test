import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export function PaginatedDto<T>(classRef: Type<T>) {
  class PaginatedResponseDtoClass {
    @ApiProperty({ type: [classRef] })
    data!: T[];

    @ApiProperty()
    total!: number;

    @ApiProperty()
    page!: number;

    @ApiProperty()
    limit!: number;

    @ApiProperty()
    totalPages!: number;
  }

  return PaginatedResponseDtoClass;
}
