import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty()
  mask_uuid!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  phone?: string;
}

export class ClientResponseSelectDto {
  @ApiProperty()
  mask_uuid!: string;

  @ApiProperty()
  name!: string;
}
