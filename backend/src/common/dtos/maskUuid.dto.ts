import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MaskUuidParamDto {
  @ApiProperty({
    description: 'Masked UUID of the entity',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  maskUuid!: string;
}
