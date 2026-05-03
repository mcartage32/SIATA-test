import {
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  IsDateString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateShipmentItemDto } from './create-shipment-item.dto.js';

export class UpdateShipmentDto {
  @ApiPropertyOptional({
    description: 'Delivery date (must be in the future)',
    example: '2026-05-10',
  })
  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @ApiPropertyOptional({
    description: 'Items to update shipment (replaces all items)',
    type: [CreateShipmentItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShipmentItemDto)
  items?: CreateShipmentItemDto[];

  @ApiPropertyOptional({
    description: 'Warehouse mask UUID (only for LAND)',
  })
  @IsOptional()
  @IsUUID()
  warehouseMaskUuid?: string;

  @ApiPropertyOptional({
    description: 'Vehicle plate (AAA123)',
    example: 'ABC123',
  })
  @IsOptional()
  @Matches(/^[A-Z]{3}[0-9]{3}$/, {
    message: 'Vehicle plate must be in format AAA123',
  })
  vehiclePlate?: string;

  @ApiPropertyOptional({
    description: 'Port mask UUID (only for SEA)',
  })
  @IsOptional()
  @IsUUID()
  portMaskUuid?: string;

  @ApiPropertyOptional({
    description: 'Fleet number (AAA1234A)',
    example: 'ABC1234D',
  })
  @IsOptional()
  @Matches(/^[A-Z]{3}[0-9]{4}[A-Z]$/, {
    message: 'Fleet number must be in format AAA1234A',
  })
  fleetNumber?: string;
}
