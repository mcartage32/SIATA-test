import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { NoHtml } from '../../common/validators/no-html.validator.js';

export class CreateWarehouseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NoHtml({ message: 'HTML is not allowed' })
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @NoHtml({ message: 'HTML is not allowed' })
  location?: string;
}
