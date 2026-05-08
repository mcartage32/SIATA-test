import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { NoHtml } from '../../common/validators/no-html.validator.js';
import { NoEmptyOrSpaces } from '../../common/validators/no-empty-spaces.validator.js';

export class CreateWarehouseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NoHtml({ message: 'HTML is not allowed' })
  @NoEmptyOrSpaces({
    message: 'Name cannot be empty or contain only spaces',
  })
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @NoHtml({ message: 'HTML is not allowed' })
  @NoEmptyOrSpaces({
    message: 'Location cannot be empty or contain only spaces',
  })
  location?: string;
}
