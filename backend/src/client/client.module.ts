import { Module } from '@nestjs/common';
import { ClientService } from './client.service.js';
import { ClientController } from './client.controller.js';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
