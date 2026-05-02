import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './client/client.module.js';
import { ProductModule } from './product/product.module.js';
import { PortModule } from './port/port.module.js';

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
  ],
})
export class AppModule {}
