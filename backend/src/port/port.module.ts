import { Module } from '@nestjs/common';
import { PortService } from './port.service.js';
import { PortController } from './port.controller.js';

@Module({
  controllers: [PortController],
  providers: [PortService],
})
export class PortModule {}
