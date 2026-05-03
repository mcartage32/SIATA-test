import { ApiProperty } from '@nestjs/swagger';

export class ShipmentItemResponseDto {
  @ApiProperty()
  mask_uuid!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  unit_price!: number;

  @ApiProperty()
  total_price!: number;
}

export class ShipmentResponseDto {
  @ApiProperty()
  mask_uuid!: string;

  @ApiProperty({ enum: ['land', 'sea'] })
  type!: string;

  @ApiProperty()
  client_id!: number;

  @ApiProperty()
  base_price!: number;

  @ApiProperty()
  discount_percent!: number;

  @ApiProperty()
  discount_amount!: number;

  @ApiProperty()
  total_price!: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  created_by!: string;

  @ApiProperty({ required: false })
  updated_by?: string;

  @ApiProperty({ required: false })
  updated_at?: Date;

  @ApiProperty({ type: [ShipmentItemResponseDto] })
  shipment_item!: ShipmentItemResponseDto[];
}
