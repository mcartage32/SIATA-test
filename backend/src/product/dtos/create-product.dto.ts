import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { NoHtml } from '../../common/validators/no-html.validator.js';
import { NoEmptyOrSpaces } from '../../common/validators/no-empty-spaces.validator.js';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NoHtml({ message: 'HTML is not allowed' })
  @NoEmptyOrSpaces({ message: 'Name cannot be empty or contain only spaces' })
  name!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @NoHtml({ message: 'HTML is not allowed' })
  @NoEmptyOrSpaces({
    message: 'Description cannot be empty or contain only spaces',
  })
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price!: number;
}
