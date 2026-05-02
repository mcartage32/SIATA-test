import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NoHtml } from '../../common/validators/no-html.validator.js';

export class CreateClientDto {
  @ApiProperty({ example: 'Marcelo Cartagena' })
  @IsString()
  @MinLength(2)
  @NoHtml({ message: 'HTML is not allowed' })
  name!: string;

  @ApiProperty({ example: 'user@test.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '3001234567', required: false })
  @IsOptional()
  @IsString()
  @NoHtml({ message: 'HTML is not allowed' })
  phone?: string;
}
