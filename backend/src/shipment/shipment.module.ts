import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service.js';
import { ShipmentController } from './shipment.controller.js';
import { ShipmentPricingService } from './domain/shipment-pricing.service.js';
import { ShipmentItemsService } from './domain/shipment-items.service.js';

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService, ShipmentPricingService, ShipmentItemsService],
})
export class ShipmentModule {}
