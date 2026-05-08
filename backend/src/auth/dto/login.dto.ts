/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { NoEmptyOrSpaces } from '../../common/validators/no-empty-spaces.validator.js';

export class LoginDto {
  @ApiProperty({
    example: 'user@test.com',
    description: 'User email address',
  })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'User password',
  })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({
    message: 'Password is required',
  })
  @NoEmptyOrSpaces({ message: 'Password cannot be empty or spaces only' })
  password!: string;
}
