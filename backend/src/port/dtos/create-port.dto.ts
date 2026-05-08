/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { NoHtml } from '../../common/validators/no-html.validator.js';
import { NoEmptyOrSpaces } from '../../common/validators/no-empty-spaces.validator.js';
import { Transform } from 'class-transformer';

export class CreatePortDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NoHtml({ message: 'HTML is not allowed' })
  @NoEmptyOrSpaces({ message: 'Name cannot be empty or contain only spaces' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @NoHtml({ message: 'HTML is not allowed' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @NoEmptyOrSpaces({
    message: 'Location cannot be empty or contain only spaces',
  })
  location?: string;
}
