/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NoHtml } from '../../common/validators/no-html.validator.js';
import { NoEmptyOrSpaces } from '../../common/validators/no-empty-spaces.validator.js';
import { Transform } from 'class-transformer';

export class CreateClientDto {
  @ApiProperty({ example: 'Marcelo Cartagena' })
  @IsString()
  @MinLength(2)
  @NoHtml({ message: 'HTML is not allowed' })
  @NoEmptyOrSpaces({ message: 'Name cannot be empty or spaces only' })
  @Transform(({ value }) => value.trim())
  name!: string;

  @ApiProperty({ example: 'user@test.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '3001234567', required: false })
  @IsOptional()
  @IsString()
  @NoHtml({ message: 'HTML is not allowed' })
  @NoEmptyOrSpaces({ message: 'Phone cannot be empty or spaces only' })
  @Transform(({ value }) => value.trim())
  phone?: string;
}
