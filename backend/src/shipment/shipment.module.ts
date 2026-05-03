import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service.js';
import { ShipmentController } from './shipment.controller.js';

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService],
})
export class ShipmentModule {}
