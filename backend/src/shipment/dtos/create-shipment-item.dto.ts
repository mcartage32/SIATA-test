import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateShipmentItemDto {
  @ApiProperty({
    description: 'Product mask UUID',
  })
  @IsUUID()
  productMaskUuid!: string;

  @ApiProperty({
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity!: number;
}
