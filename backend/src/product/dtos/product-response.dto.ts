import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  mask_uuid!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty()
  price!: number;
}

export class ProductResponseSelectDto {
  @ApiProperty()
  mask_uuid!: string;

  @ApiProperty()
  name!: string;
}
