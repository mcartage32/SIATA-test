import { ApiProperty } from '@nestjs/swagger';

export class PortResponseDto {
  @ApiProperty()
  mask_uuid!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true })
  location?: string;
}

export class PortResponseSelectDto {
  @ApiProperty()
  mask_uuid!: string;

  @ApiProperty()
  name!: string;
}
