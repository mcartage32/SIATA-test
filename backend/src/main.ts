import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Agregemos el ValidationPipe global para validar las solicitudes entrantes
  app.useGlobalPipes(new ValidationPipe());
  // Se agrega un prefijo y una version "1" quemada por efectos de la prueba
  app.setGlobalPrefix('api/v1');
  // Habilitamos CORS para permitir solicitudes desde cualquier origen (solo para temas de la prueba)
  app.enableCors();
  // Configuramos Swagger para la documentación de la API
  const config = new DocumentBuilder()
    .setTitle('SIATA - API Test')
    .setDescription('API para el test de SIATA')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
