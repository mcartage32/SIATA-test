/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsUUID,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateShipmentItemDto } from './create-shipment-item.dto.js';

export enum ShipmentType {
  LAND = 'land',
  SEA = 'sea',
}

export class CreateShipmentDto {
  @ApiProperty({ enum: ShipmentType })
  @IsEnum(ShipmentType)
  type!: ShipmentType;

  @ApiProperty()
  @IsUUID()
  clientMaskUuid!: string;

  @ApiProperty({ type: [CreateShipmentItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateShipmentItemDto)
  items!: CreateShipmentItemDto[];

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.type === ShipmentType.LAND)
  @IsUUID()
  warehouseMaskUuid?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.type === ShipmentType.LAND)
  @Matches(/^[A-Z]{3}[0-9]{3}$/)
  vehiclePlate?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.type === ShipmentType.SEA)
  @IsUUID()
  portMaskUuid?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => o.type === ShipmentType.SEA)
  @Matches(/^[A-Z]{3}[0-9]{4}[A-Z]$/)
  fleetNumber?: string;

  @ApiProperty({
    example: '2026-05-10T00:00:00.000Z',
  })
  @IsDateString()
  deliveryDate!: string;
}
