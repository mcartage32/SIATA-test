/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { NoEmptyOrSpaces } from '../../common/validators/no-empty-spaces.validator.js';

export class RegisterDto {
  @ApiProperty({
    example: 'user@test.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty({
    message: 'Email is required',
  })
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'User password (min 6 characters)',
  })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({
    message: 'Password is required',
  })
  @MinLength(6)
  @NoEmptyOrSpaces({ message: 'Password cannot be empty or spaces only' })
  password!: string;
}
