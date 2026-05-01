import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    example: 'User successfully registered',
  })
  message!: string;
}
