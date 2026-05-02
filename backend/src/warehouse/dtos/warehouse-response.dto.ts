import { ApiProperty } from '@nestjs/swagger';

export class WarehouseResponseDto {
  @ApiProperty()
  mask_uuid!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true })
  location?: string;
}

export class WarehouseResponseSelectDto {
  @ApiProperty()
  mask_uuid!: string;

  @ApiProperty()
  name!: string;
}
