import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { NoHtml } from '../../common/validators/no-html.validator.js';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NoHtml({ message: 'HTML is not allowed' })
  name!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price!: number;
}
