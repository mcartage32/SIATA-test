import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './client/client.module.js';
import { ProductModule } from './product/product.module.js';
import { PortModule } from './port/port.module.js';
import { WarehouseModule } from './warehouse/warehouse.module.js';
import { ShipmentModule } from './shipment/shipment.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ClientModule,
    ProductModule,
    PortModule,
    WarehouseModule,
    ShipmentModule,
  ],
})
export class AppModule {}
